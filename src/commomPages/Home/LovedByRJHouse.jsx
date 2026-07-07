"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/ranganijewelryhouse";
const HANDLE = "@ranganijewelryhouse";

/* ── Instagram gradient ring ─────────────────────────────────────── */
const InstaAvatar = () => (
  <div className="w-7 h-7 rounded-full p-[1.5px] flex-shrink-0"
    style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
    <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
      <img src="/logo.png" alt="Rangani" className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = "none"; }} />
    </div>
  </div>
);

/* ── Icons ───────────────────────────────────────────────────────── */
const InstaIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const ReelsIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
  </svg>
);

/* Play triangle shown on image/static cards on hover */
const PlayOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  </div>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* Decorative stats per card */
const REEL_STATS = [
  { likes: "3.2k", comments: "48" },
  { likes: "1.8k", comments: "31" },
  { likes: "4.5k", comments: "72" },
  { likes: "2.1k", comments: "19" },
  { likes: "6.0k", comments: "94" },
  { likes: "1.4k", comments: "22" },
];

/* ── Single Reel card ────────────────────────────────────────────── */
const ReelCard = ({ item, index }) => {
  const videoRef = useRef(null);
  const isVideo = item.mediaType === "VIDEO" || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(item.mediaUrl || "");
  const stats = REEL_STATS[index % REEL_STATS.length];
  const caption = item.caption || "Crafted with love ✨ #RanganiJewels";
  const href = item.permalink || INSTAGRAM_URL;

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer
        2xl:w-[260px] 2xl:h-[462px]
        xl:w-[220px] xl:h-[391px]
        w-[175px] h-[311px]
        block"
    >
      {/* Media */}
      {isVideo ? (
        <>
          {/* Poster thumbnail visible before hover */}
          {item.thumbnailUrl && (
            <img
              src={item.thumbnailUrl}
              alt={item.caption?.slice(0, 100) || 'Instagram reel'}
              className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
            />
          )}
          <video
            ref={videoRef}
            src={item.mediaUrl}
            poster={item.thumbnailUrl}
            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            muted
            playsInline
            loop
            preload="metadata"
          />
          {/* Play icon shown until hovered */}
          <PlayOverlay />
        </>
      ) : (
        <>
          <img
            src={item.mediaUrl || item.thumbnailUrl}
            alt={item.caption?.slice(0, 100) || `Reel by ${HANDLE}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <PlayOverlay />
        </>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

      {/* Top bar: Reels label + Instagram logo */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
          <ReelsIcon className="w-3 h-3 text-white" />
          <span className="text-white text-[10px] font-semibold tracking-wide">Reels</span>
        </div>
        <InstaIcon className="w-5 h-5 text-white drop-shadow" />
      </div>

      {/* Right side action icons */}
      <div className="absolute right-3 bottom-[72px] flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white drop-shadow"><HeartIcon /></span>
          <span className="text-white text-[10px] font-medium leading-none">{stats.likes}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white drop-shadow"><CommentIcon /></span>
          <span className="text-white text-[10px] font-medium leading-none">{stats.comments}</span>
        </div>
        <span className="text-white drop-shadow"><ShareIcon /></span>
      </div>

      {/* Bottom: avatar + handle + caption */}
      <div className="absolute bottom-3 left-3 right-12">
        <div className="flex items-center gap-2 mb-1.5">
          <InstaAvatar />
          <span className="text-white text-[11px] font-semibold drop-shadow">{HANDLE}</span>
        </div>
        <p className="text-white/90 text-[10px] leading-snug line-clamp-2 drop-shadow">
          {caption}
        </p>
      </div>
    </Link>
  );
};

/* ── Section ─────────────────────────────────────────────────────── */
const LovedByRJHouse = ({ items }) => {
  const containerRef = useRef(null);
  const [liveItems, setLiveItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram/feed?limit=12")
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json.data) && json.data.length > 0) {
          setLiveItems(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? 300 : -300, behavior: "smooth" });
  };

  // Priority: live Instagram > CMS items (normalised) > empty
  const cmsItems = Array.isArray(items?.loved_by_items)
    ? items.loved_by_items.map((i) => ({
        id: i.id || Math.random().toString(),
        caption: i.review || i.name || "",
        mediaType: /\.(mp4|webm|ogg|mov)(\?|$)/i.test(i.file || "") ? "VIDEO" : "IMAGE",
        mediaUrl: i.file || "",
        thumbnailUrl: i.file || "",
        permalink: INSTAGRAM_URL,
      }))
    : [];

  const reelItems = liveItems.length > 0 ? liveItems : cmsItems;
  const showPlaceholder = !loading && reelItems.length === 0;

  return (
    <section className="md:px-[30px] px-[18px]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
            <InstaIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="xl:text-[28px] text-[20px] font-[500] text-[var(--teal-1)] leading-tight">
              {items?.title || "Loved By Our Customers"}
            </h2>
            <p className="text-[13px] text-[var(--grey-2)]">
              Follow us on Instagram{" "}
              <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="font-medium text-[var(--teal-1)] hover:underline">
                {HANDLE}
              </Link>
            </p>
          </div>
        </div>

        {/* Scroll arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("prev")}
            className="w-9 h-9 rounded-full border border-[var(--teal-3)] flex items-center justify-center text-[var(--grey-2)] hover:bg-[var(--product-bg)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("next")}
            className="w-9 h-9 rounded-full border border-[var(--teal-3)] flex items-center justify-center text-[var(--grey-2)] hover:bg-[var(--product-bg)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reels strip */}
      {loading ? (
        /* Skeleton while fetching */
        <div className="flex gap-3 overflow-x-hidden pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-xl animate-pulse bg-[var(--product-bg)]
                2xl:w-[260px] 2xl:h-[462px] xl:w-[220px] xl:h-[391px] w-[175px] h-[311px]"
            />
          ))}
        </div>
      ) : reelItems.length > 0 ? (
        <div
          ref={containerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {reelItems.map((item, i) => (
            <ReelCard key={item.id || i} item={item} index={i} />
          ))}
        </div>
      ) : (
        /* Placeholder — shown when no token set and no CMS data */
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Link
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 rounded-xl overflow-hidden
                2xl:w-[260px] 2xl:h-[462px] xl:w-[220px] xl:h-[391px] w-[175px] h-[311px]
                flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}
            >
              <div className="text-center">
                <InstaIcon className="w-10 h-10 text-white/60 mx-auto mb-2" />
                <span className="text-white/70 text-xs">{HANDLE}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Follow CTA */}
      <div className="mt-6 text-center">
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--teal-1)] text-white text-sm font-medium transition-colors hover:bg-[var(--teal-2)]"
        >
          <InstaIcon className="w-4 h-4 text-[var(--yellow-gold)]" />
          Follow us on Instagram
        </Link>
      </div>
    </section>
  );
};

export default LovedByRJHouse;
