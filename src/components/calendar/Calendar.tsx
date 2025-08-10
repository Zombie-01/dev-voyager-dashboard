"use client";
import React, { useState, useEffect } from "react";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { startOfWeek, endOfWeek, format, getISOWeek, getYear } from 'date-fns';
import { Modal } from "@/components/ui/modal";

interface Sponsor {
  id: string;
  name: string;
  display_name: string;
  logo_url: string;
}

interface Batch {
  id: string;
  sponsor: Sponsor;
}

interface Week {
  week: number;
  start_date: string;
  end_date: string;
  batches: Batch[];
}

const getWeekDetails = (weekNumber: number, year: number) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstWeekOffset = (8 - firstDayOfYear.getDay()) % 7;
  const date = new Date(year, 0, 1 + (weekNumber - 1) * 7 + firstWeekOffset);
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });
  return {
    startDate: format(startDate, "yyyy/MM/dd"),
    endDate: format(endDate, "yyyy/MM/dd"),
  };
};

const Calendar: React.FC = () => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [showPastWeeks, setShowPastWeeks] = useState(false);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedWeekStats, setSelectedWeekStats] = useState<Week | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedWeekForBooking, setSelectedWeekForBooking] = useState<Week | null>(null);
  const [availableSponsors, setAvailableSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<string>("");
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);
  const [mediaId, setMediaId] = useState<string>("");
  const [bannerGotoUrl, setBannerGotoUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerGotoUrlError, setBannerGotoUrlError] = useState("");
  const [bannerImageUrlError, setBannerImageUrlError] = useState("");
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [isFetchingSponsors, setIsFetchingSponsors] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [batchToCancel, setBatchToCancel] = useState<Batch | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useUser();
  const currentWeek = getISOWeek(new Date());
  const currentYear = getYear(new Date());

  const fetchCalendarData = async () => {
    setIsCalendarLoading(true);
    try {
      const token = await getAccessToken();
      const calendarRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsor/calendar?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const calendarData = await calendarRes.json();
      
      const allWeeks = Array.from({ length: 52 }, (_, i) => i + 1);
      const apiWeeks = calendarData.weeks || [];
      
      const mergedWeeks = allWeeks.map(weekNumber => {
        const foundWeek = apiWeeks.find((w: Week) => w.week === weekNumber);
        const { startDate, endDate } = getWeekDetails(weekNumber, selectedYear);
        if (foundWeek) {
          return {
            ...foundWeek,
            start_date: startDate,
            end_date: endDate,
          };
        }
        return {
          week: weekNumber,
          start_date: startDate,
          end_date: endDate,
          batches: []
        };
      });

      setWeeks(mergedWeeks);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await getAccessToken();
        // Fetch Media ID
        const mediaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/media`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const mediaData = await mediaRes.json();
        if (mediaData && mediaData.length > 0) {
          setMediaId(mediaData[0].id);
        }

        fetchCalendarData();
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    if (user) fetchInitialData();
  }, [user, selectedYear]);

  const handleSeeStats = (week: Week) => {
    setSelectedWeekStats(week);
    setIsStatsModalOpen(true);
  };

  const handleBookSponsorClick = async (week: Week) => {
    setSelectedWeekForBooking(week);
    setIsConfirmingBooking(false);
    setBannerGotoUrl("");
    setBannerImageUrl("");
    setBannerGotoUrlError("");
    setBannerImageUrlError("");
    setIsFetchingSponsors(true);
    setIsBookingModalOpen(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsors?page=1&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setAvailableSponsors(data.sponsors || []);
      if (data.sponsors?.length > 0) {
        setSelectedSponsor(data.sponsors[0].id);
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    } finally {
      setIsFetchingSponsors(false);
    }
  };

  const handleBookingSubmit = async () => {
    setIsBookingInProgress(true);
    try {
      const token = await getAccessToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsor/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sponsor_id: selectedSponsor,
          media_id: mediaId,
          banner_goto_url: bannerGotoUrl,
          banner_image_url: bannerImageUrl,
          year: selectedYear,
          week_of_year: selectedWeekForBooking?.week,
        }),
      });
      setIsBookingModalOpen(false);
      setIsConfirmingBooking(false);
      await fetchCalendarData(); // Refresh calendar data
    } catch (error) {
      console.error("Error booking sponsor:", error);
    } finally {
      setIsBookingInProgress(false);
    }
  };

  const handleBannerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBannerGotoUrl(url);
    if (url && !url.startsWith("https://")) {
      setBannerGotoUrlError("URL must start with https://");
    } else {
      setBannerGotoUrlError("");
    }
  };

  const handleContinueBooking = () => {
    let hasError = false;
    if (!bannerGotoUrl) {
      setBannerGotoUrlError("Баннераас шилжих линк оруулна уу.");
      hasError = true;
    }
    if (!bannerImageUrl) {
      setBannerImageUrlError("Баннер зураг оруулна уу.");
      hasError = true;
    }
    if (bannerGotoUrl && !bannerGotoUrl.startsWith("https://")) {
      setBannerGotoUrlError("URL must start with https://");
      hasError = true;
    }
    if (!hasError) {
      setIsConfirmingBooking(true);
    }
  };

  const handleCancelBookingClick = (batch: Batch) => {
    setBatchToCancel(batch);
    setIsCancelModalOpen(true);
  };

  const handleCancelBookingSubmit = async () => {
    if (!batchToCancel) return;
    setIsCancelling(true);
    try {
      const token = await getAccessToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/sponsor/batch/${batchToCancel.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsCancelModalOpen(false);
      setBatchToCancel(null);
      await fetchCalendarData();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredWeeks = showPastWeeks ? weeks : weeks.filter(week => selectedYear > currentYear || (selectedYear === currentYear && week.week >= currentWeek));

  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center gap-4">
        <button 
          onClick={() => setShowPastWeeks(!showPastWeeks)}
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold"
        >
          {showPastWeeks ? "Өмнөхүүдийг нуух" : "Өмнөхүүдийг харах"}
        </button>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      {isCalendarLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWeeks.map((week) => {
            const isCurrentWeek = selectedYear === currentYear && week.week === currentWeek;
            const isPastWeek = selectedYear < currentYear || (selectedYear === currentYear && week.week < currentWeek);
            const isFutureWeek = selectedYear > currentYear || (selectedYear === currentYear && week.week > currentWeek);

            return (
              <div 
                key={week.week} 
                className={`border rounded-lg p-4 relative flex flex-col justify-between ${
                  isCurrentWeek 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' 
                    : isPastWeek 
                    ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                <div>
                  {isCurrentWeek && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">Current Week</span>
                  )}
                  <h3 className={`font-bold text-lg mb-2 ${isCurrentWeek ? 'text-blue-600 dark:text-blue-300' : ''}`}>{week.week}-р долоо хоног</h3>
                  <p className="text-sm mb-2">{week.start_date} - {week.end_date}</p>
                  {week.batches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {week.batches.map((batch) => (
                        <div key={batch.sponsor.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                          <img src={batch.sponsor.logo_url} alt={batch.sponsor.name} className="w-6 h-6 rounded-full" />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{batch.sponsor.display_name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Спонсор байхгүй</p>
                  )}
                </div>
                <div className="mt-4">
                  {(isPastWeek || isCurrentWeek) && week.batches.length > 0 && (
                    <button onClick={() => handleSeeStats(week)} className="w-full px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold">Дэлгэрэнгүй</button>
                  )}
                  {isFutureWeek && week.batches.length === 0 && (
                    <button onClick={() => handleBookSponsorClick(week)} className="w-full px-4 py-2 rounded-md bg-green-500 text-white font-semibold">Спонсор бүүклэх</button>
                  )}
                  {isFutureWeek && week.batches.length > 0 && (
                    <button onClick={() => handleCancelBookingClick(week.batches[0])} className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold">Захиалга цуцлах</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedWeekStats && (
        <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} className="max-w-[700px] p-6 lg:p-10">
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90 text-xl">
              Statistics for Week {selectedWeekStats.week}
            </h5>
            {selectedWeekStats.batches.map(batch => (
              <div key={batch.sponsor.id} className="mb-4">
                <h6 className="font-semibold text-lg mb-2">{batch.sponsor.display_name}</h6>
                {/* Placeholder for stats */}
                <p>Impressions: 12,345</p>
                <p>Clicks: 678</p>
                <p>CTR: 5.5%</p>
              </div>
            ))}
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setIsStatsModalOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {selectedWeekForBooking && (
        <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} className="max-w-[700px] p-6 lg:p-10">
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90 text-xl">
              {selectedYear} оны {selectedWeekForBooking.week} дахь долоо хоногийн спонсор бүүклэх
            </h5>
            <p className="text-sm mb-2">{selectedWeekForBooking.start_date} - {selectedWeekForBooking.end_date}</p>
            {isFetchingSponsors ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !isConfirmingBooking ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="sponsor-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Спонсор сонгох</label>
                  <select 
                    id="sponsor-select"
                    value={selectedSponsor}
                    onChange={(e) => setSelectedSponsor(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  >
                    {availableSponsors.map(sponsor => (
                      <option key={sponsor.id} value={sponsor.id}>{sponsor.display_name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="banner-goto-url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Баннераас шилжих линк</label>
                  <input 
                    id="banner-goto-url"
                    type="text"
                    value={bannerGotoUrl}
                    onChange={handleBannerUrlChange}
                    className={`w-full px-4 py-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${bannerGotoUrlError ? 'border-red-500' : ''}`}
                    placeholder="https://example.com"
                  />
                  {bannerGotoUrlError && <p className="text-red-500 text-xs mt-1">{bannerGotoUrlError}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="banner-image-url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Баннер зураг оруулах</label>
                  <input 
                    id="banner-image-url"
                    type="text"
                    value={bannerImageUrl}
                    onChange={(e) => {
                      setBannerImageUrl(e.target.value);
                      if (e.target.value) {
                        setBannerImageUrlError("");
                      }
                    }}
                    className={`w-full px-4 py-2 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 ${bannerImageUrlError ? 'border-red-500' : ''}`}
                    placeholder="https://example.com/image.png"
                  />
                  {bannerImageUrlError && <p className="text-red-500 text-xs mt-1">{bannerImageUrlError}</p>}
                  <p className="text-xs text-gray-500 mt-1">Note: Direct file upload is not supported. Please provide a URL to the banner image.</p>
                </div>
                <div className="flex gap-2 mt-6 justify-end">
                  <button onClick={() => setIsBookingModalOpen(false)} className="btn-secondary">
                    Болих
                  </button>
                  <button onClick={handleContinueBooking} className="btn-primary">
                    Үргэлжлүүлэх
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p><strong>{availableSponsors.find(s => s.id === selectedSponsor)?.display_name}</strong>-ыг {selectedWeekForBooking.week} дахь долоо хоногийн спонсороор бүүклэхдээ итгэлтэй байна уу?</p>
                <div className="flex gap-2 mt-6 justify-end">
                  <button onClick={() => setIsConfirmingBooking(false)} className="btn-secondary" disabled={isBookingInProgress}>
                    Болих
                  </button>
                  <button onClick={handleBookingSubmit} className="btn-primary bg-green-500" disabled={isBookingInProgress}>
                    {isBookingInProgress && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    Тийм
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {batchToCancel && (
        <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} className="max-w-[500px] p-6 lg:p-10">
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90 text-xl">
              Спонсор захиалга цуцлах
            </h5>
            <p><strong>{batchToCancel.sponsor.display_name}-ын спонсор захиалгыг цуцлахдаа итгэлтэй байна уу</strong>?</p>
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setIsCancelModalOpen(false)} className="btn-secondary" disabled={isCancelling}>
                Болих
              </button>
              <button onClick={handleCancelBookingSubmit} className="btn-primary bg-red-500" disabled={isCancelling}>
                {isCancelling && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                Тийм
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Calendar;