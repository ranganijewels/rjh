import LazyVideo from "@/components/common/LazyVideo";
import React from "react";
import Button from "../../components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import Heading from "@/components/ui/Heading/Heading";
import { useFileType } from "@/hooks/useFileType";
import {
  Gem, Diamond, Award, Crown, Sparkles, Truck, RotateCcw, ShieldCheck,
  BadgeCheck, Lock, Heart, Gift, Leaf, Headphones, ScrollText, Star,
} from "lucide-react";
import { responsiveImg } from "@/lib/imageSizes";

// Feature icons are stored as a KEY (chosen via the CMS icon picker) and rendered
// as real SVGs. Keys MUST match rjhouse-cms IconPicker's FEATURE_ICONS.
const FEATURE_ICONS = {
  gem: Gem, diamond: Diamond, award: Award, crown: Crown, sparkles: Sparkles,
  truck: Truck, undo: RotateCcw, shield: ShieldCheck, badge: BadgeCheck, lock: Lock,
  heart: Heart, gift: Gift, leaf: Leaf, headset: Headphones, certificate: ScrollText, star: Star,
};
// Auto-upgrade legacy emoji content to the matching SVG.
const EMOJI_ALIAS = {
  "💎": "gem", "🏆": "award", "🚚": "truck", "🚛": "truck", "↩️": "undo", "🔄": "undo",
  "✨": "sparkles", "🛡️": "shield", "🛡": "shield", "🎁": "gift", "❤️": "heart",
  "👑": "crown", "🔒": "lock", "🌿": "leaf", "⭐": "star", "🎧": "headset", "📜": "certificate", "✅": "badge",
};

const FeatureIcon = ({ icon }) => {
  const key = FEATURE_ICONS[icon] ? icon : EMOJI_ALIAS[icon];
  const Cmp = key ? FEATURE_ICONS[key] : null;
  if (Cmp) return <Cmp size={38} strokeWidth={1.5} style={{ color: "var(--teal-1)" }} />;
  // Unknown value — fall back to rendering it as text (keeps any custom emoji).
  return <span className="text-[40px]">{icon || "✨"}</span>;
};

const WhyChoose = ({ collections }) => {
  // Support both old (left/right sections) and new (items array) data formats
  const leftFile = collections?.why_choose_left_sections?.[0]?.file || "";
  const rightSection = collections?.why_choose_right_sections?.[0] || {};
  const items = collections?.items || [];
  const heading = collections?.title || collections?.heading || "Why Choose Us";
  const subHeading = collections?.sub_heading || "";
  // CMS Studio ▸ Homepage ▸ Why Choose ▸ "Background video / image".
  const mediaFile =
    leftFile || rightSection.file || collections?.video_url || collections?.media_url || "";
  const ctaText = collections?.cta_text || "";
  const ctaLink = collections?.cta_link || "";

  const { isVideo } = useFileType(mediaFile);
  const { isVideo: isRightVideo } = useFileType(rightSection.file || mediaFile);

  // Split layout (ELOVA-style): media on the left, the same media with an
  // overlay panel (sub-heading + CTA) on the right.
  if (mediaFile) {
    return (
      <section className="xl:px-[30px] px-[18px] py-10 lg:py-16">
        <Heading title={heading} className="xl:mb-[30px] mb-[15px]" />
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="w-auto">
            {isVideo ? (
              <LazyVideo
                className="w-full xl:h-[709px] h-[378px] object-cover"
                src={mediaFile}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                {...responsiveImg(mediaFile, "(min-width: 1024px) 50vw, 100vw")}
                src={mediaFile}
                alt="Why Choose"
                width={960}
                height={709}
                loading="lazy"
                decoding="async"
                className="w-full xl:h-[709px] h-[378px] object-cover"
              />
            )}
          </div>
          <div className="relative overflow-hidden w-auto xl:h-[709px] h-[378px]">
            {isRightVideo ? (
              <LazyVideo
                className="absolute inset-0 w-full h-full object-cover"
                src={rightSection.file || mediaFile}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={rightSection.file || mediaFile}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
            <div className="relative p-5 xl:p-10 flex flex-col items-start justify-end h-full">
              {rightSection.title && (
                <h2 className="text-[var(--grey-00)] text-[16px] xl:text-[24px] font-[400] tracking-[0.48px] mb-[10px] xl:mb-[18px]">
                  {rightSection.title}
                </h2>
              )}
              {(rightSection.description || subHeading) && (
                <Typography variant="p" textColor="white" className="mb-[12px] xl:mb-[24px] !font-[300]">
                  {rightSection.description || subHeading}
                </Typography>
              )}
              {rightSection.buttons?.length
                ? rightSection.buttons.map((btn, index) => (
                    <Button
                      key={index}
                      title={btn?.button_text}
                      background={btn?.button_color}
                      border={btn?.button_border}
                      url={btn?.button_url}
                    />
                  ))
                : ctaText && (
                    <Button title={ctaText} url={ctaLink} variant="outlineWhite" />
                  )}
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] xl:gap-[24px] mt-[28px] xl:mt-[40px]">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-[10px] xl:gap-[12px] px-[16px] py-[24px] xl:p-[28px] border border-[var(--teal-3)] rounded bg-white"
              >
                <span className="w-[56px] h-[56px] xl:w-[64px] xl:h-[64px] rounded-full bg-[var(--teal-3)]/25 flex items-center justify-center">
                  <FeatureIcon icon={item.icon} />
                </span>
                <h3 className="font-[500] text-[15px] xl:text-[16px]">{item.title}</h3>
                <p className="text-[13px] xl:text-[14px] text-[var(--grey-2)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // No media: fall back to the icon grid so CMS features are still shown.
  if (items.length > 0) {
    return (
      <section className="xl:px-[30px] px-[18px] py-10 lg:py-16">
        <Heading title={heading} className="xl:mb-[30px] mb-[15px]" />
        {subHeading && (
          <p className="text-center text-[var(--grey-2)] mb-[30px] xl:text-[18px] text-[14px]">
            {subHeading}
          </p>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] xl:gap-[24px]">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-[10px] xl:gap-[12px] px-[16px] py-[24px] xl:p-[28px] border border-[var(--teal-3)] rounded bg-white"
            >
              <span className="w-[56px] h-[56px] xl:w-[64px] xl:h-[64px] rounded-full bg-[var(--teal-3)]/25 flex items-center justify-center">
                <FeatureIcon icon={item.icon} />
              </span>
              <h3 className="font-[500] text-[15px] xl:text-[16px]">{item.title}</h3>
              <p className="text-[13px] xl:text-[14px] text-[var(--grey-2)] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="xl:px-[30px] px-[18px]">
      <Heading title={heading} className="xl:mb-[30px] mb-[15px]" />
    </section>
  );
};

export default WhyChoose;
