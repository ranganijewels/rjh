"use client";
import Button from "@/components/ui/Button/Button";
import { useCustomize } from "@/context/CustomizeContext";
import { getPreviewUrl } from "@/utils/string";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReviewForm = () => {
  const router = useRouter();
  const { referenceForm, updateReferenceForm } = useCustomize();
  const [notes, setNotes] = useState(referenceForm?.notes || "");
  const searchParams = useSearchParams();
  const sizeSlug = searchParams.get("size");
  const sizeCategoryId = searchParams.get("size_category_id");

  useEffect(() => {
    setNotes(referenceForm?.notes || "");
  }, [referenceForm?.notes]);

  return (
    <section className="space-y-[52px]">
      {/* Review Your Section */}
      <div className="md:space-y-[40px] space-y-[20px]">
        <div>
          <p className="xl:text-[24px] font-[500] text-[18px]">
            Review Your Selections
          </p>
          <p className="xl:text-[18px] font-[500] text-[14px] text-[var(--placeholder)]">
            Check your details before submitting.
          </p>
        </div>

        {/* upload images  */}
        <div className="">
          <p className="mb-[20px]">Uploaded Images</p>
          <div className="flex lg:gap-[16px] gap-[11px]">
            {referenceForm?.files?.map((file, i) => {
              const preview = getPreviewUrl(file);
              if (!preview) return null;

              return (
                <div
                  key={i}
                  className="xl:w-[223px] xl:h-[223px] lg:w-[170px] lg:h-[170px] w-[104px] h-[104px] relative"
                >
                  <img
                    src={preview}
                    alt={`Uploaded ${i}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-[32px]">
          <h3 className="text-[18px] font-[500]">
            What you’re envisioning or why this inspiration is meaningful to you
          </h3>
          <p className="text-[16px] font-[400]">{referenceForm.description}</p>
        </div>

        <div className="flex gap-[10px]">
          <h3 className="text-[18px] font-[500]">URL</h3>
          <div className="flex flex-col gap-[20px]">
            {" "}
            {referenceForm.urls.map((e, index) => (
              <Link key={index} href={e} className="text-[16px] font-[400]">
                {e}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Diamond and Metal section */}
      <div>
        <div className="pb-[32px]">
          <p className="xl:text-[24px] font-[500] text-[18px]">
            Diamond and Metal Selection
          </p>
        </div>

        <div className="space-y-[12px]">
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Shape :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm.shape?.label || "Not selected"}
            </p>
          </div>{" "}
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Carat :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm.selectedCarat || "Not selected"}
            </p>
          </div>{" "}
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Color :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm.colorRange?.[0]} -{" "}
              {referenceForm.colorRange?.at(-1)}
            </p>
          </div>{" "}
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Clarity :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm.clarityRange?.[0]} -{" "}
              {referenceForm.clarityRange?.at(-1)}
            </p>
          </div>{" "}
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Metal :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm?.metal
                ? `${
                    referenceForm?.metal.karat?.value ||
                    referenceForm?.metal.karat ||
                    ""
                  } ${
                    (referenceForm?.metal.color?.name ||
                      referenceForm?.metal.color ||
                      "") + " Gold"
                  }`.trim() || "Not selected"
                : "Not selected"}
            </p>
          </div>
          <div className="grid grid-cols-2">
            <h3 className="text-[18px] font-[500] text-[var(--grey-2)]">
              Ring Size :
            </h3>
            <p className="text-[18px] font-[400] text-[var(--teal-1)]">
              {referenceForm?.ringSize}
            </p>
          </div>
        </div>
      </div>

      {/* anything else input box */}
      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-[400]">
          Anything Else We Should Know?
          <span className="text-[var(--placeholder)]">
            (minimum 15 characters){" "}
          </span>
        </label>
        <textarea
          placeholder="Enter text..."
          className={`border-b border-b-[var(--teal-3)] p-3 resize-none focus:outline-0`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-[10px] items-end justify-end">
        <Button
          title="Previous"
          variant="outlineTeal"
          onClick={() =>
            router.push(
              `/customize/form/reference?size=${sizeSlug}&size_category_id=${sizeCategoryId}`
            )
          }
        />
        <Button
          title={"next"}
          onClick={() => {
            updateReferenceForm({ notes });
            router.push(
              `/customize/form/contact-information?size=${sizeSlug}&size_category_id=${sizeCategoryId}`
            );
          }}
        />
      </div>
    </section>
  );
};

export default ReviewForm;
