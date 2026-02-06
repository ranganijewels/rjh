"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOtp } from "@/store/authThunks";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { useCrudApi } from "@/hooks/useCrudApi";
import { displayFormat } from "@/utils/string";

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { create } = useCrudApi("/api/auth/resend-otp");
  const [submitting, setSubmitting] = useState(false);
  const birthDateRef = React.useRef(null);

  useEffect(() => {
    const until = localStorage.getItem("otpResendUntil");
    if (!until) return;

    const remaining = Math.ceil((+until - Date.now()) / 1000);
    if (remaining > 0) {
      setResendCooldown(remaining);
    } else {
      localStorage.removeItem("otpResendUntil");
    }
  }, []);
  useEffect(() => {
    if (!resendCooldown) return;
    const t = setInterval(() => {
      setResendCooldown((p) => (p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleCreateAccount = async () => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      birth_date: displayFormat(birthDate),
    };

    try {
      setSubmitting(true);
      const resultAction = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("OTP sent to your email");
        setRegisteredEmail(email);
        setShowOtp(true);
      } else {
        const err = resultAction.payload;

        if (err?.error && typeof err.error === "object") {
          const firstKey = Object.keys(err.error)[0];
          const firstMessage = err.error[firstKey]?.[0];
          if (firstMessage) {
            toast.error(firstMessage);
            return;
          }
        }

        toast.error(err?.message || "Signup failed.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setSubmitting(true);

      const resultAction = await dispatch(
        verifyOtp({ email: registeredEmail, otp })
      );

      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("Account verified successfully!");
        router.push("/login");
      } else {
        const err = resultAction.payload;
        toast.error(err?.message || "Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      const res = await create({ email: registeredEmail });

      if (!res?.status) {
        const retryAfter = res?.error?.retry_after_seconds;

        if (retryAfter) {
          setResendCooldown(retryAfter);

          // persist for refresh safety
          localStorage.setItem(
            "otpResendUntil",
            Date.now() + retryAfter * 1000
          );
        }

        toast.error(res?.message || "Please wait before retrying");
        return;
      }

      toast.success("OTP resent successfully");

      const cooldown = 120; // fallback
      setResendCooldown(cooldown);
      localStorage.setItem("otpResendUntil", Date.now() + cooldown * 1000);
    } catch {
      toast.error("Something went wrong while resending OTP");
    }
  };

  return (
    <div className="md:w-[50%] w-full space-y-[30px] 2xl:px-[240px] xl:px-[100px] lg:px-[67px] md:px-[47px] px-[18px] py-[41px] md:py-0 md:m-auto">
      <h2 className="xl:text-[18px] text-[16px] font-[500]">
        Create New Account ELOVA
      </h2>

      <div className="grid grid-cols-2 xl:gap-[30px] gap-[15px]">
        <Input
          placeholder="First Name"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          borderBottom
        />
        <Input
          placeholder="Last Name"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          borderBottom
        />
      </div>

      <Input
        placeholder="Email Address"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        borderBottom
      />

      <Input
        placeholder="Date of Birth"
        label="Date of Birth"
        type="date"
        ref={birthDateRef}
        value={birthDate}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setBirthDate(e.target.value)}
        borderBottom
        className="cursor-pointer"
        rightIcon={
          <button
            type="button"
            onClick={() => birthDateRef.current?.showPicker()}
            className="text-[var(--teal-2)] hover:text-[var(--teal-1)] border-none bg-transparent p-0 outline-none"
          >
            <Calendar size={18} />
          </button>
        }
      />

      <div>
        <Input
          placeholder="Password"
          label="Password"
          className="mb-2"
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          borderBottom
          rightIcon={
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)]"
            >
              {show ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />
      </div>

      {showOtp && (
        <div>
          <Input
            placeholder="Enter OTP"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            borderBottom
            containerClass={"mb-[10px]"}
          />
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={handleResendOtp}
            className="text-[12px] underline font-[500] disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-[12px] items-center">
        <Button
          title={
            submitting
              ? showOtp
                ? "Verifying OTP..."
                : "Sending OTP..."
              : showOtp
                ? "Verify OTP"
                : "Create new account"
          }
          className="w-full"
          loading={submitting}
          disabled={submitting}
          onClick={showOtp ? handleVerifyOtp : handleCreateAccount}
        />

        <p className="uppercase text-[14px] font-[400]">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="underline cursor-pointer text-[var(--teal-1)]"
          >
            login
          </span>
        </p>
      </div>

      {/* <div className="flex flex-col gap-[12px] items-center">
        <Button
          title="Create new account"
          className="w-full"
          onClick={handleCreateAccount}
        />
        <p className="uppercase text-[14px] font-[400]">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="underline cursor-pointer text-[var(--teal-1)]"
          >
            login
          </span>
        </p>
      </div> */}
    </div>
  );
};

export default CreateAccount;
