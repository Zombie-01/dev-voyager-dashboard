import { getAccessToken } from "@auth0/nextjs-auth0";
import Label from "../form/Label";
import { useState } from "react";
import Button from "../ui/button/Button";

interface Media {
  id: string;
  name: string;
  logo_url: string;
  brand_color: string;
  chat_color: string | null;
  text_color: string;
  bot_name: string;
  bot_description: string;
  media_base_url: string;
  created_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  MediaSponsorBatch: any;
  UserOnMedia: any;
  MediaArticle: any;
  CreditTxn: any;
  admin_id: string;
  admin: any;
  invoice: any;
}
interface MediaConfigProps {
  mediaData: Media; // Optional if you want, but you use it in Reset button
  form: MediaForm;
  setForm: React.Dispatch<React.SetStateAction<MediaForm>>;
}

type MediaForm = {
  logo_url: string;
  brand_color: string;
  chat_color: string;
  text_color: string;
  bot_name: string;
  bot_description: string;
  media_base_url: string;
  name: string;
};

export default function MediaConfig({ mediaData, setForm, form }: MediaConfigProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof MediaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Медиа шинэчлэхэд алдаа гарлаа");
      }

      // Optionally show success message here, e.g. toast.success("Амжилттай шинэчлэгдлээ");
    } catch (err: any) {
      // Optionally show error message here, e.g. toast.error(err.message || "Алдаа гарлаа");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-1/3 flex gap-40 justify-between">
      <div className="w-full rounded-2xl shadow-lg border p-6 flex flex-col">
        <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
          Үндсэн тохиргоо
        </h4>
        <form className="space-y-4 flex-1" onSubmit={(e) => e.preventDefault()}>
          <div className="w-full">
            <Label htmlFor="name">Медиа нэр</Label>
            <input
              id="name"
              type="text"
              value={form.name}
              placeholder="Медиа нэрээ оруулна уу"
              onChange={(e) => handleChange("name", e.target.value)}
              className="input border w-full px-4 py-2 rounded-xl"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="bot_name">Ботын нэр</Label>
            <input
              id="bot_name"
              type="text"
              value={form.bot_name}
              placeholder="Ботын нэр"
              onChange={(e) => handleChange("bot_name", e.target.value)}
              className="input border w-full px-4 py-2 rounded-xl"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="bot_description">Ботын тодорхойлолт</Label>
            <textarea
              id="bot_description"
              value={form.bot_description}
              placeholder="Ботын товч танилцуулга"
              onChange={(e) => handleChange("bot_description", e.target.value)}
              className="input border w-full px-4 py-2 rounded-xl"
              rows={4}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="media_base_url">Медиа үндсэн URL</Label>
            <input
              id="media_base_url"
              type="text"
              value={form.media_base_url}
              placeholder="Жишээ: https://example.mn"
              onChange={(e) => handleChange("media_base_url", e.target.value)}
              className="input border w-full px-4 py-2 rounded-xl"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="logo_url">Лого URL</Label>
            <input
              id="logo_url"
              type="text"
              value={form.logo_url}
              placeholder="Логоны URL"
              onChange={(e) => handleChange("logo_url", e.target.value)}
              className="input border w-full px-4 py-2 rounded-xl"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="brand_color">Брэнд өнгө</Label>
            <input
              id="brand_color"
              type="color"
              value={form.brand_color}
              onChange={(e) => handleChange("brand_color", e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
              title={form.brand_color}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="text_color">Текстийн өнгө</Label>
            <input
              id="text_color"
              type="color"
              value={form.text_color}
              onChange={(e) => handleChange("text_color", e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
              title={form.text_color}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="chat_color">Чатны өнгө</Label>
            <input
              id="chat_color"
              type="color"
              value={form.chat_color || "#ffffff"}
              onChange={(e) => handleChange("chat_color", e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
              title={form.chat_color || "#ffffff"}
            />
          </div>
        </form>
        <div className="flex gap-4 mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setForm({
                logo_url: mediaData?.logo_url || "",
                brand_color: mediaData?.brand_color || "#000000",
                chat_color: mediaData?.chat_color || "#ffffff",
                text_color: mediaData?.text_color || "#000000",
                bot_name: mediaData?.bot_name || "",
                bot_description: mediaData?.bot_description || "",
                media_base_url: mediaData?.media_base_url || "",
                name: mediaData?.name || "",
              })
            }
            disabled={loading}
          >
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading} aria-busy={loading}>
            {loading ? "..." : "Шинэчлэх"}
          </Button>
        </div>
      </div>
    </div>
  );
}
