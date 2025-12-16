"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Link from "next/link";
import { loginUser } from "@/store/authThunks";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async () => {
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      router.push(redirectTo);
    } else {
      toast.error(resultAction.payload || "Login failed");
    }
  };

  return (
    <div className="md:w-[50%] w-full space-y-[30px] 2xl:px-[240px] xl:px-[100px] lg:px-[67px] md:px-[47px] px-[18px] py-[41px] md:py-0 md:m-auto">
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
          placeholder="Password"
          label="Password"
          className="mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          borderBottom
        />
        <Link href={"/"} className="xl:text-[14px] text-[12px] font-[400]">
          Forgot Password?
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col items-center gap-[12px]">
        <Button title="Login" className="w-full" onClick={handleLogin} />
        <p
          onClick={() => router.push("/sign-up")}
          className="text-[14px] font-[400] underline cursor-pointer uppercase"
        >
          Create New Account
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
