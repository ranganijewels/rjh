"use client";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Modal from "@/components/ui/Modal/Modal";
import Typography from "@/components/ui/Typography/Typography";
import useIsMobile from "@/utils/useIsMobile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toTitleCase,
  displayFormat,
  standardFormat,
  dateToString,
  stringToDate,
} from "@/utils/string";
import { useCrudApi } from "@/hooks/useCrudApi";
import { updateCustomer } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff, Calendar } from "lucide-react";
import DatePicker from "@/components/ui/DatePicker/DatePicker";

const ProfileInfo = () => {
  const [isEditProfileModal, setIsEditProfileModal] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { isMobile } = useIsMobile();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const birthDateRef = React.useRef(null);
  const [dob, setDob] = useState();

  const customer = useSelector((state) => state.auth.customer);
  const { fetchAll, update } = useCrudApi("/api/profile-info");
  const { update: updatePassword } = useCrudApi(
    "/api/profile-info/change-password"
  );
  const dispatch = useDispatch();

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Validate the profile form
  const validateForm = () => {
    const newErrors = {};
    const storedUsers =
      JSON.parse(localStorage.getItem("userCredentials")) || [];
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    if (!editFormData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!editFormData.lastName.trim())
      newErrors.lastName = "Last name is required.";

    if (!editFormData.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(editFormData.phone)) {
      newErrors.phone = "Mobile number must be 10 digits.";
    } else {
      const isMobileDuplicate = storedUsers.some(
        (user) =>
          user.phone === editFormData.phone && user.email !== activeUser.email
      );
      if (isMobileDuplicate) {
        newErrors.phone = "Mobile number is already registered.";
      }
    }

    if (!editFormData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = "Email is not valid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle changes in the edit form
  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchAll();
        if (res?.data) {
          setEditFormData({
            firstName: res.data.first_name || "",
            lastName: res.data.last_name || "",
            phone: res.data.phone_number || "",
            email: res.data.email || "",
            birthDate: standardFormat(res.data.birth_date) || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    getProfile();
  }, [fetchAll]);

  // Action buttons for editing profile and changing password
  const ActionButton = () => (
    <div className="flex gap-[20px]">
      <Button
        title="Edit Profile"
        className="h-[37px] items-center flex"
        onClick={() => setIsEditProfileModal(true)}
      />
      <Button
        title="Change Password"
        className="h-[37px] items-center flex"
        variant="outlineTeal"
        onClick={() => setIsChangePassword(true)}
      />
    </div>
  );

  // Validate password change
  const validatePasswordChange = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required.";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save password changes
  const handleSavePassword = async () => {
    if (!validatePasswordChange()) return;

    try {
      const res = await updatePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });

      if (!res.status) {
        if (res.error?.new_password) {
          toast.error(res.error.new_password[0]);
        } else if (res.error?.confirm_password) {
          toast.error(res.error.confirm_password[0]);
        } else if (res.error?.current_password) {
          toast.error(res.error.current_password[0]);
        } else {
          toast.error(res.message || "Failed to change password");
        }
        return;
      }

      setIsChangePassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error("Something went wrong while changing password");
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    try {
      const res = await update({
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        phone_number: editFormData.phone,
        email: editFormData.email,
        birth_date: displayFormat(editFormData.birthDate),
      });

      // Update Redux store
      dispatch(updateCustomer(res.data));

      // Update localStorage
      localStorage.setItem("activeUser", JSON.stringify(res.data));

      setIsEditProfileModal(false);
    } catch (err) {}
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <div className="xl:mb-[50px] mb-[30px] flex justify-between items-center">
        <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
          Profile
        </p>
        {!isMobile && <ActionButton />}
      </div>
      <div className="flex flex-col gap-[39px]">
        <div>
          <Typography variant="h5" className="mb-[11px]">
            Name
          </Typography>

          <p className="md:text-[24px] text-[18px] font-[500]">
            {toTitleCase(customer?.first_name)}{" "}
            {toTitleCase(customer?.last_name)}
          </p>
        </div>

        <div>
          <Typography variant="h5" className="mb-[11px]">
            Email
          </Typography>

          <p className="md:text-[24px] text-[18px] font-[500]">
            {customer?.email}
          </p>
        </div>

        <div>
          {customer?.phone_number && (
            <>
              <Typography variant="h5" className="mb-[11px]">
                Mobile Number
              </Typography>
              <p className="md:text-[24px] text-[18px] font-[500]">
                {customer.phone_number}
              </p>
            </>
          )}
        </div>

        <div>
          <Typography variant="h5" className="mb-[11px]">
            Date of Birth
          </Typography>
          <p className="md:text-[24px] text-[18px] font-[500]">
            {customer?.birth_date
              ? displayFormat(customer.birth_date)
              : "Not provided"}
          </p>
        </div>

        {isMobile && <ActionButton />}
      </div>

      <Modal
        isOpen={isEditProfileModal}
        onClose={() => setIsEditProfileModal(false)}
        title="Edit Profile"
      >
        <div className="grid grid-cols-2 xl:gap-[30px] gap-[15px]">
          <div>
            <Input
              placeholder="First Name"
              label="First Name"
              borderBottom
              value={editFormData.firstName}
              onChange={(e) => handleEditChange("firstName", e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Last Name"
              label="Last Name"
              borderBottom
              value={editFormData.lastName}
              onChange={(e) => handleEditChange("lastName", e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            placeholder="Mobile Number"
            label="Mobile Number"
            borderBottom
            value={editFormData.phone}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,10}$/.test(input)) {
                handleEditChange("phone", input);
              }
            }}
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <Input
          placeholder="Email"
          label="Email"
          borderBottom
          value={editFormData.email}
          disabled
        />

        {/* <Input
          placeholder="Date of Birth"
          label="Date of Birth"
          borderBottom
          type="date"
          ref={birthDateRef}
          value={editFormData.birthDate}
          max={new Date().toISOString().split("T")[0]}
          className="cursor-pointer"
          onChange={(e) => handleEditChange("birthDate", e.target.value)}
          rightIcon={
            <button
              type="button"
              onClick={() => birthDateRef.current?.showPicker()}
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)] border-none bg-transparent p-0 outline-none"
            >
              <Calendar
                size={18}
                onClick={() => birthDateRef.current?.showPicker()}
              />
            </button>
          }
        /> */}

        <DatePicker
          value={stringToDate(editFormData.birthDate)}
          onChange={(date) => {
            handleEditChange("birthDate", dateToString(date));
          }}
          label="Date Of Birth"
        />

        <div className="flex gap-[20px] pt-[30px]">
          <Button title="Save" className="w-full" onClick={handleSaveProfile} />
          <Button
            title="Cancel"
            variant="outlineTeal"
            className="w-full"
            onClick={() => setIsEditProfileModal(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isChangePassword}
        onClose={() => setIsChangePassword(false)}
        title="Change Password"
      >
        <Input
          placeholder="Current Password"
          label="Current Password"
          borderBottom
          type={showPassword.current ? "text" : "password"}
          value={passwordForm.currentPassword}
          onChange={(e) =>
            handlePasswordChange("currentPassword", e.target.value)
          }
          rightIcon={
            <button
              type="button"
              onClick={() => togglePassword("current")}
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)]"
            >
              {showPassword.current ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />
        {passwordErrors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">
            {passwordErrors.currentPassword}
          </p>
        )}
        <Input
          placeholder="New Password"
          label="New Password"
          borderBottom
          type={showPassword.new ? "text" : "password"}
          value={passwordForm.newPassword}
          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
          rightIcon={
            <button
              type="button"
              onClick={() => togglePassword("new")}
              className="text-[var(--teal-2)] hover:text-[var(--teal-1)]"
            >
              {showPassword.new ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          }
        />
        {passwordErrors.newPassword && (
          <p className="text-red-500 text-sm mt-1">
            {passwordErrors.newPassword}
          </p>
        )}
        <div>
          <Input
            placeholder="Confirm Password"
            label="Confirm Password"
            borderBottom
            type={showPassword.confirm ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              handlePasswordChange("confirmPassword", e.target.value)
            }
            rightIcon={
              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="text-[var(--teal-2)] hover:text-[var(--teal-1)]"
              >
                {showPassword.confirm ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            }
          />
          {passwordErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {passwordErrors.confirmPassword}
            </p>
          )}

          <Link
            href="/forgot-password"
            title="Forgot password"
            className="text-[var(--teal-1)] mt-[18px] block"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex gap-[20px] pt-[30px]">
          <Button
            title="Save"
            className="w-full"
            onClick={handleSavePassword}
          />
          <Button
            title="Cancel"
            variant="outlineTeal"
            className="w-full"
            onClick={() => setIsChangePassword(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProfileInfo;
