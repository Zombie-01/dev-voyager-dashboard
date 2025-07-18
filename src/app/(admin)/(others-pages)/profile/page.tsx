"use client";

import React, { useEffect, useState } from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { Metadata } from "next";


export default function Profile() {
  const { user } = useUser();
  const [mediaData, setMediaData] = useState<any>(null);

  useEffect(() => {
    const fetchMedia = async () => {
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

        if (!res.ok) throw new Error("Failed to fetch media");

        const data = await res.json();
        setMediaData(data);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    if (user) {
      fetchMedia();
    }
  }, [user]);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {mediaData && <UserInfoCard mediaData={mediaData} />} 

        
        </div>
      </div>
    </div>
  );
}
