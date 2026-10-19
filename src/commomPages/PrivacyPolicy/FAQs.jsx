"use client";
import React, { useEffect } from "react";
import Accordion from "@/components/ui/Accordion/Accordion";
import PageHeading from "@/components/ui/Heading/Heading";
import Typography from "@/components/ui/Typography/Typography";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqs } from "@/store/slices/faqSlice";

const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const FAQsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.faq);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFaqs());
    }
  }, [items.length, dispatch]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[var(--teal-1)] rounded-full animate-spin" />
        <p className="text-[14px]">Loading FAQs...</p>
      </div>
    );

  return (
    <section>
      <PageHeading
        isCenter
        title="Frequently Asked Questions"
        description="You asked, We Answered."
        className={"xl:mb-[40px] mb-[20px] mt-5"}
      />

      {(items || []).length > 1 && (
        <nav
          aria-label="FAQ categories"
          className="container mx-auto 2xl:px-[404px] lg:px-[125px] px-[18px] flex flex-wrap gap-2 justify-center mb-[24px]"
        >
          {items.map((g) => (
            <a
              key={g.faq_category_title}
              href={`#${slug(g.faq_category_title)}`}
              className="border border-[var(--border,#e5e7eb)] rounded-full px-4 py-1.5 text-[12px] tracking-wide capitalize hover:bg-[var(--navy,#162640)] hover:text-white transition-colors"
            >
              {g.faq_category_title.toLowerCase()}
            </a>
          ))}
        </nav>
      )}

      <Typography variant="h5">
        {(items || []).map((group) => (
          <div key={group.faq_category_title} id={slug(group.faq_category_title)} className="scroll-mt-[120px]">
            <h2 className="container mx-auto 2xl:px-[404px] lg:px-[125px] px-0 mt-[32px] mb-[8px] text-[18px] lg:text-[22px] font-[500] capitalize">
              {group.faq_category_title.toLowerCase()}
            </h2>
            {group.faqs?.map((que, idx) => {
              const hasTable = /<table|<div|<p/i.test(que?.answer || "");
              return (
                <ul className="container mx-auto 2xl:px-[404px] lg:px-[125px] px-0" key={que.id || idx}>
                  <Accordion
                    title={que?.question}
                    caretIcons={{ open: "icons/minus.svg", close: "icons/plus.svg" }}
                  >
                    {hasTable ? (
                      <div dangerouslySetInnerHTML={{ __html: que?.answer }}></div>
                    ) : (
                      <li className="list-disc list-inside" dangerouslySetInnerHTML={{ __html: que?.answer }}></li>
                    )}
                  </Accordion>
                </ul>
              );
            })}
          </div>
        ))}
      </Typography>
    </section>
  );
};

export default FAQsPage;
