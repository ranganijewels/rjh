import PageHeading from "@/components/ui/Heading/PageHeading";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";
import Support from "../Account/Support";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import AppointmentCalendar from "@/components/ui/Calendar/AppointmentCalendar";
import { CalenderIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";

const BookConsultancy = () => {
  return (
    <section>
      <PageHeading title={"Book Consultancy"} />

      <div className="2xl:py-[100px] gap-[40px] lg:py-[54px] py-[40px] 2xl:px-[421px] xl:px-[320px] lg:px-[155px] md:px-[40px] px-[18px]">
        <Support />
        <div className="space-y-[30px] pt-[40px]">
          <div className="flex gap-[30px]">
            <Input
              borderBottom
              label={"Full Name"}
              containerClass="w-full"
              placeholder="Full Name"
              // value={formData.full_name}
              // onChange={(e) => handleChange("full_name", e.target.value)}
            />
            <Input
              borderBottom
              containerClass="w-full"
              label={"Email Address"}
              placeholder="Email Address"
              // value={formData.email}
              // onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              borderBottom
              containerClass="w-full"
              label={"Mobile Number"}
              placeholder="Mobile Number"
              // value={formData.full_name}
              // onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>

          <Dropdown
            label={"Store Location"}
            placeholder="Select Store Location"
            options={["Canada", "Payment", "Refund", "Other"]}
            //   value={formData.query}
            //   onChange={(val) => handleChange("query", val)}
            containerClass={"flex !items-start !flex-col"}
            borderBottom
            fullWidth
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
            <div>
              {" "}
              <AppointmentCalendar />
            </div>
            <div className="space-y-[30px]">
              <div className="space-y-2">
                <Typography
                  as="label"
                  variant="h4"
                  className="block mb-1"
                >
                  Select Mode Of Meeting
                </Typography>
                <div className="flex gap-[22px] mt-[22px]">
                  {["Virtual / Online Meeting", "Visit Store"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-[10px] cursor-pointer 
                  
                    `}
                    >
                      <input
                        type="radio"
                        name="meetingMode"
                        className="w-[20px] h-[20px] accent-[var(--teal-1)] cursor-pointer"
                        //   checked={formData.meetingMode === option}
                        //   onChange={() => handleRadio("meetingMode", option)}
                      />
                      <span className="text-stone-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="px-4 md:px-10 space-y-[7px]">
                <div className="py-[13px] flex justify-between items-center border-b border-b-[var(--placeholder)] ">
                  <div className="inline-flex gap-[24px] items-center">
                    <CalenderIcon className="w-[14px] h-[14px]" />
                    <Typography variant="h5">10:00 AM - 11:00 AM</Typography>
                  </div>
                  <label className="text-[12px] font-[500] text-[var(--teal-1)]">
                    2 Slots remain
                  </label>
                </div>

                <div className="py-[13px] flex justify-between items-center border-b border-b-[var(--placeholder)] ">
                  <div className="inline-flex gap-[24px] items-center">
                    <CalenderIcon className="w-[14px] h-[14px]" />
                    <Typography variant="h5">10:00 AM - 11:00 AM</Typography>
                  </div>
                  <label className="text-[12px] font-[500] text-[var(--teal-1)]">
                    2 Slots remain
                  </label>
                </div>
              </div>
              <div>
                <Typography
                  as="label"
                  variant="h4"
                  className="block mb-1"
                >
                  Special Notes / Requirements
                </Typography>
                <textarea
                  borderBottom
                  label="Special Notes / Requirements"
                  placeholder="Mention any specific requirements"
                  className="border-b xl:text-[16px] text-[12px] font-[400] border-[var(--placeholder)] focus:border-b-2 focus:border-[var(--teal-2)] focus:outline-0 p-[20px_11px] w-full"
                  //   value={formData.message}
                  //   onChange={(e) => handleChange("message", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[60px]">
          <Button title={"Book Consultancy"} className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default BookConsultancy;
