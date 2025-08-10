"use client";

import React, { useState } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { InfoIcon, X, ArrowRight } from "lucide-react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import MediaConfig from "./media";
import PoliticalConfig from "./config";

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

  const [withUser, setWithUser] = useState<"default" | "chat" | "article">("default");
   const [media, setMedia] = useState<"default" | "orientation" >("default");

  const related = [
    "Багш нарын тэтгэмжийн асуудал нь Монголын боловсролын салбарын үнэ цэнэ, нийгэмд үзүүлэх нөлөөний илэрхийлэл байж болох уу? Эсвэл энэ нь боловсролын салбарын үнэлэмжийн бууралтыг харуулж байна уу?",
    "Төсвийн шилжүүлгийн энэхүү шийдвэр нь Монголын улстөрийн соёл, ёс зүйн хандлагыг хэрхэн илэрхийлж байна вэ? Энэ нь иргэдийн улс төрийн итгэлцэлд хэрхэн нөлөөлж болох вэ?",
    "Багш нарын тэтгэмжийг хасах нь ирээдүйн боловсролын салбарт хэрхэн нөлөөлөх вэ? Энэ нь багш нарын урам зориг, ажлын чанарт хэрхэн тусах бол?",
  ];


  return (
    <div className=" flex flex-col items-stretch gap-4">

    <div className="w-full flex justify-between">    <div className="flex gap-2 justify-start mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${media === "default" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setMedia("default")}
            type="button"
          >
            Үндсэн тохиргоо
          </button>
           <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${media === "orientation" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setMedia("orientation")}
            type="button"
          >
            Агууллаггийн тохиргоо
          </button>

      </div>
      {/* Left: Form */}
        <div className="flex gap-2 justify-end mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${withUser === "chat" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setWithUser("chat")}
            type="button"
          >
            Чат хэсэг
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${withUser === "default" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setWithUser("default")}
            type="button"
          >
            Үндсэн нүүр
          </button>
           <button
            className={`px-3 py-1 rounded-full text-sm font-medium border ${withUser === "article" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => setWithUser("article")}
            type="button"
          >
            Үндсэн нүүр (нийтлэлтэй)
          </button>
       
        </div>
      </div>
     <div className="w-full flex gap-40 justify-between ">
     {media === "orientation" ?<PoliticalConfig initialForm={{}}/> :<MediaConfig setForm={setForm} form={form} mediaData={mediaData}/> }
      {/* Right: Preview */}
      <div
        className="relative bottom-4 right-4 z-50 w-[95vw] max-w-[650px] h-[95vh] max-h-[800px] flex flex-col overflow-hidden rounded-[36px] shadow-2xl font-sans"
        style={{
          background: `linear-gradient(${form.brand_color} 60%, rgb(255,255,255) 40%)`,
        }}
      >
        {/* Top bar */}
        <div className="relative flex items-center justify-between px-4 py-2 min-h-[64px] gap-3">
          {withUser === "chat" ? (
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
          <Creditbar />
          {withUser === "chat" ? (
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
                      className="w-full relative bg-white border border-gray-900/5 rounded-[18px] flex items-center p-4 pl-[18px] gap-[14px] cursor-pointer outline-none shadow-sm shadow-black/5 transition-transform duration-200 ease-out hover:shadow-md animate-[fadeInUp_0.45s_ease-out]"
                    >
                      {/* Number circle */}
                      <span className="inline-flex items-center justify-center w-7 min-w-[28px] h-7 rounded-[10px] bg-[#111] text-white text-[12px] font-extrabold">
                        {i + 1}
                      </span>

                      {/* Text section */}
                      <span className="flex flex-1 flex-col">
                        <span className="text-slate-900 text-[13px] font-extrabold leading-[1.25] text-start">
                         {q}
                        </span>
                        <span className="text-gray-500 text-[11px] mt-1 text-start">
                          Сэдэв: Мэдээллийн хэрэглэх соёл
                        </span>
                      </span>

                      {/* Arrow button */}
                      <span
                        data-arrow="1"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#111] shadow-lg shadow-black/20 translate-x-0 transition-transform duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-right"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </span>
                    </button>
                ))}
              </div>
            </>
          )}
          <div className=" bottom-0 left-0 right-0 flex bg-white rounded-[16px] shadow-lg shadow-black/10 border border-gray-200 flex-row overflow-hidden items-center px-3 py-2.5 gap-2 m-2">
          {/* Textarea */}
          <textarea
            rows={1}
            placeholder="Асуултаа бичнэ үү..."
            className="flex-1 text-[14px] outline-none border-none resize-none"
          />

          {/* Refresh Button */}
          <button
            className="refresh-btn bg-neutral-100 text-black font-medium text-[14px] p-2.5 border-none rounded-full cursor-pointer opacity-100 relative overflow-visible flex items-center justify-center group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-ccw transform transition-transform duration-200 ease-in-out origin-center group-hover:rotate-45"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 16h5v5"></path>
            </svg>
          </button>

          {/* Send Button */}
          <button
            className="bg-[#FFE63D] text-black font-medium text-[14px] p-2.5 rounded-full cursor-pointer opacity-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
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
    </div>
  );
}

const Creditbar = () => (
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