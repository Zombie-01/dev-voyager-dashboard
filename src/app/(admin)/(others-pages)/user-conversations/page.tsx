'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function ConversationsTable() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const perPage = 10;

  const fetchConversations = async (pageNum: number) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/user/conversations?per_page=${perPage}&include_total=true&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setConversations(
        data.sessions.map((session: any) => ({
          id: session.session_id,
          user: {
            name: session.preview_messages[0]?.user_id || "Тодорхойгүй",
            email: "N/A",
          },
          last_message:
            session.preview_messages[session.preview_messages.length - 1]?.content || "Мессеж алга",
          updated_at: session.end_timestamp,
        })) || []
      );
      setTotalPages(Math.ceil(data.total_sessions_est / perPage) || 1);
    } catch (err) {
      console.error("Харилцан яриа татахад алдаа гарлаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(page);
  }, [page]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Хэрэглэгчийн Харилцан Яриа" />

      <div className="space-y-6">
        <ComponentCard title="Хэрэглэгчийн Харилцан Яриа">
        

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">   {loading ? 
              <div className="flex justify-center items-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          : 
                <Table>
                  <TableHeader>
                    <TableRow className="dark:text-white">
                      <TableCell isHeader>Нэр</TableCell>
                      <TableCell isHeader>Имэйл</TableCell>
                      <TableCell isHeader>Сүүлчийн мессеж</TableCell>
                      <TableCell isHeader>Шинэчилсэн огноо</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {conversations.length === 0 && !loading && (
                      <TableRow className="">
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-gray-500 dark:text-gray-400"
                        >
                          Харилцан яриа олдсонгүй.
                        </TableCell>
                      </TableRow>
                    )}

                    {conversations.map((conv) => (
                      <TableRow key={conv.id} className=" dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5">
                        <TableCell className="px-5 py-4 text-start">{conv.user.name}</TableCell>
                        <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                          {conv.user.email}
                        </TableCell>
                        <TableCell
                          onClick={() => setSelectedMessage(conv.last_message)}
                          className="cursor-pointer px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-200 max-w-xs truncate"
                        >
                          {conv.last_message}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                          {conv.updated_at
                            ? new Date(conv.updated_at).toLocaleString("mn-MN")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            }
              </div>
            </div>
          </div>

          {/* Хуудаслалт */}
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </ComponentCard>
      </div>

      {/* Modal - Tailwind only */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl max-h-[70vh] overflow-y-auto w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Мессеж дэлгэрэнгүй</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{selectedMessage}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
