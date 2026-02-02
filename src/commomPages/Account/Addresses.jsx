"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import Input from "@/components/ui/Input/Input";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Modal from "@/components/ui/Modal/Modal";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";
import Dropdown from "@/components/ui/Dropdown/Dropdown";

const Addresses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressType: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const { fetchAll, create, update, remove } = useCrudApi("/api/address");

  useEffect(() => {
    fetchAll()
      .then((res) => setAddresses(res.data || []))
      .catch((err) => console.error("Error fetching addresses", err));
  }, [fetchAll]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.addressType.trim())
      newErrors.addressType = "Address type is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateAddress = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_type: formData.addressType,
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        phone: formData.phone,
        is_default: isDefault ? 1 : 0,
      };

      if (editingAddressId) {
        await update(editingAddressId, payload);
        toast.success("Address updated successfully!");
      } else {
        await create(payload);
        toast.success("Address created successfully!");
      }

      const res = await fetchAll();
      setAddresses(res.data || []);

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Address save failed:", err);
      toast.error("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (!addressToEdit) return;

    setFormData({
      firstName: addressToEdit.first_name,
      lastName: addressToEdit.last_name,
      addressType: addressToEdit.address_type,
      streetAddress: addressToEdit.street_address,
      city: addressToEdit.city,
      state: addressToEdit.state,
      zipCode: addressToEdit.zip_code,
      phone: addressToEdit.phone,
    });
    setIsDefault(addressToEdit.is_default);
    setEditingAddressId(id);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await remove(id);
      toast.success("Address deleted successfully!");

      const res = await fetchAll();
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Address delete failed:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
    setFormData({
      firstName: "",
      lastName: "",
      addressType: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    });
    setIsDefault(false);
    setErrors({});
  };

  return (
    <>
      <div className="xl:mb-[50px] mb-[30px] flex justify-between items-center">
        <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
          Addresses
        </p>
        <Button
          title="add new address"
          className="h-[37px] items-center flex"
          onClick={() => {
            setIsModalOpen(true);
            setEditingAddressId(null);
            setFormData({
              firstName: "",
              lastName: "",
              addressType: "",
              streetAddress: "",
              city: "",
              state: "",
              zipCode: "",
              phone: "",
            });
            setIsDefault(false);
            setErrors({});
          }}
        />
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500 text-lg">No address found</p>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 xl:gap-x-[30px] gap-x-[20px] xl:gap-y-[40px] gap-y-[20px]">
          {addresses.map(
            ({
              id,
              first_name,
              last_name,
              address_type,
              street_address,
              city,
              state,
              zip_code,
              phone,
              is_default,
            }) => (
              <div
                key={id}
                className="xl:p-[23px_35px] p-[15px_23px] flex flex-col justify-around gap-[27px] w-full h-[344px] bg-[var(--product-bg)]"
              >
                <div className="space-y-[13px]">
                  {is_default === 1 && (
                    <Typography
                      variant="h6"
                      textColor="grey1"
                      className="font-[500] p-[2px_6px] bg-[var(--teal-2)] w-[80px]"
                    >
                      DEFAULT
                    </Typography>
                  )}
                  <h2 className="lg:text-[24px] text-[16px] font-[500]">
                    {first_name} {last_name}
                  </h2>
                  <Typography variant="p" className="font-[500]">
                    {address_type}
                  </Typography>
                  <Typography variant="p">{street_address}</Typography>
                  <Typography variant="p">
                    {city}, {state}, {zip_code}
                  </Typography>
                  <Typography variant="p">{phone}</Typography>
                </div>
                <div className="grid grid-cols-2 gap-[20px]">
                  <Button title="edit" onClick={() => handleEditAddress(id)} />
                  <Button
                    title="delete"
                    variant="outlineTeal"
                    onClick={() => handleDeleteAddress(id)}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddressId(null);
          setErrors({});
        }}
        title={editingAddressId ? "Edit Address" : "Add New Address"}
      >
        <div className="grid grid-cols-2 xl:gap-[30px] gap-[15px]">
          <div>
            <Input
              placeholder="First Name"
              label="First Name"
              borderBottom
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
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
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="addressType" className="text-sm font-medium mb-1">
            Address Type
          </label>
          <Dropdown
            id="addressType"
            options={["home", "work", "other"]}
            placeholder={formData.addressType || "Address Type"}
            className="w-full"
            borderBottom
            name="addressType"
            value={formData.addressType}
            onChange={(val) => handleChange("addressType", val)}
            fullWidth
          />
          {errors.addressType && (
            <p className="text-red-500 text-sm mt-1">{errors.addressType}</p>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <Input
            placeholder="Street Address"
            label="Street Address"
            borderBottom
            name="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
          />
          {errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
          )}

          <Input
            placeholder="Town/City"
            label="Town/City"
            borderBottom
            name="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}

          <Input
            placeholder="State"
            label="State"
            borderBottom
            name="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}

          <Input
            placeholder="Zip code"
            label="Zip code"
            borderBottom
            name="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}

          <Input
            placeholder="Phone"
            label="Phone"
            borderBottom
            name="phone"
            value={formData.phone}
            maxLength={10}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}

          <Checkbox
            name="default"
            label="Set As Default"
            checked={isDefault}
            onChange={() => setIsDefault((prev) => !prev)}
          />
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex gap-[20px]">
            <Button
              onClick={handleAddOrUpdateAddress}
              title={editingAddressId ? "Save" : "Save"}
              className="w-[211px]"
            />
            <Button
              onClick={() => setIsModalOpen(false)}
              title="Cancel"
              variant="outlineTeal"
              className="w-[211px]"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Addresses;
