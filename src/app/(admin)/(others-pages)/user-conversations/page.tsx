'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function ConversationsTable() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
// Map the 'sessions' data to fit your 'conversations' state structure
      setConversations(data.sessions.map((session: any) => ({
        id: session.session_id,
        user: {
          name: session.preview_messages[0]?.user_id || "Unknown User", // Assuming first message user_id as user identifier
          email: "N/A" // Email is not directly available in the provided JSON for the user object at session level
        },
        last_message: session.preview_messages[session.preview_messages.length - 1]?.content || "No messages",
        updated_at: session.end_timestamp,
      })) || []);

      setTotalPages(Math.ceil(data.total_sessions_est / perPage) || 1)
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(page);
  }, [page]);

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div>
      <PageBreadcrumb pageTitle="User Conversations" />

      <div className="space-y-6">
        <ComponentCard title="User Conversations">
          {loading && <p className="mb-4 text-center text-gray-500">Loading...</p>}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell isHeader>User Name</TableCell>
                      <TableCell isHeader>Email</TableCell>
                      <TableCell isHeader>Last Message</TableCell>
                      <TableCell isHeader>Last Updated</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {conversations.length === 0 && !loading && (
                      <TableRow>
                        <TableCell className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No conversations found.
                        </TableCell>
                      </TableRow>
                    )}

                    {conversations.map((conv) => (
                      <TableRow key={conv.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {conv.user?.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {conv.user?.email || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400 truncate max-w-xs">
                          {conv.last_message || "No messages"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                          {conv.updated_at
                            ? new Date(conv.updated_at).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-between space-x-2">
            <button
              onClick={goPrev}
              disabled={page === 1 || loading}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={goNext}
              disabled={page === totalPages || loading}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
