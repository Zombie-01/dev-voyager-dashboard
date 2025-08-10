import { getAccessToken } from "@auth0/nextjs-auth0";
import Label from "../form/Label";
import { useState } from "react";
import Button from "../ui/button/Button";

interface PoliticalConfigForm {
  political: string; // single URL or you can make it array if needed
  title: string;
  description: string;
  question1: string;
  question2: string;
  question3: string;
}

interface PoliticalConfigProps {
  initialForm?: Partial<PoliticalConfigForm>;
}

export default function PoliticalConfig({ initialForm = {} }: PoliticalConfigProps) {
  const [form, setForm] = useState<PoliticalConfigForm>({
      political: "",
    title: "",
    description: "",
    question1: "",
    question2: "",
    question3: "",
    ...initialForm,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof PoliticalConfigForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/political`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Алдаа гарлаа");
      }

      // Optionally success toast here
    } catch (err: any) {
      console.error(err);
      // Optionally error toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl shadow-lg border p-6 flex flex-col">
      <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
        Агууллаггийн тохиргоо
      </h4>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 flex-1">
    

        <div>
          <Label htmlFor="turin">Улс төрийн чиг баримжаа</Label>
          <input
            id="turin"
            type="text"
            value={form.political}
            placeholder="Турин"
            onChange={(e) => handleChange("political", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
          />
        </div>


        <div>
          <Label htmlFor="title">Гарчиг</Label>
          <input
            id="title"
            type="text"
            value={form.title}
            placeholder="Гарчиг"
            onChange={(e) => handleChange("title", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="description">Тайлбар</Label>
          <textarea
            id="description"
            value={form.description}
            placeholder="Тайлбар"
            onChange={(e) => handleChange("description", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
            rows={3}
          />
        </div>

        {/* Default 3 questions */}
        <div>
          <Label htmlFor="question1">Асуулт 1</Label>
          <input
            id="question1"
            type="text"
            value={form.question1}
            placeholder="Асуулт 1"
            onChange={(e) => handleChange("question1", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="question2">Асуулт 2</Label>
          <input
            id="question2"
            type="text"
            value={form.question2}
            placeholder="Асуулт 2"
            onChange={(e) => handleChange("question2", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="question3">Асуулт 3</Label>
          <input
            id="question3"
            type="text"
            value={form.question3}
            placeholder="Асуулт 3"
            onChange={(e) => handleChange("question3", e.target.value)}
            className="input border w-full px-4 py-2 rounded-xl"
          />
        </div>
      </form>

      <div className="flex gap-4 mt-6">
        <Button size="sm" onClick={handleSave} disabled={loading} aria-busy={loading}>
          {loading ? "..." : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}
