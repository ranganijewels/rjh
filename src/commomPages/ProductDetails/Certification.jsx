"use client";

import Typography from "@/components/ui/Typography/Typography";

const NAVY = "#162640";

// Known grading labs → display name + verify URL builder
const LABS = {
  GIA: { name: "GIA", full: "Gemological Institute of America", verify: (n) => `https://www.gia.edu/report-check?reportno=${encodeURIComponent(n)}` },
  IGI: { name: "IGI", full: "International Gemological Institute", verify: (n) => `https://www.igi.org/verify-your-report/?r=${encodeURIComponent(n)}` },
  IGL: { name: "IGL", full: "International Gemological Laboratories", verify: () => null },
  HRD: { name: "HRD", full: "HRD Antwerp", verify: () => null },
  GCAL: { name: "GCAL", full: "Gem Certification & Assurance Lab", verify: () => null },
  SGL: { name: "SGL", full: "Solitaire Gemological Laboratories", verify: () => null },
};

const Cell = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center text-center px-2 py-3 rounded-[10px] bg-[var(--grey-00)]">
    <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--placeholder)]">
      {label}
    </span>
    <span className="text-[15px] font-[600] mt-1 text-[var(--grey-2)]">
      {value || "—"}
    </span>
  </div>
);

const Certification = ({ product }) => {
  if (!product) return null;

  const center =
    product?.diamonds?.find((d) => d?.center === 1) || product?.diamonds?.[0] || {};

  const carat = center?.wt || product?.diamond_weight_ct || "";
  const cut = product?.diamond_cut || center?.cut || "Excellent";
  const color = product?.diamond_color || center?.color || "";
  const clarity = product?.diamond_clarity || center?.clarity || "";
  const certLab = (product?.cert_lab || "").toUpperCase().trim();
  const certNumber = product?.cert_number || "";
  const certUrl = product?.cert_url || "";

  const lab = LABS[certLab];
  const verifyHref =
    certUrl || (lab && certNumber ? lab.verify(certNumber) : null);

  const caratLabel = carat ? `${carat} ct` : "—";

  return (
    <div className="mt-2 rounded-2xl border border-[var(--teal-3)] overflow-hidden">
      {/* Header band */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l2.39 4.84L20 7.7l-3.8 3.7L17.09 17 12 14.3 6.91 17 8 11.4 4 7.7l5.61-.86L12 2z"
              fill="#dfc180"
            />
          </svg>
          <div className="leading-tight">
            <div className="text-white text-[15px] font-[600]">
              Certified &amp; Guaranteed Authentic
            </div>
            <div className="text-[var(--teal-3)] text-[12px]">
              {lab
                ? `${lab.name} graded — ${lab.full}`
                : "Independently graded & conflict-free"}
            </div>
          </div>
        </div>
        {certNumber && (
          <div className="text-right hidden sm:block">
            <div className="text-[var(--teal-3)] text-[10px] uppercase tracking-wider">
              Report No.
            </div>
            <div className="text-white text-[13px] font-[600]">{certNumber}</div>
          </div>
        )}
      </div>

      {/* 4Cs grid */}
      <div className="p-5 bg-white">
        <Typography
          variant="h6"
          className="!text-[12px] uppercase tracking-[0.14em] text-[var(--placeholder)] mb-3"
        >
          The 4 Cs
        </Typography>
        <div className="grid grid-cols-4 gap-2">
          <Cell label="Cut" value={cut} />
          <Cell label="Color" value={color} />
          <Cell label="Clarity" value={clarity} />
          <Cell label="Carat" value={caratLabel} />
        </div>

        {/* Verify + assurances */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {verifyHref ? (
            <a
              href={verifyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-[600]"
              style={{ color: NAVY }}
            >
              Verify certificate
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span className="text-[13px] text-[var(--placeholder)]">
              Certificate provided with every piece
            </span>
          )}
          <span className="text-[12px] text-[var(--grey-2)]">
            • Lifetime warranty
          </span>
          <span className="text-[12px] text-[var(--grey-2)]">
            • Free insured worldwide shipping
          </span>
        </div>
      </div>
    </div>
  );
};

export default Certification;
