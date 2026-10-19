"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/consent";

// Cookie / tracking choice. Nothing marketing-related loads until "Accept".
// The footer "Cookie settings" link re-opens it (event: rj-open-consent).
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    const onClick = (e) => {
      const a = e.target?.closest?.('a[href="#cookie-settings"]');
      if (a) { e.preventDefault(); reopen(); }
    };
    window.addEventListener("rj-open-consent", reopen);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("rj-open-consent", reopen);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!open) return null;
  const choose = (v) => { setConsent(v); setOpen(false); };

  return (
    <div role="dialog" aria-label="Cookie preferences"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-[420px] z-[9999] bg-white border border-[#162640]/20 shadow-xl rounded-md p-4 text-[#162640]">
      <p className="text-[13px] leading-[1.5]">
        We use cookies to understand how the site is used and to measure our advertising. Essential cookies always run;
        analytics and advertising cookies only run if you accept. See our{" "}
        <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("denied")}
          className="flex-1 border border-[#162640] rounded px-3 py-2 text-[13px] font-medium hover:bg-[#162640]/5">Reject</button>
        <button type="button" onClick={() => choose("granted")}
          className="flex-1 bg-[#162640] text-white rounded px-3 py-2 text-[13px] font-medium hover:bg-[#091930]">Accept</button>
      </div>
    </div>
  );
}
