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
      toast.error(resultAction.payload || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="md:w-[50%] w-full space-y-[30px] 2xl:px-[240px] xl:px-[100px] lg:px-[67px] md:px-[47px] px-[18px] py-[41px] md:py-0 md:m-auto"
    >
      <h2 className="xl:text-[18px] text-[16px] font-[500]">
        Login to Your ELOVA Account
      </h2>

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
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)]"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Link href="/" className="xl:text-[14px] text-[12px] font-[400]">
          Forgot Password?
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col items-center gap-[12px]">
        <Button
          title={isLoading ? "Logging in..." : "Login"}
          className="w-full"
          type="submit"
          disabled={isLoading}
        />

        <p
          onClick={() => !isLoading && router.push("/sign-up")}
          className={`text-[14px] font-[400] underline uppercase ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Create New Account
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
