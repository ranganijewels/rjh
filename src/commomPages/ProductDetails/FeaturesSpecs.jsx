import Accordion from "@/components/ui/Accordion/Accordion";
import Link from "next/link";
import { SHIPPING_BULLETS, DELIVERY, certificateFor } from "@/content/policies";
import {
  CareGuideIcon,
  CleaningDiamondIcon,
  Maintenance,
  Pin,
  TravelTips,
} from "@/components/Icons/common/CareGuideIcon";
import Typography from "@/components/ui/Typography/Typography";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqs } from "@/store/slices/faqSlice";
import { formatCarat, toTitleCase } from "@/utils/string";
import { resolveTokens } from "@/lib/resolveTokens";

const AccordionListSection = ({ title, icon, points, isLast }) => {
  return (
    <Accordion
      title={title}
      icon={icon}
      btnStyle="!capitalize"
      caretIcons={{
        open: "/icons/minus.svg",
        close: "/icons/plus.svg",
      }}
      containerClass={isLast ? "!border-b-0" : ""}
    >
      <ul className="inline-flex flex-col justify-start items-start gap-2 list-disc list-inside marker:text-[8px]">
        {Array.isArray(points) ? (
          points.map((point, index) => <li key={index}>{point}</li>)
        ) : (
          <li className="lg:text-[14px] text-[12px] font-[400]">{points}</li>
        )}
      </ul>
    </Accordion>
  );
};

const FeaturesSpecs = ({
  detail,
  selectedWeight,
  id,
  productDetail,
  selectedMetal,
  selectedShape,
  selectedCarat,
  selectedColor,
  pricingDetails,
  // CMS-editable copy (CMS → Product Detail): bullet lists for the Shipping &
  // Returns and Certification accordions. Fall back to the built-in copy.
  shippingReturns,
  certificationCare,
  // GEO/AEO: AI-answer-engine summary + per-product FAQs (token-resolved
  // against the shopper's live selection, same tokenCtx Details.jsx builds).
  aeoSummary,
  productFaqs,
  tokenCtx = {},
}) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.faq);
  const hasCenterDiamond = productDetail?.diamonds?.some((d) => d.center === 1);
  const hasSideStones = productDetail?.diamonds?.some((d) => d.center === 0);

  const sideStoneWeight = useMemo(() => {
    if (!hasSideStones) return null;

    const total = productDetail.diamonds
      .filter((d) => d.center === 0)
      .reduce((sum, d) => sum + parseFloat(d.wt || 0), 0);

    return total.toFixed(3) + " CT";
  }, [productDetail]);

  const totalPcs = productDetail.diamonds?.reduce(
    (sum, d) => sum + (d.pcs || 0),
    0
  );

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFaqs());
    }
  }, [items.length, dispatch]);

  // Accordion content per spec (Jul 2026):
  //   Product Details  → SKU · Setting · Gender · Occasion
  //   Diamond Details  → Center weight · Total weight · Clarity · Color
  const centerStone = (productDetail?.diamonds || []).find((d) => d.center === 1);
  const centerWeight =
    selectedCarat ||
    productDetail?.center_diamond_weight_ct ||
    centerStone?.wt ||
    null;
  // Side-stone weight is fixed (accent diamonds don't change when the
  // shopper picks a different center-stone carat) — derived by subtracting
  // the BASE product's own center weight from its BOM-aggregated total
  // (diamond_weight_ct), since productDetail.diamonds only ever carries a
  // single synthetic center-stone entry and never exposes side stones on
  // their own.
  const sideStoneOnlyCt = (() => {
    const total = parseFloat(productDetail?.diamond_weight_ct || productDetail?.diamondWeightCt || 0);
    const baseCenter = parseFloat(productDetail?.center_diamond_weight_ct || 0);
    const diff = total - baseCenter;
    return diff > 0 ? diff : 0;
  })();
  // Total = the shopper's SELECTED center carat + the fixed side-stone
  // weight — so picking a bigger/smaller center stone updates this figure,
  // instead of always showing the base product's original static total.
  const totalDiamondCt = (() => {
    const cw = parseFloat(centerWeight || 0);
    if (cw > 0 || sideStoneOnlyCt > 0) {
      return parseFloat((cw + sideStoneOnlyCt).toFixed(3));
    }
    const fromPricing = pricingDetails?.diamonds_details?.reduce(
      (sum, d) => sum + parseFloat(d.wt || 0),
      0
    );
    if (fromPricing > 0) return parseFloat(fromPricing.toFixed(3));
    const fromProduct = (productDetail?.diamonds || []).reduce(
      (sum, d) => sum + parseFloat(d.wt || 0),
      0
    );
    return fromProduct > 0 ? parseFloat(fromProduct.toFixed(3)) : null;
  })();
  const features = [
    {
      title: "",
      labels: ["SKU", "Setting", "Gender", "Occasion"],
      values: [
        productDetail?.sku || productDetail?.sku_no || productDetail?.design_no || "-",
        toTitleCase(productDetail?.setting || centerStone?.setting || "") || "-",
        toTitleCase(productDetail?.gender || "") || "-",
        toTitleCase(productDetail?.occasion || "") || "-",
      ],
    },
    {
      title: "Diamond Details",
      labels: [
        "Center Diamond Weight",
        "Total Diamond Weight",
        "Clarity",
        "Color",
      ],
      values: [
        centerWeight ? `${formatCarat(centerWeight)}` : "-",
        totalDiamondCt ? `${totalDiamondCt} CT` : "-",
        productDetail?.diamond_clarity ||
          centerStone?.clarity ||
          (String(productDetail?.diamonds?.[0]?.color || "").includes("-")
            ? String(productDetail.diamonds[0].color).split("-")[1]?.trim()
            : "") ||
          "-",
        productDetail?.diamond_color ||
          (String(productDetail?.diamonds?.[0]?.color || "").includes("-")
            ? String(productDetail.diamonds[0].color).split("-")[0]?.trim()
            : productDetail?.diamonds?.[0]?.color) ||
          "-",
      ],
    },
  ];
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedDetail, setConvertedDetail] = useState(null);
  useEffect(() => {
    // Fetch INR to CAD conversion rate
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/INR"
        );
        const data = await response.json();
        const rate = data.rates.CAD;
        setConversionRate(rate);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);
  useEffect(() => {
    if (conversionRate && productDetail?.pricing_details?.[0]) {
      const product = productDetail?.pricing_details[0];
      const convert = (value) =>
        value ? (value * conversionRate).toFixed(2) : "-";

      setConvertedDetail({
        ...detail,
        Product_Detail: [
          {
            ...product,
            metal_rate: convert(product.metal_rate),
            metal_amount: convert(product.metal_amount),
            diamond_amount: convert(product.diamond_amount),
            labour_amount: convert(product.labour_amount),
            subtotal: convert(product.subtotal),
            total_amount: convert(product.total_amount),
          },
        ],
      });
    }
  }, [conversionRate, detail]);

  const priceBreakdown = useMemo(() => {
    let labour = Number(convertedDetail?.Product_Detail?.[0]?.labour_amount || 0);
    let diamond = Number(convertedDetail?.Product_Detail?.[0]?.diamond_rate) || 0;
    let metal = Number(convertedDetail?.Product_Detail?.[0]?.metal_amount);
    const weight = parseFloat(
      typeof selectedWeight === "object"
        ? selectedWeight?.label?.match(/[\d.]+/)?.[0] || "0"
        : `${selectedWeight}`.match(/[\d.]+/)?.[0] || "0"
    );

    if (conversionRate) {
      diamond = diamond * conversionRate;
    }

    const totalDiamondAmount = diamond * weight;
    const subtotal = metal + totalDiamondAmount + labour;
    const total = subtotal;

    return {
      labour,
      subtotal,
      total,
    };
  }, [convertedDetail, selectedWeight]);

  return (
    <div>
      <Accordion title={"Product Details"} btnStyle="!capitalize">
        {features.map((item, index) => (
          <div key={index} className="mt-[18px]">
            <Typography variant="h6" className="font-[500] mb-3">
              {item?.title}
            </Typography>
            <div className="flex flex-col gap-[3px]">
              {item?.labels.map((label, idx) => (
                <div key={idx} className="grid grid-cols-2">
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="h6" textColor="teal">
                    {item?.values[idx]}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Accordion>

      {/* price breakdown */}
      {/* <Accordion
        title="Price Breakdown"
        btnStyle="!capitalize"
        id={id}
      >
        <div className="flex flex-col gap-6">
       
          <div className="flex flex-col gap-4">
            <Typography variant="h6" className="font-[500]">
              Metal Price :
            </Typography>
            <SpecsGrid
              labels={[
                "Component :",
                "Weight :",
                "Rate :",
                "Final Value :",
                "Total Metal Value :",
              ]}
              values={[
                `${selectedMetal?.karat?.value || "-"} ${
                  selectedMetal?.color?.value || "-"
                }`,
                productDetail?.pricing_details?.[0].nwt
                  ? `${productDetail?.pricing_details?.[0].nwt}g`
                  : "-",
                productDetail?.pricing_details?.[0].metal_rate
                  ? `$${productDetail?.pricing_details?.[0].metal_rate}/g`
                  : "-",
                productDetail?.pricing_details?.[0].metal_amount
                  ? `$${productDetail?.pricing_details?.[0].metal_amount}`
                  : "-",
                productDetail?.pricing_details?.[0].metal_amount
                  ? `$${productDetail?.pricing_details?.[0].metal_amount}`
                  : "-",
              ]}
            />
          </div>
 
         
          <div className="pb-3.5 border-b border-[var(--grey-1)] flex flex-col gap-3">
            <Typography variant="h6" className="font-[500]">
              Diamond Price :
            </Typography>
            <SpecsGrid
              labels={[
                "Diamond Shape :",
                "Clarity :",
                "Quantity :",
                "Weight :",
                "Total Diamond Value :",
              ]}
              values={[
                DIAMONDS_SHAPS?.find((shape) => shape?.code === selectedShape)
                  ?.label || "-",
                "VS",
                `${productDetail?.diamonds?.[0].pcs || "-"}`,
                `${selectedWeight || "-"}`,
                `$${
                  productDetail?.pricing_details?.[0].diamond_rate *
                  parseFloat(selectedWeight)
                }`,
              ]}
            />
          </div>
 
         
          <SpecsGrid
            labels={[
              "Craftsmanship & Setting :",
              "Subtotal :",
              "Taxes & Duties :",
              "Total Jewelry Price :",
            ]}
            values={[
              `$${productDetail?.pricing_details?.[0].labour_amount}`,
              `$${
                productDetail?.pricing_details?.[0].metal_amount +
                productDetail?.pricing_details?.[0].diamond_rate *
                  parseFloat(selectedWeight) +
                productDetail?.pricing_details?.[0].labour_amount
              }`,
              `$${0}`,
              `$${priceBreakdown.total.toFixed(2)}`,
            ]}
          />
        </div>
      </Accordion> */}
      <Accordion title="Care Guide" btnStyle="!capitalize">
        <AccordionListSection
          title="Everyday Care"
          icon={<CareGuideIcon />}
          points={[
            "Avoid wearing your ring during activities like gym, gardening, or cleaning.",
            "Keep away from harsh chemicals, lotions, and perfumes.",
            "Store your jewelry in a soft pouch or box when not in use.",
          ]}
        />

        <AccordionListSection
          title="Cleaning Your Diamond"
          icon={<CleaningDiamondIcon />}
          points={[
            "Gently soak your jewelry in warm water with mild soap.",
            "Use a soft brush to clean around the setting and under the diamond.",
            "Pat dry with a soft, lint-free cloth. Avoid using tissues or paper towels.",
          ]}
        />

        <AccordionListSection
          title="Professional Maintenance"
          icon={<Maintenance />}
          points={[
            "Contact RJ HOUSE for a complimentary cleaning & inspection every 6 months.",
            'We’ll check your prongs, polish your ring, and ensure it remains as radiant as the day you said "yes".',
          ]}
        />

        <AccordionListSection
          title="Travel Tips"
          icon={<TravelTips />}
          points={[
            "Always carry your jewelry in a dedicated case with individual compartments.",
            "Never check valuable pieces in luggage — keep them with you.",
          ]}
        />

        <AccordionListSection
          title="A Few Don’ts"
          icon={<Pin />}
          points={[
            "Don’t use ultrasonic cleaners at home unless advised.",
            "Don’t attempt to resize or repair your ring without RJ HOUSE support — it may void your warranty.",
          ]}
          isLast
        />
      </Accordion>
      <Accordion title="Shipping & Returns" btnStyle="!capitalize">
        <ul className="list-disc list-inside marker:text-[8px] text-[14px] flex flex-col gap-2 py-3">
          {productDetail?.production_time && (
            <li>
              This piece is made, certified and dispatched within {productDetail.production_time}, then
              delivered to the US and Canada in about {DELIVERY.transitUsCa}.
            </li>
          )}
          {(Array.isArray(shippingReturns) && shippingReturns.some((l) => String(l || "").trim())
            ? shippingReturns.filter((l) => String(l || "").trim())
            : SHIPPING_BULLETS
          )
            .filter((line) => !(productDetail?.production_time && /dispatched within/i.test(line)))
            .map((line, i) => (
              <li key={i}>{line}</li>
            ))}
        </ul>
        <p className="text-[13px] pb-3">
          <Link href="/shipping" className="underline">Shipping policy</Link>
          {" · "}
          <Link href="/easy-return" className="underline">Returns policy</Link>
        </p>
      </Accordion>
      <Accordion title="Certification" btnStyle="!capitalize">
        <ul className="list-disc list-inside marker:text-[8px] text-[14px] flex flex-col gap-2 py-3">
          <li>
            {certificateFor({
              diamondCertLab: productDetail?.cert_lab,
              centerStoneWeightCt: productDetail?.center_diamond_weight_ct,
            }).text}
          </li>
          {(Array.isArray(certificationCare) && certificationCare.some((l) => String(l || "").trim())
            ? certificationCare.filter((l) => String(l || "").trim())
            : [
                "Gold is hallmarked for purity.",
                "Lifetime warranty against manufacturing defects.",
                "Store separately in the provided pouch; avoid contact with chemicals.",
              ]
          ).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="text-[13px] pb-3">
          <Link href="/certification" className="underline">How our certificates work</Link>
        </p>
      </Accordion>
      {aeoSummary && (
        <p className="lg:text-[13px] text-[12px] font-[300] italic text-[var(--grey-3,#6b7280)] py-3 border-b border-[var(--border,#e5e7eb)]">
          {aeoSummary}
        </p>
      )}
      {(() => {
        // Only FAQ categories the admin ticked for product pages (CMS ▸ FAQs).
        const faqGroups = (items || []).filter((e) => e.pdp);
        // Per-product FAQs (admin/AI-authored, token-resolved) come first —
        // they're specific to this exact product, ahead of the shared
        // storefront-wide category FAQs.
        const resolvedProductFaqs = (Array.isArray(productFaqs) ? productFaqs : [])
          .filter((f) => f?.question && f?.answer)
          .map((f) => ({
            question: resolveTokens(f.question, tokenCtx),
            answer: resolveTokens(f.answer, tokenCtx),
          }));
        const sharedFaqs = faqGroups.flatMap((g) => g.faqs || []);
        if (!resolvedProductFaqs.length && !sharedFaqs.length) return null;
        const total = resolvedProductFaqs.length + sharedFaqs.length;
        return (
          <Accordion title="FAQs" btnStyle="!capitalize">
            {resolvedProductFaqs.map((que, idx) => (
              <AccordionListSection
                key={`product-${idx}`}
                title={`${idx + 1}. ${que.question}`}
                points={[que.answer]}
                isLast={idx === total - 1}
              />
            ))}
            {sharedFaqs.map((que, idx) => (
              <AccordionListSection
                key={`shared-${idx}`}
                title={`${resolvedProductFaqs.length + idx + 1}. ${que?.question}`}
                points={Array.isArray(que?.answer) ? que.answer : [que?.answer]}
                isLast={resolvedProductFaqs.length + idx === total - 1}
              />
            ))}
          </Accordion>
        );
      })()}
    </div>
  );
};

export default FeaturesSpecs;
