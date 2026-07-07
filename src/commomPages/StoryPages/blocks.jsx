"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import { useHomepageData } from "../Home/useHomepageData";

/* ─────────────────────────────────────────────────────────────────────────────
   Editorial block library for the story pages (About / Craftsmanship /
   Sustainability / Customer Love). Every block accepts an `id` and gets
   `scroll-mt` so the nav deep-links (/page#id) park below the sticky navbar.
   Brand: navy --teal-1, steel --teal-2, gold --yellow-gold, Cormorant serif.
──────────────────────────────────────────────────────────────────────────── */

const Eyebrow = ({ children, light }) => (
  <p
    className={`text-[11px] md:text-[12px] uppercase tracking-[0.22em] mb-[14px] ${
      light ? "text-[var(--yellow-gold)]" : "text-[var(--teal-2)]"
    }`}
  >
    {children}
  </p>
);

const SerifTitle = ({ children, light, size = "md" }) => (
  <h2
    className={`font-[var(--font-cormorant)] font-medium leading-[1.12] tracking-[-0.01em] ${
      size === "lg"
        ? "text-[32px] md:text-[44px]"
        : "text-[28px] md:text-[36px]"
    } ${light ? "text-white" : "text-[var(--grey-2)]"}`}
  >
    {children}
  </h2>
);

const Body = ({ paragraphs = [], light, center }) => (
  <div className={center ? "text-center" : ""}>
    {paragraphs.map((p, i) => (
      <p
        key={i}
        className={`text-[15px] md:text-[16px] leading-[1.85] mt-[16px] ${
          light ? "text-white/75" : "text-[var(--placeholder)]"
        }`}
      >
        {p}
      </p>
    ))}
  </div>
);

const anchor = "scroll-mt-[130px]";

/* ── Split: image beside editorial text (optionally bullets / quote / CTA) ── */
export const Split = ({
  id, eyebrow, title, body = [], image, imageAlt, reverse,
  bullets, quoteLine, button,
}) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className={`flex flex-col md:flex-row items-center gap-[28px] md:gap-[56px] xl:gap-[88px] ${reverse ? "md:flex-row-reverse" : ""}`}>
      <div className="md:w-1/2 w-full">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={imageAlt || title}
            className="w-full aspect-[4/5] md:aspect-[5/6] object-cover"
            loading="lazy"
          />
          {/* hairline inset frame — quiet luxury detail */}
          <div className="pointer-events-none absolute inset-[14px] border border-white/40" />
        </div>
      </div>
      <div className="md:w-1/2 w-full md:py-[20px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SerifTitle>{title}</SerifTitle>
        {quoteLine && (
          <p className="font-[var(--font-cormorant)] italic text-[19px] md:text-[22px] leading-[1.5] text-[var(--teal-1)] mt-[18px] border-l-2 border-[var(--yellow-gold)] pl-[18px]">
            {quoteLine}
          </p>
        )}
        <Body paragraphs={body} />
        {bullets?.length > 0 && (
          <ul className="mt-[22px] space-y-[12px]">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-[12px] text-[14px] md:text-[15px] leading-[1.6] text-[var(--grey-2)]">
                <svg viewBox="0 0 12 12" className="w-[11px] h-[11px] mt-[5px] shrink-0 text-[var(--yellow-gold)]" fill="currentColor" aria-hidden>
                  <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        )}
        {button && (
          <div className="mt-[28px]">
            <Button title={button.text} url={button.url} variant="outlineTeal" />
          </div>
        )}
      </div>
    </div>
  </section>
);

/* ── Stats: slim band of serif figures (light or navy) ── */
export const Stats = ({ id, items = [], dark }) => (
  <section
    id={id}
    className={`${anchor} ${dark ? "bg-[var(--teal-1)]" : "bg-white border-y border-[var(--teal-3)]"}`}
  >
    <div className="container mx-auto xl:px-[30px] px-[18px] py-[36px] md:py-[46px] grid grid-cols-2 md:grid-cols-4 gap-y-[28px]">
      {items.map((s, i) => (
        <div key={i} className="text-center px-[10px]">
          <p className={`font-[var(--font-cormorant)] font-medium text-[30px] md:text-[40px] leading-none ${dark ? "text-[var(--yellow-gold)]" : "text-[var(--teal-1)]"}`}>
            {s.value}
          </p>
          <p className={`mt-[10px] text-[11px] md:text-[12px] uppercase tracking-[0.16em] ${dark ? "text-white/70" : "text-[var(--placeholder)]"}`}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

/* ── Values: full-bleed navy band with 3 principle cards ── */
const VALUE_ICONS = {
  shield: (
    <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1.2 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" />
  ),
  gem: (
    <path d="M6 3h12l4 6-10 12L2 9l4-6zm2.2 2L5.6 9h4l1.8-4H8.2zm7.6 0h-3.2l1.8 4h4l-2.6-4zM12 19.2L8.4 11h7.2L12 19.2zM6.5 11H4.3l5 6-2.8-6zm13.2 0h-2.2l-2.8 6 5-6z" />
  ),
  infinity: (
    <path d="M18.5 8A4.5 4.5 0 0123 12.5 4.5 4.5 0 0118.5 17c-1.7 0-3-.9-4.5-2.6C12.5 16.1 11.2 17 9.5 17A4.5 4.5 0 015 12.5 4.5 4.5 0 019.5 8c1.7 0 3 .9 4.5 2.6C15.5 8.9 16.8 8 18.5 8zm-9 2A2.5 2.5 0 007 12.5 2.5 2.5 0 009.5 15c1 0 1.9-.7 3.2-2.5C11.4 10.7 10.5 10 9.5 10zm9 0c-1 0-1.9.7-3.2 2.5 1.3 1.8 2.2 2.5 3.2 2.5a2.5 2.5 0 002.5-2.5A2.5 2.5 0 0018.5 10z" />
  ),
  leaf: (
    <path d="M5 21c.5-4.5 2.3-8.2 5.4-11.1C13.5 7 17.4 5.4 22 5c-.4 4.6-2 8.5-4.9 11.6C14.2 19.7 10.5 21.5 6 22l-1-1zm2.4-1.6c3.4-.6 6.2-2 8.5-4.3 2.3-2.3 3.7-5.1 4.3-8.5-3.4.6-6.2 2-8.5 4.3-2.3 2.3-3.7 5.1-4.3 8.5zM4 14C4 8 8 4 14 4c-.5 1.5-1.3 2.8-2.4 4C8.8 8.7 6.6 10.9 5 14H4z" />
  ),
  doc: (
    <path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
  ),
  spark: (
    <path d="M12 1l2.4 7.6L22 11l-7.6 2.4L12 21l-2.4-7.6L2 11l7.6-2.4L12 1zm7 14l1.2 3.8L24 20l-3.8 1.2L19 25l-1.2-3.8L14 20l3.8-1.2L19 15z" />
  ),
};

export const Values = ({ id, eyebrow, title, intro, cards = [] }) => (
  <section id={id} className={`${anchor} bg-[var(--teal-1)]`}>
    <div className="container mx-auto xl:px-[30px] px-[18px] py-[56px] md:py-[76px]">
      <div className="max-w-[720px] mx-auto text-center">
        {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
        <SerifTitle light>{title}</SerifTitle>
        {intro && <Body paragraphs={[intro]} light center />}
      </div>
      <div className="grid md:grid-cols-3 gap-[18px] md:gap-[26px] mt-[42px]">
        {cards.map((c, i) => (
          <div key={i} className="border border-white/15 bg-white/[0.04] px-[26px] py-[32px] text-center">
            <svg viewBox="0 0 24 24" className="w-[30px] h-[30px] mx-auto text-[var(--yellow-gold)]" fill="currentColor" aria-hidden>
              {VALUE_ICONS[c.icon] || VALUE_ICONS.gem}
            </svg>
            <h3 className="font-[var(--font-cormorant)] text-[21px] md:text-[24px] text-white mt-[16px]">
              {c.title}
            </h3>
            <p className="text-[13.5px] md:text-[14px] leading-[1.75] text-white/70 mt-[10px]">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Quote: centered serif pull-quote with flanking rules ── */
export const Quote = ({ id, eyebrow, title, quote, body = [] }) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className="max-w-[780px] mx-auto text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SerifTitle>{title}</SerifTitle>
      <div className="flex items-center justify-center gap-[18px] mt-[30px]" aria-hidden>
        <span className="h-px w-[64px] bg-[var(--teal-3)]" />
        <svg viewBox="0 0 12 12" className="w-[10px] h-[10px] text-[var(--yellow-gold)]" fill="currentColor">
          <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
        </svg>
        <span className="h-px w-[64px] bg-[var(--teal-3)]" />
      </div>
      <p className="font-[var(--font-cormorant)] italic text-[24px] md:text-[32px] leading-[1.4] text-[var(--teal-1)] mt-[26px]">
        “{quote}”
      </p>
      <Body paragraphs={body} center />
    </div>
  </section>
);

/* ── Process: numbered atelier steps beside an image ── */
export const Process = ({ id, eyebrow, title, intro, steps = [], image, imageAlt }) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className="flex flex-col md:flex-row gap-[32px] md:gap-[64px] xl:gap-[92px] items-stretch">
      <div className="md:w-[45%] w-full">
        <div className="relative h-full min-h-[320px]">
          <img src={image} alt={imageAlt || title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="pointer-events-none absolute inset-[14px] border border-white/40" />
        </div>
      </div>
      <div className="md:w-[55%] w-full md:py-[8px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SerifTitle>{title}</SerifTitle>
        {intro && <Body paragraphs={[intro]} />}
        <ol className="mt-[30px]">
          {steps.map((s, i) => (
            <li key={i} className={`flex gap-[22px] py-[20px] ${i > 0 ? "border-t border-[var(--teal-3)]" : ""}`}>
              <span className="font-[var(--font-cormorant)] text-[26px] md:text-[30px] leading-none text-[var(--yellow-gold)] w-[44px] shrink-0 pt-[2px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <h3 className="text-[15px] md:text-[16px] font-[500] tracking-[0.02em] text-[var(--grey-2)] uppercase">
                  {s.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[1.75] text-[var(--placeholder)] mt-[6px]">
                  {s.text}
                </p>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

/* ── Duo: two tall image feature cards ── */
export const Duo = ({ id, eyebrow, title, intro, cards = [] }) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className="max-w-[720px] mx-auto text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SerifTitle>{title}</SerifTitle>
      {intro && <Body paragraphs={[intro]} center />}
    </div>
    <div className="grid md:grid-cols-2 gap-[20px] md:gap-[30px] mt-[42px]">
      {cards.map((c, i) => (
        <figure key={i} className="relative overflow-hidden group">
          <img src={c.image} alt={c.title} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-[24px] md:p-[30px]">
            <h3 className="font-[var(--font-cormorant)] text-[24px] md:text-[28px] text-white">{c.title}</h3>
            <p className="text-[13.5px] md:text-[14px] leading-[1.7] text-white/85 mt-[8px] max-w-[520px]">{c.text}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

/* ── Stories: three portrait cards with captions ── */
export const Stories = ({ id, eyebrow, title, intro, cards = [] }) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className="max-w-[720px] mx-auto text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SerifTitle>{title}</SerifTitle>
      {intro && <Body paragraphs={[intro]} center />}
    </div>
    <div className="grid md:grid-cols-3 gap-[20px] md:gap-[28px] mt-[42px]">
      {cards.map((c, i) => (
        <figure key={i} className="bg-white border border-[var(--teal-3)]">
          <img src={c.image} alt={c.title} className="w-full aspect-[4/5] object-cover" loading="lazy" />
          <figcaption className="p-[22px]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--teal-2)]">{c.tag}</p>
            <h3 className="font-[var(--font-cormorant)] text-[21px] text-[var(--grey-2)] mt-[8px]">{c.title}</h3>
            <p className="text-[13.5px] leading-[1.7] text-[var(--placeholder)] mt-[8px]">{c.text}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

/* ── Mosaic: staggered photo wall ── */
export const Mosaic = ({ id, eyebrow, title, intro, images = [] }) => (
  <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
    <div className="max-w-[720px] mx-auto text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SerifTitle>{title}</SerifTitle>
      {intro && <Body paragraphs={[intro]} center />}
    </div>
    <div className="columns-2 md:columns-3 gap-[16px] mt-[42px] [&>img]:mb-[16px]">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Client moment"
          className={`w-full object-cover ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}`}
          loading="lazy"
        />
      ))}
    </div>
  </section>
);

/* ── Testimonials: live CMS reviews (/api/home testimonial_section) as
      editorial quote cards. (The legacy CustomerReview carousel maps a
      `testimonialitems` key the API no longer sends, so it renders empty —
      these cards read the real `reviews` array instead.) ── */
const Star = ({ dim }) => (
  <svg viewBox="0 0 20 20" className={`w-[14px] h-[14px] ${dim ? "text-[var(--teal-3)]" : "text-[var(--yellow-gold)]"}`} fill="currentColor" aria-hidden>
    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
);

export const Testimonials = ({ id, eyebrow, title, intro }) => {
  const { homeData } = useHomepageData();
  const reviews = homeData?.testimonial_section?.[0]?.reviews || [];
  return (
    <section id={id} className={`${anchor} container mx-auto xl:px-[30px] px-[18px]`}>
      <div className="max-w-[720px] mx-auto text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SerifTitle>{title}</SerifTitle>
        {intro && <Body paragraphs={[intro]} center />}
      </div>
      {reviews.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-[18px] md:gap-[24px] mt-[42px]">
          {reviews.map((r, i) => (
            <figure key={r.id || i} className="bg-white border border-[var(--teal-3)] px-[24px] py-[28px] flex flex-col">
              <span className="font-[var(--font-cormorant)] text-[44px] leading-none text-[var(--yellow-gold)]" aria-hidden>
                “
              </span>
              <blockquote className="text-[14px] leading-[1.75] text-[var(--grey-2)] -mt-[10px] grow">
                {r.review}
              </blockquote>
              <figcaption className="mt-[18px] pt-[16px] border-t border-[var(--teal-3)]">
                <div className="flex gap-[3px] mb-[8px]" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} dim={n > (Number(r.rating) || 5)} />
                  ))}
                </div>
                <p className="text-[13px] font-[500] tracking-[0.04em] uppercase text-[var(--teal-1)]">
                  {r.name}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
};

/* ── Renderer ── */
const REGISTRY = {
  split: Split,
  stats: Stats,
  values: Values,
  quote: Quote,
  process: Process,
  duo: Duo,
  stories: Stories,
  mosaic: Mosaic,
  testimonials: Testimonials,
};

export const StoryBlocks = ({ blocks = [] }) => (
  <div className="xl:space-y-[88px] space-y-[52px]">
    {blocks.map((b, i) => {
      const Cmp = REGISTRY[b.type];
      return Cmp ? <Cmp key={b.id || i} {...b} /> : null;
    })}
  </div>
);

export default StoryBlocks;
