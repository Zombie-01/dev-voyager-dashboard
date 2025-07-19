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

      if (!res.ok) throw new Error("Медиа шинэчлэхэд алдаа гарлаа");

      const result = await res.json();
      console.log("Медиа шинэчлэгдлээ:", result);
      closeModal();
    } catch (err) {
      console.error("Медиа шинэчлэхэд алдаа:", err);
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Медиа мэдээлэл</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{form.bot_description || "Тодорхойлолт алга"}</p>
        </div>
        <Button size="sm" onClick={openModal}>
          ✏️ Засах
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="flex items-center gap-4">
          {form.logo_url ? (
            <Image
              src={form.logo_url}
              alt="Лого"
              width={64}
              height={64}
              className="rounded border dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
              Логогүй
            </div>
          )}
          <div>
            <div className="font-medium text-gray-800 dark:text-white/90">{form.name || "Медиа нэр"}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{form.media_base_url || "URL алга"}</div>
          </div>
        </div>

        <div className="flex gap-6">
          <ColorPreview label="Брэнд" color={form.brand_color} />
          <ColorPreview label="Текст" color={form.text_color} />
          <ColorPreview label="Чат" color={form.chat_color} />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4 dark:text-gray-200">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-10 overflow-y-auto max-h-[90vh]">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">Медиа мэдээлэл засах</h4>

          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Медиа нэр</Label>
                <input
                  type="text"
                  value={form.name}
                  placeholder="Медиа нэрээ оруулна уу"
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <Label>Ботын нэр</Label>
                <input
                  type="text"
                  value={form.bot_name}
                  placeholder="Ботын нэр"
                  onChange={(e) => handleChange("bot_name", e.target.value)}
                  className="input"
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Ботын тодорхойлолт</Label>
                <input
                  type="text"
                  value={form.bot_description}
                  placeholder="Ботын товч танилцуулга"
                  onChange={(e) => handleChange("bot_description", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <Label>Медиа үндсэн URL</Label>
                <input
                  type="text"
                  value={form.media_base_url}
                  placeholder="Жишээ: https://example.mn"
                  onChange={(e) => handleChange("media_base_url", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <Label>Лого URL</Label>
                <input
                  type="text"
                  value={form.logo_url}
                  placeholder="Логоны URL"
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <Label>Брэнд өнгө</Label>
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={(e) => handleChange("brand_color", e.target.value)}
                  className="w-12 h-8 cursor-pointer rounded"
                  title={form.brand_color}
                />
              </div>
              <div>
                <Label>Текстийн өнгө</Label>
                <input
                  type="color"
                  value={form.text_color}
                  onChange={(e) => handleChange("text_color", e.target.value)}
                  className="w-12 h-8 cursor-pointer rounded"
                  title={form.text_color}
                />
              </div>
              <div>
                <Label>Чатны өнгө</Label>
                <input
                  type="color"
                  value={form.chat_color}
                  onChange={(e) => handleChange("chat_color", e.target.value)}
                  className="w-12 h-8 cursor-pointer rounded"
                  title={form.chat_color}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Болих
              </Button>
              <Button size="sm" onClick={handleSave}>
                Хадгалах
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function ColorPreview({ label, color }: { label: string; color: string }) {
  return (
    <div className="text-sm text-center">
      <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div
        className="mx-auto w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: color }}
        title={color}
      />
    </div>
  );
}
