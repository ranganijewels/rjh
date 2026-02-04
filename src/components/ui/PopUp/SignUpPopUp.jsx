import React, { useState } from "react";
import Typography from "../Typography/Typography";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";

const SignUpPopUp = ({ onClose }) => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const { create } = useCrudApi("/api/subscribe");

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await create({ email });

      if (res.status) {
        toast.success("Subscription Created");
        setEmail("");
      } else {
        const errorMsg =
          res.error?.email?.[0] || res.message || "Something went wrong";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        "The email field must be a valid email address." || err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex md:flex-row xl:max-w-[812px] xl:max-h-[647px] lg:max-w-[712px] lg:max-h-[447px] max-w-[649px] max-h-[459px] bg-[var(--grey-0)] relative">
      {/* Text Section */}
      <div className="flex flex-col xl:gap-[67px] gap-[22px] p-[40px_20px] md:p-[71px_32px] flex-1">
        <div className="space-y-[17px]">
          <Typography variant="h2" textColor="teal">
            Timeless Luxury, Limited-Time Offer
          </Typography>
          <Typography variant="h6" textColor="grey">
            Discover handcrafted diamond jewellery designed for life’s most
            meaningful moments.
          </Typography>
        </div>

        <div className="lg:text-[22px] text-[18px] font-[400]">
          Get <span className="text-[var(--teal-1)]">10% off </span>on your
          first order
        </div>

        <div className="space-y-[46px]">
          <Input
            borderBottom
            placeholder="Enter email address*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button title={"SIGN UP"} onClick={handleSubmit} />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      {/* Image Section */}
      <div className="justify-center items-center flex-1 hidden md:flex">
        <img
          src="/popup-img-3.jpg"
          alt="popup"
          className="w-full h-full object-cover md:max-w-none max-w-[300px]"
        />
      </div>
      <img
        src="/icons/close-white.svg"
        alt="close"
        className="absolute top-[20px] right-[20px] cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};

export default SignUpPopUp;
