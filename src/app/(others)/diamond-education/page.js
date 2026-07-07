import Link from "next/link";

export const metadata = {
  title: "Diamond Education — The 4 Cs & Lab-Grown Guide",
  description:
    "Learn the 4 Cs of diamonds — Cut, Color, Clarity, Carat — and how lab-grown diamonds compare to natural. Expert buying guide from Rangani Jewelry House.",
  alternates: { canonical: "/diamond-education" },
};

const FOUR_CS = [
  { c: "Cut", d: "The most important C — how well a diamond's facets interact with light. A precise cut delivers maximum brilliance, fire and sparkle.", grades: "Ideal · Excellent · Very Good · Good" },
  { c: "Color", d: "Graded D (colorless) to Z (light yellow). The less color, the rarer and more brilliant. D–F is colorless; G–J is near-colorless and exceptional value.", grades: "D · E · F · G · H · I · J" },
  { c: "Clarity", d: "Measures internal inclusions and surface blemishes. From Flawless (FL) down — VS and above are eye-clean and ideal for fine jewelry.", grades: "FL · IF · VVS1–2 · VS1–2 · SI1–2" },
  { c: "Carat", d: "A diamond's weight (1 ct = 0.20 g). Larger carats are rarer, but cut and proportions determine how large a stone actually looks.", grades: "0.50 · 1.00 · 1.50 · 2.00 · 3.00+ ct" },
];

const FAQS = [
  { q: "Are lab-grown diamonds real diamonds?", a: "Yes. Lab-grown diamonds are chemically, physically and optically identical to mined diamonds — same carbon crystal structure, same brilliance, same hardness. They are graded by the same labs (IGI, GIA) on the same 4 Cs." },
  { q: "How are lab-grown diamonds more sustainable?", a: "Lab-grown diamonds are created without mining, are conflict-free by design, and have a dramatically smaller environmental footprint — a core part of the Rangani promise." },
  { q: "Do lab-grown diamonds come certified?", a: "Every Rangani diamond ships with an independent IGI or GIA certificate detailing the 4 Cs, with a report number you can verify online directly with the lab." },
  { q: "Which of the 4 Cs matters most?", a: "Cut. A superbly cut diamond will out-sparkle a larger stone with a poor cut. We recommend prioritizing Cut, then Color and Clarity in the near-colorless / VS range for the best balance of beauty and value." },
  { q: "What does Rangani's warranty cover?", a: "Every piece includes a lifetime warranty against manufacturing defects, complimentary cleaning & inspection, free insured worldwide shipping and easy returns." },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function DiamondEducationPage() {
  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      {/* Hero */}
      <section className="px-[30px] py-[56px] text-center bg-[var(--teal-1)] text-white">
        <p className="text-[12px] tracking-[0.28em] uppercase text-[var(--teal-3)] mb-3">Diamond Education</p>
        <h1 className="text-[40px] leading-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Understand Your Diamond
        </h1>
        <p className="max-w-[640px] mx-auto mt-3 text-[14px] text-[var(--teal-light)]">
          A diamond is forever — choosing it should be effortless. Here&apos;s everything you need to know about
          the 4&nbsp;Cs and lab-grown brilliance.
        </p>
      </section>

      {/* 4 Cs */}
      <section className="px-[30px] py-[48px] max-w-[1100px] mx-auto">
        <h2 className="text-[28px] text-center mb-8" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          The 4 Cs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FOUR_CS.map((x) => (
            <div key={x.c} className="rounded-2xl border border-[var(--teal-3)] p-5">
              <div className="text-[var(--teal-1)] text-[20px] font-[600]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {x.c}
              </div>
              <p className="text-[13px] text-[var(--grey-2)] mt-2 leading-relaxed">{x.d}</p>
              <div className="text-[11px] text-[var(--placeholder)] mt-3 uppercase tracking-wide">{x.grades}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Lab grown */}
      <section className="px-[30px] py-[40px] bg-[var(--grey-00)]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-[28px] mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lab-Grown, Truly Brilliant
          </h2>
          <p className="text-[14px] text-[var(--grey-2)] leading-relaxed">
            Lab-grown diamonds are real diamonds — identical in chemistry, sparkle and hardness to mined stones,
            graded by the same labs on the same 4&nbsp;Cs. They are conflict-free, kinder to the planet, and let
            you choose a larger, finer stone for the same investment. Every Rangani diamond is IGI/GIA certified
            with a verifiable report.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/product" className="px-6 py-3 rounded-full bg-[var(--teal-1)] text-white text-[13px] font-[600]">
              Shop Engagement Rings
            </Link>
            <Link href="/book-an-appointment" className="px-6 py-3 rounded-full border border-[var(--teal-1)] text-[var(--teal-1)] text-[13px] font-[600]">
              Book a Consultation
            </Link>
            <Link href="/ring-size-guide" className="px-6 py-3 rounded-full border border-[var(--teal-3)] text-[var(--grey-2)] text-[13px] font-[600]">
              Ring Size Guide
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-[30px] py-[48px] max-w-[820px] mx-auto">
        <h2 className="text-[28px] text-center mb-8" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-[var(--teal-3)]">
          {FAQS.map((f) => (
            <details key={f.q} className="py-4 group">
              <summary className="cursor-pointer list-none flex justify-between items-center text-[15px] font-[500] text-[var(--grey-2)]">
                {f.q}
                <span className="text-[var(--teal-1)] group-open:rotate-45 transition-transform text-[20px] leading-none">+</span>
              </summary>
              <p className="text-[13.5px] text-[var(--placeholder)] mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
