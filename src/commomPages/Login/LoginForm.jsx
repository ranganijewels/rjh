"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Link from "next/link";
import { loginUser } from "@/store/authThunks";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { authFormContainer } from "./authFormStyles";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    const resultAction = await dispatch(loginUser({ email, password }));

    setIsLoading(false);

    if (loginUser.fulfilled.match(resultAction)) {
      router.push(redirectTo);
    } else {
      const payload = resultAction.payload;
      const message =
        typeof payload === "string" ? payload.toLowerCase() : "";

      if (message.includes("verify") || message.includes("unverified")) {
        toast.error("Please verify your email before logging in.");
      } else if (
        message.includes("invalid") ||
        message.includes("incorrect") ||
        message.includes("wrong password") ||
        message.includes("credentials")
      ) {
        toast.error("Incorrect email or password.");
      } else if (message.includes("network") || message === "") {
        toast.error("Something went wrong. Please try again.");
      } else {
        toast.error(payload);
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className={authFormContainer}>
      <h1 className="xl:text-[18px] text-[16px] font-medium">
        Login to Your RJ HOUSE Account
      </h1>

      <p className="text-[13px] font-normal text-[var(--grey-2)] leading-relaxed -mt-3">
        Sign in to complete your purchase, track orders, save your wishlist and
        register your lifetime warranty. New here? Creating an account takes a
        moment.
      </p>

      <Input
        placeholder="Email Address"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        borderBottom
      />

      <div>
        <Input
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={show ? "text" : "password"}
          borderBottom
          rightIcon={
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              aria-label={show ? "Hide password" : "Show password"}
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)] focus-visible:ring-2 focus-visible:ring-[var(--teal-2)] focus-visible:rounded-full"
            >
              {show ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col items-center gap-[12px]">
        <Button
          title={isLoading ? "Logging in..." : "Login"}
          className="w-full"
          type="submit"
          disabled={isLoading}
        />

        <Link
          href={
            redirectTo && redirectTo !== "/"
              ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}`
              : "/sign-up"
          }
          aria-disabled={isLoading}
          onClick={(e) => isLoading && e.preventDefault()}
          className={`text-[14px] font-normal underline uppercase ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Create New Account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
