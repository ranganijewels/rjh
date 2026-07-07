"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BRAND = "var(--teal-1)"; // --teal-1
const STORAGE_KEY = "rjChatConversationId";

// Lightweight inline icons so the widget carries no extra dependency.
const IconChat = (p) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const IconClose = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconSend = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);

function readStoredUser() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("userRJHouse") || localStorage.getItem("user");
    if (!raw) return {};
    const u = JSON.parse(raw);
    return {
      name: u?.name || u?.fullName || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "",
      email: u?.email || "",
    };
  } catch {
    return {};
  }
}

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [convoId, setConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);

  const lastTsRef = useRef(null);
  const seenIds = useRef(new Set());
  const scrollRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Restore an existing conversation across page loads.
  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (id) setConvoId(id);
  }, []);

  const appendMessages = useCallback((incoming) => {
    if (!incoming?.length) return;
    let addedAgent = 0;
    setMessages((prev) => {
      const next = [...prev];
      for (const m of incoming) {
        if (seenIds.current.has(m.id)) continue;
        seenIds.current.add(m.id);
        next.push(m);
        if (m.sender === "agent" && !openRef.current) addedAgent += 1;
        if (m.createdAt && (!lastTsRef.current || new Date(m.createdAt) > new Date(lastTsRef.current))) {
          lastTsRef.current = m.createdAt;
        }
      }
      next.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return next;
    });
    if (addedAgent) setUnread((u) => u + addedAgent);
  }, []);

  // Poll for new messages whenever a conversation exists.
  useEffect(() => {
    if (!convoId) return;
    let alive = true;
    const tick = async () => {
      try {
        const after = lastTsRef.current ? `?after=${encodeURIComponent(lastTsRef.current)}` : "";
        const res = await fetch(`/api/chat/${convoId}/messages${after}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (!alive) return;
        appendMessages(json?.data?.messages || []);
      } catch {
        /* network hiccup — try again next tick */
      }
    };
    tick();
    const interval = setInterval(tick, 4000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [convoId, appendMessages]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const startConversation = useCallback(async () => {
    if (convoId || starting) return convoId;
    setStarting(true);
    try {
      const u = readStoredUser();
      const res = await fetch(`/api/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorName: u.name || undefined, visitorEmail: u.email || undefined }),
      });
      const json = await res.json();
      const c = json?.data?.conversation;
      const msgs = json?.data?.messages || [];
      if (c?.id) {
        localStorage.setItem(STORAGE_KEY, c.id);
        setConvoId(c.id);
        msgs.forEach((m) => seenIds.current.add(m.id));
        if (msgs.length) lastTsRef.current = msgs[msgs.length - 1].createdAt;
        setMessages(msgs);
      }
      return c?.id || null;
    } finally {
      setStarting(false);
    }
  }, [convoId, starting]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setUnread(0);
    if (!convoId) await startConversation();
  }, [convoId, startConversation]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    try {
      let id = convoId;
      if (!id) id = await startConversation();
      if (!id) return;
      // Optimistic echo so the visitor sees their message instantly.
      const optimistic = {
        id: `local-${Date.now()}`,
        sender: "visitor",
        content: text,
        createdAt: new Date().toISOString(),
        _optimistic: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      const res = await fetch(`/api/chat/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const json = await res.json();
      const saved = json?.data;
      // Replace the optimistic bubble with the persisted message.
      // Note: don't pre-add saved.id to seenIds — appendMessages must see it as
      // new, otherwise it dedupes the message away and the bubble disappears.
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      if (saved?.id) {
        appendMessages([saved]);
      }
    } finally {
      setSending(false);
    }
  }, [input, sending, convoId, startConversation, appendMessages]);

  return (
    <>
      {/* Launcher button */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open live chat"
          style={{ backgroundColor: BRAND }}
          className="fixed bottom-5 right-5 z-[999998] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <IconChat />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white ring-2 ring-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[999999] flex h-[min(560px,calc(100vh-40px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          {/* Header */}
          <div style={{ backgroundColor: BRAND }} className="flex items-center justify-between px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-base font-semibold">RJ</div>
              <div>
                <div className="text-sm font-semibold leading-tight" style={{ fontFamily: "var(--font-source-serif), serif" }}>
                  RJ House Concierge
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/80">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                  Typically replies within minutes
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/15">
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7f7] px-3.5 py-4">
            {messages.map((m) => {
              const mine = m.sender === "visitor";
              const system = m.sender === "system";
              if (system) {
                return (
                  <div key={m.id} className="mx-auto max-w-[90%] rounded-xl bg-white px-3.5 py-2.5 text-center text-[13px] text-gray-600 shadow-sm">
                    {m.content}
                  </div>
                );
              }
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    style={mine ? { backgroundColor: BRAND } : undefined}
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-snug shadow-sm ${
                      mine ? "rounded-br-sm text-white" : "rounded-bl-sm bg-white text-gray-800"
                    } ${m._optimistic ? "opacity-70" : ""}`}
                  >
                    {!mine && m.senderName && (
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: BRAND }}>
                        {m.senderName}
                      </div>
                    )}
                    {m.content}
                  </div>
                </div>
              );
            })}
            {starting && messages.length === 0 && (
              <div className="text-center text-xs text-gray-400">Connecting you to RJ House…</div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-end gap-2 border-t border-gray-100 bg-white px-3 py-2.5">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write a message…"
              className="max-h-24 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[var(--teal-1)]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              aria-label="Send message"
              style={{ backgroundColor: BRAND }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
