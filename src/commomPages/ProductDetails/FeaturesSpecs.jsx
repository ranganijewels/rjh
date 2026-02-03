import Accordion from "@/components/ui/Accordion/Accordion";
import { SHIPPING_RETURNS_DATA } from "./constants";
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

  const features = [
    {
      title: "",
      // Label ma j hover muki daiye
      labels: ["SKU", "Product Name", "Product Type", "Gender"],
      values: [
        productDetail?.sku_no || productDetail?.design_no,
        productDetail?.title || "-",
        productDetail?.category?.name || "-",
        productDetail?.gender || "-",
      ],
    },
    // Dynamic Diamond Information
    ...(() => {
      if (!productDetail?.diamonds) return [];

      const centerStones = [];
      const sideStonesMap = new Map();

      productDetail.diamonds.forEach((d) => {
        if (d.center === 1) {
          centerStones.push(d);
        } else {
          // Normalize shape name for grouping key
          const shapeKey = (
            d.occasion?.custom_title ||
            d.shape ||
            "Diamond"
          ).toLowerCase();

          if (sideStonesMap.has(shapeKey)) {
            const existing = sideStonesMap.get(shapeKey);
            existing.pcs = (Number(existing.pcs) || 0) + (Number(d.pcs) || 0);
            existing.wt = (
              parseFloat(existing.wt || 0) + parseFloat(d.wt || 0)
            ).toFixed(2);
          } else {
            // Store as new object to avoid mutating original reference issues in strict mode
            sideStonesMap.set(shapeKey, {
              ...d,
              wt: parseFloat(d.wt || 0), // Base weight
              pcs: Number(d.pcs) || 0,
            });
          }
        }
      });

      const sideStones = Array.from(sideStonesMap.values());
      // Center stones first, then side stones
      const allStones = [...centerStones, ...sideStones];

      return allStones.map((d, index) => {
        const isCenter = d.center === 1;
        const shapeName = toTitleCase(
          d.occasion?.custom_title || d.shape || "Diamond"
        );

        // For center stone, use selectedCarat if available. 
        // For side stones (or center if no selectedCarat), use accumulator wt.
        const weight = isCenter && selectedCarat ? selectedCarat : d.wt;

        return {
          // Title only for the first item
          title: index === 0 ? "Diamond Details" : "",
          labels: [`${shapeName} Weight`, "Quantity", "Diamond Shape"],
          values: [
            formatCarat(weight) || "-",
            d.pcs || "-",
            shapeName,
          ],
        };
      });
    })(),
    {
      title: "",
      labels: ["Total Diamond Ct.", "Color - Clarity", "Setting Style"],
      values: [
        parseFloat(
          pricingDetails?.diamonds_details
            ?.reduce((sum, d) => sum + parseFloat(d.wt || 0), 0)
            .toFixed(3)
        ) + " CT",
        `${productDetail?.diamonds[0]?.color || ""}`.trim() || "-",
        toTitleCase(productDetail?.diamonds[0]?.setting || "-"),
      ],
    },


    // SECTION 3: METAL & TOTALS
    {
      title: ["Metal Details"],
      labels: ["Metal Type", "Metal Purity", "Metal Weight"],
      values: [
        `${toTitleCase(selectedColor)} ${toTitleCase(productDetail?.metal)}`,
        selectedMetal?.karat?.value || "-",
        `${pricingDetails?.pricing?.data?.[0]?.nwt || "-"} GMS`, //
        // CT unit sathe
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
    let labour = Number(convertedDetail?.Product_Detail[0]?.labour_amount || 0);
    let diamond = Number(convertedDetail?.Product_Detail[0]?.diamond_rate) || 0;
    let metal = Number(convertedDetail?.Product_Detail[0]?.metal_amount);
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
            "Contact ELOVA for a complimentary cleaning & inspection every 6 months.",
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
            "Don’t attempt to resize or repair your ring without ELOVA support — it may void your warranty.",
          ]}
          isLast
        />
      </Accordion>
      <Accordion title="Shipping & Returns" btnStyle="!capitalize">
        <div className="flex flex-col gap-5">
          {SHIPPING_RETURNS_DATA.map((section, index) => (
            <div
              key={index}
              className="py-5 border-[var(--teal-3)] flex flex-col gap-3"
            >
              <Typography variant="h6" className="font-[500]">
                {section.title}
              </Typography>
              <ul className="list-disc list-inside marker:text-[8px] text-[14px]">
                {section.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Accordion>
      <div>
        <Accordion title="FAQs" btnStyle="!capitalize">
          {items
            ?.find((e) => e.faq_category_title === "Product Details")
            ?.faqs?.map((que, idx) => (
              <AccordionListSection
                key={idx}
                title={`${idx + 1}. ${que?.question}`}
                points={Array.isArray(que?.answer) ? que.answer : [que?.answer]}
                isLast={
                  idx ===
                  items.find((e) => e.faq_category_title === "Product Details")
                    ?.faqs.length -
                  1
                }
              />
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FeaturesSpecs;
