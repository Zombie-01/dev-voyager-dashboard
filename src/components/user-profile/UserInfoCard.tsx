"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { getAccessToken } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default function UserInfoCard({ mediaData }: { mediaData: any }) {
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    logo_url: mediaData?.logo_url || "",
    brand_color: mediaData?.brand_color || "#000000",
    chat_color: mediaData?.chat_color || "#ffffff",
    text_color: mediaData?.text_color || "#000000",
    bot_name: mediaData?.bot_name || "",
    bot_description: mediaData?.bot_description || "",
    media_base_url: mediaData?.media_base_url || "",
    name: mediaData?.name || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = await getAccessToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/media`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update media");

      const result = await res.json();
      console.log("Updated media:", result);
      closeModal();
    } catch (err) {
      console.error("Error updating media:", err);
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Media Info</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{form.bot_description}</p>
        </div>
        <Button size="sm" onClick={openModal}>✏️ Edit</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          {form.logo_url && (
            <Image
              src={form.logo_url}
              alt="Logo"
              width={64}
              height={64}
              className="rounded border dark:border-gray-700"
            />
          )}
          <div>
            <div className="font-medium text-gray-800 dark:text-white/90">{form.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{form.media_base_url}</div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-sm">
            <p className="text-gray-500">Brand</p>
            <div className="w-6 h-6 rounded" style={{ backgroundColor: form.brand_color }} />
          </div>
          <div className="text-sm">
            <p className="text-gray-500">Text</p>
            <div className="w-6 h-6 rounded" style={{ backgroundColor: form.text_color }} />
          </div>
          <div className="text-sm">
            <p className="text-gray-500">Chat</p>
            <div className="w-6 h-6 rounded" style={{ backgroundColor: form.chat_color }} />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-10 overflow-y-auto max-h-[90vh]">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
            Edit Media Info
          </h4>

          <form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Media Name</Label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Bot Name</Label>
                <input
                  type="text"
                  value={form.bot_name}
                  onChange={(e) => handleChange("bot_name", e.target.value)}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Bot Description</Label>
                <input
                  type="text"
                  value={form.bot_description}
                  onChange={(e) => handleChange("bot_description", e.target.value)}
                />
              </div>
              <div>
                <Label>Media Base URL</Label>
                <input
                  type="text"
                  value={form.media_base_url}
                  onChange={(e) => handleChange("media_base_url", e.target.value)}
                />
              </div>
              <div>
                <Label>Logo URL</Label>
                <input
                  type="text"
                  value={form.logo_url}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                />
              </div>
              <div>
                <Label>Brand Color</Label>
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={(e) => handleChange("brand_color", e.target.value)}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <input
                  type="color"
                  value={form.text_color}
                  onChange={(e) => handleChange("text_color", e.target.value)}
                />
              </div>
              <div>
                <Label>Chat Color</Label>
                <input
                  type="color"
                  value={form.chat_color}
                  onChange={(e) => handleChange("chat_color", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
