"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { authFormContainer } from "./authFormStyles";

const MIN_LENGTH = 8;

const ResetPasswordForm = () => {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (
    <button
      type="button"
      onClick={() => setShow((p) => !p)}
      aria-label={show ? "Hide password" : "Show password"}
      className="text-[var(--teal-2)] hover:text-[var(--teal-1)] focus-visible:ring-2 focus-visible:ring-[var(--teal-2)] focus-visible:rounded-full"
    >
      {show ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  );

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (password.length < MIN_LENGTH) {
      toast.error(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirm_password: confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.status) {
        toast.error(data.message || "Couldn't reset your password. Try again in a moment.");
        return;
      }
      setDone(true);
    } catch {
      toast.error("Couldn't reset your password. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={authFormContainer}>
        <h1 className="xl:text-[18px] text-[16px] font-medium">This link is incomplete</h1>
        <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
          Open the reset link from your email again, or request a new one.
        </p>
        <Button title="Request a new link" className="w-full" url="/forgot-password" />
      </div>
    );
  }

  if (done) {
    return (
      <div className={authFormContainer}>
        <h1 className="xl:text-[18px] text-[16px] font-medium">Password updated</h1>
        <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
          You can now log in with your new password. For your security, you&apos;ve been signed out on
          other devices.
        </p>
        <Button title="Log in" className="w-full" url="/login" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={authFormContainer} noValidate>
      <h1 className="xl:text-[18px] text-[16px] font-medium">Choose a new password</h1>

      <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
        Use at least {MIN_LENGTH} characters. You&apos;ll use this password the next time you log in.
      </p>

      <Input
        name="new-password"
        label="New password"
        placeholder="New password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={show ? "text" : "password"}
        borderBottom
        rightIcon={toggle}
      />

      <Input
        name="confirm-password"
        label="Confirm new password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        type={show ? "text" : "password"}
        borderBottom
      />

      <div className="flex flex-col items-center gap-[12px]">
        <Button
          title={isLoading ? "Saving..." : "Save new password"}
          className="w-full"
          type="submit"
          disabled={isLoading}
        />
        <Link href="/forgot-password" className="text-[14px] font-normal underline uppercase">
          Request a new link
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
