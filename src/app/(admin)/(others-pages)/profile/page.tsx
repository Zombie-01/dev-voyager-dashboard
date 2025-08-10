"use client";

import React, { useEffect, useState } from "react";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { toast } from "sonner";


export default function Profile() {
  const { user } = useUser();
  const [mediaData, setMediaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/media`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Медиа файлыг татаж авж чадсангүй");

        const data = await res.json();
        setMediaData(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMedia();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
       <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Ерөнхий мэдээлэл
        </h3>
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          ) :   mediaData ? (
            <UserInfoCard mediaData={mediaData} />
          ) : (
            <div className="py-12 text-center text-gray-500">Мэдээлэл олдсонгүй.</div>
          )}
        </div>
      </div>
    </div>
  );
}   
