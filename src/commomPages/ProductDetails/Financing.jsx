"use client";

// Affordability framing under the price (per-month illustration). BNPL isn't
// wired yet, so this is worded as "coming soon" rather than promising a plan
// that doesn't exist at checkout. Re-word once a provider is integrated.
export default function Financing({ price, symbol = "$", config }) {
  const cfg = config || {};
  if (cfg.enabled === false) return null; // hide entirely via CMS
  const total = Number(price) || 0;
  if (total <= 0) return null;
  const months = Number(cfg.months) > 0 ? Number(cfg.months) : 4;
  const note = cfg.note ?? "interest-free installment plans coming soon";
  const per = (total / months).toFixed(0);

  return (
    <div className="mt-2 flex items-center gap-2 text-[13px] text-[var(--grey-2)]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="var(--teal-1)" strokeWidth="1.6" />
        <path d="M2 9.5h20" stroke="var(--teal-1)" strokeWidth="1.6" />
      </svg>
      <span>
        approximately {symbol}
        {Number(per).toLocaleString()}/mo over {months} months
        {note ? <span className="text-[var(--placeholder)]"> · {note}</span> : null}
      </span>
    </div>
  );
}
