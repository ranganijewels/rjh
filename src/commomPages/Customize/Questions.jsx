import Accordion from "@/components/ui/Accordion/Accordion";
import Heading from "@/components/ui/Heading/Heading";
import React from "react";
import { QUESTIONS } from "./constant";

const Questions = ({ faq }) => {
  return (
    <div className="px-[18px]">
      <Heading
        isCenter
        title={faq?.headtitle}
        description={faq?.description}
        className={"xl:mb-[40px] mb-[20px]"}
      />

      {faq?.faqs?.map((que, idx) => (
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
            <li className="list-disc list-inside">{que.answer}</li>
          </Accordion>
        </ul>
      ))}
    </div>
  );
};

export default Questions;
