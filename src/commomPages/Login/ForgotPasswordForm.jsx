"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { authFormContainer } from "./authFormStyles";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.status) {
        toast.error(data.message || "Couldn't send the reset email. Try again in a moment.");
        return;
      }
      setSentTo(email.trim());
    } catch {
      toast.error("Couldn't send the reset email. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sentTo) {
    return (
      <div className={authFormContainer}>
        <h1 className="xl:text-[18px] text-[16px] font-medium">Check your email</h1>
        <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
          If an account exists for <span className="font-medium">{sentTo}</span>, we&apos;ve sent a link to
          reset your password. It expires in 30 minutes. Check your spam folder if it doesn&apos;t arrive
          in a few minutes.
        </p>
        <div className="flex flex-col items-center gap-[12px]">
          <Button title="Back to login" className="w-full" url="/login" />
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="text-[14px] font-normal underline uppercase cursor-pointer"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={authFormContainer} noValidate>
      <h1 className="xl:text-[18px] text-[16px] font-medium">Forgot your password?</h1>

      <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
        Enter the email you use for your RJ HOUSE account and we&apos;ll send you a link to choose a new
        password.
      </p>

      <Input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email Address"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        borderBottom
      />

      <div className="flex flex-col items-center gap-[12px]">
        <Button
          title={isLoading ? "Sending..." : "Send reset link"}
          className="w-full"
          type="submit"
          disabled={isLoading}
        />
        <Link href="/login" className="text-[14px] font-normal underline uppercase">
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
