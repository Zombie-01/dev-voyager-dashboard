"use client";

import React, { useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { InfoIcon, X, ArrowRight, RefreshCcw } from "lucide-react";
import Label from "../form/Label";
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

const DUMMY_USER = {
  name: "Адъяадорж Бадамсэрээжид",
  balance: "18,947₮",
  avatar: "https://lh3.googleusercontent.com/a/ACg8ocJKg-DtjEHWS9mY9Jg9hcAj8Uy-O7RgLZEOU_rOw90GMVTGQy4z=s96-c",
};

const credit = "1,197,025₮";
const sponsorLogo = "https://storage.googleapis.com/voyager-public/sponsor-assets/m-bank-logo.svg";
const sponsorName = "Мэдлэг санхүүжүүлэгч";
const sponsorUrl = "https://m-bank.mn/";

export default function UserInfoCard({ mediaData }: { mediaData: Media }) {
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

  const [withUser, setWithUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const related = [
    "Багш нарын тэтгэмжийн асуудал нь Монголын боловсролын салбарын үнэ цэнэ, нийгэмд үзүүлэх нөлөөний илэрхийлэл байж болох уу? Эсвэл энэ нь боловсролын салбарын үнэлэмжийн бууралтыг харуулж байна уу?",
    "Төсвийн шилжүүлгийн энэхүү шийдвэр нь Монголын улстөрийн соёл, ёс зүйн хандлагыг хэрхэн илэрхийлж байна вэ? Энэ нь иргэдийн улс төрийн итгэлцэлд хэрхэн нөлөөлж болох вэ?",
    "Багш нарын тэтгэмжийг хасах нь ирээдүйн боловсролын салбарт хэрхэн нөлөөлөх вэ? Энэ нь багш нарын урам зориг, ажлын чанарт хэрхэн тусах бол?",
  ];

  const handleChange = (field: string, value: string) => {
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
      if (!res.ok) throw new Error("Медиа шинэчлэхэд алдаа гарлаа");
      // Optionally show success
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-row items-stretch gap-4">
      {/* Left: Form */}
      <div className="w-[340px] min-w-[320px] max-w-[360px]  rounded-2xl shadow-lg border  p-6 flex flex-col">
        <h4 className="text-xl font-semibold text-black dark:text-whtie mb-6">Медиа мэдээлэл</h4>
        {/* Toggle and Reset buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${withUser ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setWithUser(true)}
            type="button"
          >
            Чат хэсэг
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${!withUser ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setWithUser(false)}
            type="button"
          >
            Үндсэн нүүр
          </button>
       
        </div>
        <form className="space-y-4 flex-1" onSubmit={e => e.preventDefault()}>
          <div>
            <Label>Медиа нэр</Label>
            <input
              type="text"
              value={form.name}
              placeholder="Медиа нэрээ оруулна уу"
              onChange={(e) => handleChange("name", e.target.value)}
              className="input border px-4 py-2 rounded-xl"
            />
          </div>
          <div>
            <Label>Ботын нэр</Label>
            <input
              type="text"
              value={form.bot_name}
              placeholder="Ботын нэр"
              onChange={(e) => handleChange("bot_name", e.target.value)}
              className="input border px-4 py-2 rounded-xl"
            />
          </div>
          <div>
            <Label>Ботын тодорхойлолт</Label>
            <input
              type="text"
              value={form.bot_description}
              placeholder="Ботын товч танилцуулга"
              onChange={(e) => handleChange("bot_description", e.target.value)}
              className="input border px-4 py-2 rounded-xl"
            />
          </div>
          <div>
            <Label>Медиа үндсэн URL</Label>
            <input
              type="text"
              value={form.media_base_url}
              placeholder="Жишээ: https://example.mn"
              onChange={(e) => handleChange("media_base_url", e.target.value)}
              className="input border px-4 py-2 rounded-xl"
            />
          </div>
          <div>
            <Label>Лого URL</Label>
            <input
              type="text"
              value={form.logo_url}
              placeholder="Логоны URL"
              onChange={(e) => handleChange("logo_url", e.target.value)}
              className="input border px-4 py-2 rounded-xl"
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
          >
            Reset
          </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={loading}
          >
          {loading ? "..." : "Шинэчлэх"}
        </Button>
          </div>
      </div>
      {/* Right: Preview */}
      <div
        className="relative bottom-4 right-4 z-50 w-[95vw] max-w-[650px] h-[95vh] max-h-[800px] flex flex-col overflow-hidden rounded-[36px] shadow-2xl font-sans"
        style={{
          background: `linear-gradient(${form.brand_color} 60%, rgb(255,255,255) 40%)`,
        }}
      >
        {/* Top bar */}
        <div className="relative flex items-center justify-between px-4 py-2 min-h-[64px] gap-3">
          {withUser ? (
            <div style={{ color: form.text_color }} className="flex items-center gap-3">
              <button className="border-2 border-transparent rounded-full cursor-pointer w-9 h-9 overflow-hidden">
                <img
                  src={DUMMY_USER.avatar}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="flex flex-col justify-center">
                <span className=" text-xs font-bold leading-3">{DUMMY_USER.name}</span>
                <span className=" text-xs font-medium leading-4">{DUMMY_USER.balance}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                style={{ color: form.text_color }}
                className="flex items-center gap-2 font-bold rounded-full px-4 py-1 bg-transparent"
                tabIndex={-1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
            </div>
          )}
          <img
            src={form.logo_url || "/logo.png"}
            alt="logo"
            className="w-10 h-10 rounded-full object-cover absolute left-1/2 -translate-x-1/2 bg-white shadow"
          />
          <button
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" style={{ color: form.text_color }} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-0 mx-4 mt-2 mb-0 bg-gray-100 rounded-[36px] shadow-lg flex flex-col overflow-auto px-4 py-4">
          <Creditbar brand_color={form.brand_color} />
          {withUser ? (
            // ...existing chat-like content...
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto pt-6 pb-6 flex flex-col gap-4">
                {/* User message */}
                <div className="self-end p-3 rounded-2xl text-[14px] font-medium max-w-[80%] whitespace-pre-wrap break-words relative bg-white text-gray-900 shadow-lg">
                  <p className="m-0 p-0 leading-relaxed">
                    Багш нарын тэтгэмжийн асуудал нь Монголын боловсролын салбарын үнэ цэнэ, нийгэмд үзүүлэх нөлөөний илэрхийлэл байж болох уу? Эсвэл энэ нь боловсролын салбарын үнэлэмжийн бууралтыг харуулж байна уу?
                  </p>
                </div>
                {/* AI answer */}
                <div className="self-start p-3 rounded-2xl text-[14px] font-medium max-w-[80%] whitespace-pre-wrap break-words relative  shadow-lg" style={{ background: form.chat_color, color: form.text_color }}>
                  <p className="m-0 p-0 leading-relaxed">
                    Багш нарын тэтгэмжийн асуудал нь Монголын боловсролын салбарын үнэ цэнэ, нийгэмд үзүүлэх нөлөөг илэрхийлэхийн зэрэгцээ, салбарын үнэлэмжийн бууралтыг ч харуулж байна.
                  </p>
                  <p className="m-0 p-0 leading-relaxed font-bold mt-2">Багш нарын тэтгэмжийн ач холбогдол:</p>
                  <ul className="list-disc pl-5">
                    <li>
                      <span className="font-bold">Нийгмийн баталгаа:</span> Багш нарын нийгмийн баталгааг хангах нь тэдний ажиллах урам зоригийг нэмэгдүүлж, боловсролын чанарыг сайжруулахад чухал үүрэгтэй. (<a href="https://moe.gov.mn/post/86126?utm_source=openai" target="_blank" rel="noopener noreferrer" className="font-bold underline">moe.gov.mn</a>)
                    </li>
                    <li>
                      <span className="font-bold">Мэргэжлийн хөгжил:</span> Багшийн хөгжлийг дэмжих цогц хөтөлбөр боловсруулж, тэдний мэргэжлийн ур чадварыг тасралтгүй хөгжүүлэх нь боловсролын салбарын үнэ цэнийг өсгөхөд хувь нэмэр оруулна. (<a href="https://www.mongolia.gov.mn/news/view/26687?utm_source=openai" target="_blank" rel="noopener noreferrer" className="font-bold underline">mongolia.gov.mn</a>)
                    </li>
                  </ul>
                  <p className="m-0 p-0 leading-relaxed font-bold mt-2">Үнэлэмжийн бууралтын илрэл:</p>
                  <ul className="list-disc pl-5">
                    <li>
                      <span className="font-bold">Цалин хөлсний асуудал:</span> Багш нарын цалин хөлс хангалтгүй байдал нь мэргэжлийн нэр хүндийг бууруулж, залуу үеийнхнийг энэ мэргэжлийг сонгох сонирхлыг бууруулж байна. (<a href="https://www.24tsag.mn/a/155889?utm_source=openai" target="_blank" rel="noopener noreferrer" className="font-bold underline">24tsag.mn</a>)
                    </li>
                    <li>
                      <span className="font-bold">Багшийн хомсдол:</span> Орон нутагт багшлах боловсон хүчин дутагдалтай байгаа нь боловсролын салбарын үнэлэмж буурч байгаагийн нэг илрэл юм. (<a href="https://www.mnb.mn/i/329677?utm_source=openai" target="_blank" rel="noopener noreferrer" className="font-bold underline">mnb.mn</a>)
                    </li>
                  </ul>
                  <p className="m-0 p-0 leading-relaxed font-bold mt-2">Дүгнэлт:</p>
                  <p className="m-0 p-0 leading-relaxed">
                    Багш нарын тэтгэмжийн асуудал нь боловсролын салбарын үнэ цэнийг илэрхийлэхийн зэрэгцээ, салбарын үнэлэмжийн бууралтыг ч харуулж байна. Тиймээс багш нарын нийгмийн баталгааг сайжруулах, цалин хөлсийг нэмэгдүүлэх, мэргэжлийн хөгжлийг дэмжих бодлогыг тууштай хэрэгжүүлэх нь боловсролын салбарын үнэлэмжийг дээшлүүлэхэд чухал ач холбогдолтой юм.
                  </p>
                  <div className="mt-8 text-[10px] flex justify-end">
                    <div className="bg-black rounded px-2 py-1 flex items-center gap-1 text-white">
                      <span className="font-semibold">Мэдлэг санхүүжүүлэгч</span>
                      <a href="https://m-bank.mn/" target="_blank" rel="noopener noreferrer">
                        <img src="https://storage.googleapis.com/voyager-public/sponsor-assets/m-bank-logo.svg" alt="Sponsor" className="h-5" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* Related questions */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Select related question"
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl text-xs font-medium text-blue-900 cursor-pointer shadow"
                >
                  <span className="flex items-center justify-center bg-black rounded w-4 min-w-[16px] h-4">
                   <ArrowRight style={{color: 'white'}}/>    </span>
                  Багш нарын тэтгэмжийн асуудал нь Монголын боловсролын салбарын үнэлэмжийг бууруулж буйг нотлохын оронд, эртний монголчуудын сурган хүмүүжүүлэх уламжлалтай хэрхэн харьцуулах вэ?
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Select related question"
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl text-xs font-medium text-blue-900 cursor-pointer shadow"
                >
                <span className="flex items-center justify-center bg-black rounded w-4 min-w-[16px] h-4">

                   <ArrowRight style={{color: 'white'}}/>    
                </span>
                  Багш нарын тэтгэмжийн асуудал нь зөвхөн боловсролын салбарын асуудал биш, харин Монголын эдийн засгийн бүтцийн өөрчлөлт, нийгмийн үнэлэмжийн өөрчлөлттэй хэрхэн холбогдож байна вэ?
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Select related question"
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl text-xs font-medium text-blue-900 cursor-pointer shadow"
                >
                  <span className="flex items-center justify-center bg-black rounded w-4 min-w-[16px] h-4">
                   <ArrowRight style={{color: 'white'}}/>    
                  </span>
                  Багш нарын тэтгэмжийн асуудлыг шийдвэрлэхэд орон нутгийн засаг захиргаа, иргэдийн оролцоо, хамтын ажиллагаа хэрхэн нөлөөлж болох вэ? Энэ нь Монголын бусад салбарын асуудал шийдвэрлэхэд хэрхэн үлгэр жишээ үзүүлж болох вэ?
                </div>
              </div>
              {/* Input bar */}
              <div className="flex bg-white rounded-2xl shadow border border-gray-200 flex-row items-center px-3 py-2 gap-2 mt-2">
                <textarea rows={1} placeholder="Асуултаа бичнэ үү..." className="flex-1 text-[14px] outline-none border-none resize-none bg-transparent" />
                <button className="refresh-btn bg-gray-100 text-black font-medium text-[14px] p-2 rounded-full hover:bg-gray-200 transition flex items-center justify-center">
                  <RefreshCcw/></button>
                <button style={{background: form.brand_color ,color: form.text_color}} className=" font-medium text-[14px] p-2 rounded-full flex items-center justify-center hover:bg-yellow-400 transition">
                <ArrowRight/></button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full pt-10 text-center py-10">
                <div className="font-bold text-2xl text-gray-900 mb-1 tracking-tight">
                  {form.bot_name || form.name}
                </div>
                <div className="font-light text-base text-gray-800 mb-4">
                  {form.bot_description || "Таны уншиж буй мэдээллийг илүү дэлгэрэнгүй ойлголт өгөхөд чиглэсэн хиймэл оюунт туслах."}
                </div>
              
              </div>
              <div className="w-full font-bold text-base text-gray-900 text-left mb-2 pl-2">Холбоотой</div>
              <div className="flex flex-col gap-3 w-full px-1">
                {related.map((q, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center border-b border-gray-200 py-3 text-xs text-gray-800 font-medium gap-2 hover:bg-yellow-50 transition rounded"
                  >
                    <span className="flex items-center justify-center bg-black rounded w-4 h-4 mr-2">
                    <ArrowRight style={{color: 'white'}}/>   </span>
                    <span className="flex-1 text-left">{q}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
            <div className="flex items-center justify-center text-xs py-3 text-gray-400 ">
              Powered by{" "}
              <a
                href="https://voyager.mn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 pl-1 font-medium text-gray-700"
              >
                <img
                  src="https://storage.googleapis.com/voyager-public/voyager-logo.svg"
                  alt="Voyager AI logo"
                  className="w-4 h-4 object-contain rounded bg-black"
                />
                Voyager AI
              </a>
              </div>
    
  
      </div>
    </div>
  );
}

const Creditbar = ({ brand_color }: { brand_color: string }) => (
  <div className="flex items-center justify-between rounded-2xl h-[62px] px-6 bg-[#111] gap-4">
    <div className="flex flex-col flex-1 gap-1 max-w-[150px]">
      <div className="flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs">Паблик<br />кредит:</span>
          <span className="font-bold text-lg">{credit}</span>
        </div>
        <InfoIcon className="w-5 h-5" />
      </div>
      <div className="relative w-full max-w-[150px]">
        <div className="h-[3px] bg-gray-200 rounded w-full overflow-hidden">
          <div className="h-full bg-red-500 transition-all" style={{ width: "20.33%" }} />
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="text-white text-xs text-right">
        Мэдлэг<br />санхүүжүүлэгч
      </div>
      <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className="h-[30px]">
        <img src={sponsorLogo} alt="Sponsor Logo" className="h-full max-w-full object-contain" />
      </a>
    </div>
  </div>
);