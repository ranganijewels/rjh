"use client";
import React from "react";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/authThunks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LogoutConfirmationModal = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggingOut = useSelector((state) => state.auth.loading);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success("Logout Successfull");
        router.push("/login");
      })
      .catch((err) => {
        toast.error("Logout failed ", err);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-start z-[9999]">
      <div className="xl:w-[25%] lg:w-[40%] md:w-[50%] w-full bg-white shadow-lg flex flex-col gap-[25px] p-[40px_48px] mt-[100px] relative">
        {/* Elova Logo */}
        <img
          src="/icons/elova-logo.svg"
          alt="Elova Logo"
          className="md:w-auto w-[100px] h-[28px]"
        />

        {/* Close Icon */}
        <img
          src="/icons/close.svg"
          className="w-[15px] h-[15px] absolute right-5 top-5 cursor-pointer"
          onClick={onClose}
          alt="Close Icon"
        />

        {/* Confirmation Message */}
        <p className="text-base text-gray-700">
          Are you sure you want to log out?
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-[10px]">
          <Button
            title={isLoggingOut ? "Logging out..." : "Logout"}
            onClick={handleLogout}
          />
          <Button onClick={onClose} title="Cancel" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
