"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/authThunks";

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    try {
      const resultAction = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        const err = resultAction.payload;

        if (err?.error?.email) {
          toast.error(`${err.error.email[0]}`);
        } else if (err?.error?.password) {
          toast.error(`${err.error.password[0]}`);
        } else {
          toast.error(err.message || "Signup failed.");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
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

      <div>
        <Input
          placeholder="Password"
          label="Password"
          className="mb-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          borderBottom
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex flex-col gap-[12px] items-center">
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
      </div>
    </div>
  );
};

export default CreateAccount;
