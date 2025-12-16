"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import Modal from "@/components/ui/Modal/Modal";
import Input from "@/components/ui/Input/Input";
import RingSizeSelector from "../ProductDetails/RingSizeSelector";
import Link from "next/link";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";

const SizeProfile = () => {
  const [openSizeProfile, setOpenSizeProfile] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    label: "",
    ringSize: "",
    braceletSize: "",
    necklaceSize: "",
    bandSize: "",
  });
  const [sizes, setSizes] = useState([]);

  const {
    fetchAll: fetchProfilesApi,
    create,
    update,
    remove,
  } = useCrudApi("/api/size-profile");

  const { fetchAll: fetchSizesApi } = useCrudApi("/api/sizes");

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetchProfilesApi();
      setProfiles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching profiles", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchSizesApi()
      .then((res) => setSizes(res.data || []))
      .catch((err) => console.error("Error fetching sizes", err));
  }, [fetchProfilesApi, fetchSizesApi]);

  const handleSave = async () => {
    if (!form.label) return toast.error("Please enter a Name/Label");

    const profilePayload = {
      name: form.label,
      ring_size: form.ringSize,
      bracelet_size: form.braceletSize,
      necklace_length: form.necklaceSize,
      wedding_band_size: form.bandSize,
    };

    try {
      setLoading(true);
      if (editingId) {
        await update(editingId, profilePayload);
        toast.success("Profile updated successfully!");
      } else {
        await create(profilePayload);
        toast.success("Profile created successfully!");
      }
      await fetchProfiles();
      setOpenSizeProfile(false);
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Something went wrong while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await remove(id);
      toast.success("Profile deleted successfully!");
      const res = await fetchProfilesApi();
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong while deleting.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    setForm({
      label: profile.name,
      ringSize: profile.ring_size,
      braceletSize: profile.bracelet_size,
      necklaceSize: profile.necklace_length,
      bandSize: profile.wedding_band_size,
    });
    setEditingId(id);
    setOpenSizeProfile(true);
  };

  const resetForm = () => {
    setForm({
      label: "",
      ringSize: "",
      braceletSize: "",
      necklaceSize: "",
      bandSize: "",
    });
    setEditingId(null);
  };

  return (
    <>
      <div className="xl:mb-[50px] mb-[30px] flex justify-between items-center">
        <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
          Size Profile
        </p>
        <Button
          title="Add New Size Profile"
          className="h-[37px] items-center flex"
          onClick={() => {
            resetForm();
            setOpenSizeProfile(true);
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : profiles.length === 0 ? (
        <p className="text-gray-500 text-lg">No size profiles found</p>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 xl:gap-x-[30px] gap-x-[20px] xl:gap-y-[40px] gap-y-[20px]">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="xl:p-[23px_35px] p-[15px_23px] flex flex-col justify-around gap-[27px] w-full h-[344px] bg-[var(--product-bg)]"
            >
              <div className="space-y-[10px]">
                <h2 className="lg:text-[24px] text-[16px] font-[500] pb-[5px] capitalize">
                  {p.name}
                </h2>
                {p.ring_size && (
                  <div className="grid grid-cols-2">
                    <Typography variant="h6" className="font-[500]">
                      Ring Size :
                    </Typography>
                    <Typography variant="h6" textColor="teal">
                      {p.ring_size}
                    </Typography>
                  </div>
                )}
                {p.bracelet_size && (
                  <div className="grid grid-cols-2">
                    <Typography variant="h6" className="font-[500]">
                      Bracelet Size :
                    </Typography>
                    <Typography variant="h6" textColor="teal">
                      {p.bracelet_size}
                    </Typography>
                  </div>
                )}
                {p.necklace_length && (
                  <div className="grid grid-cols-2">
                    <Typography variant="h6" className="font-[500]">
                      Necklace Length :
                    </Typography>
                    <Typography variant="h6" textColor="teal">
                      {p.necklace_length}
                    </Typography>
                  </div>
                )}
                {p.wedding_band_size && (
                  <div className="grid grid-cols-2">
                    <Typography variant="h6" className="font-[500]">
                      Wedding Band :
                    </Typography>
                    <Typography variant="h6" textColor="teal">
                      {p.wedding_band_size}
                    </Typography>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-[20px]">
                <Button title="Edit" onClick={() => handleEdit(p.id)} />
                <Button
                  title="Delete"
                  variant="outlineTeal"
                  onClick={() => handleDelete(p.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={openSizeProfile}
        onClose={() => {
          setOpenSizeProfile(false);
          resetForm();
        }}
        title={editingId ? "Edit Size Profile" : "Add New Size Profile"}
      >
        <Input
          placeholder="Name/Label"
          label="Name/Label"
          borderBottom
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <RingSizeSelector
          label={"Ring"}
          ringSizeOptions={
            sizes.find((e) => e.name === "Ring")?.sizes.map((s) => s.value) ||
            []
          }
          dropdownPlaceholder={"Select Ring Size"}
          labelStyle={"!text-[16px] !font-[400]"}
          selectedValue={form.ringSize}
          onChange={(val) => setForm({ ...form, ringSize: val })}
          containerStyle={"flex flex-row gap-[18px] !items-center"}
          buttonStyle={"!w-[169px]"}
          fullWidth
          notShowGuide
        />
        <RingSizeSelector
          label={"Bracelet"}
          ringSizeOptions={
            sizes
              .find((e) => e.name === "Bracelet")
              ?.sizes.map((s) => s.value) || []
          }
          dropdownPlaceholder={"Select Bracelet Size"}
          labelStyle={"!text-[16px] !font-[400]"}
          selectedValue={form.braceletSize}
          onChange={(val) => setForm({ ...form, braceletSize: val })}
          containerStyle={"flex flex-row gap-[18px] !items-center"}
          buttonStyle={"!w-[169px]"}
          fullWidth
          notShowGuide
        />
        <RingSizeSelector
          label={"Necklace"}
          ringSizeOptions={
            sizes
              .find((e) => e.name === "Necklace")
              ?.sizes.map((s) => s.value) || []
          }
          dropdownPlaceholder={"Select Length"}
          labelStyle={"!text-[16px] !font-[400]"}
          selectedValue={form.necklaceSize}
          onChange={(val) => setForm({ ...form, necklaceSize: val })}
          containerStyle={"flex flex-row gap-[18px] !items-center"}
          buttonStyle={"!w-[169px]"}
          fullWidth
          notShowGuide
        />
        <RingSizeSelector
          label={"Wedding Band"}
          ringSizeOptions={
            sizes
              .find((e) => e.name === "Wedding Band")
              ?.sizes.map((s) => s.value) || []
          }
          dropdownPlaceholder={"Select Band Size"}
          labelStyle={"!text-[16px] !font-[400]"}
          selectedValue={form.bandSize}
          onChange={(val) => setForm({ ...form, bandSize: val })}
          containerStyle={"flex flex-row gap-[18px] !items-center"}
          buttonStyle={"!w-[169px]"}
          fullWidth
          notShowGuide
        />
        <Link
          href="/ring-size-guide"
          className="text-[12px] font-[400] underline tracking-[0.24px]"
        >
          Size Guide
        </Link>
        <div className="flex gap-[20px] pt-[30px]">
          <Button
            title="Save"
            className="w-full"
            onClick={handleSave}
            disabled={loading}
          />
          <Button
            title="Cancel"
            variant="outlineTeal"
            className="w-full"
            onClick={() => {
              setOpenSizeProfile(false);
              resetForm();
            }}
            disabled={loading}
          />
        </div>
      </Modal>
    </>
  );
};

export default SizeProfile;
