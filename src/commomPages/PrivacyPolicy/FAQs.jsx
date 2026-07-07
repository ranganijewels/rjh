"use client";
import React, { useEffect } from "react";
import Accordion from "@/components/ui/Accordion/Accordion";
import PageHeading from "@/components/ui/Heading/Heading";
import Typography from "@/components/ui/Typography/Typography";
import { useDispatch, useSelector } from "react-redux";
import { fetchFaqs } from "@/store/slices/faqSlice";

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

      <Typography variant="h5">
        {items
          ?.find((e) => e.faq_category_title === "FAQs Page")
          ?.faqs?.map((que, idx) => {
            const hasTable = /<table|<div|<p/i.test(que?.answer || "");

            return (
              <ul
                className="container mx-auto 2xl:px-[404px] lg:px-[125px] px-0"
                key={idx}
              >
                <Accordion
                  title={que?.question}
                  caretIcons={{
                    open: "icons/minus.svg",
                    close: "icons/plus.svg",
                  }}
                >
                  {hasTable ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: que?.answer }}
                    ></div>
                  ) : (
                    <li
                      className="list-disc list-inside"
                      dangerouslySetInnerHTML={{ __html: que?.answer }}
                    ></li>
                  )}
                </Accordion>
              </ul>
            );
          })}
      </Typography>
    </section>
  );
};

export default FAQsPage;
