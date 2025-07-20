'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import Alert from "@/components/ui/alert/Alert";
import Skeleton from "../../(ui-elements)/loader/skeleton";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

export default function ConversationsTreeView() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: any[] }>({});
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalSessions, setTotalSessions] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [userIdFilter, setUserIdFilter] = useState<string>("");

  const perPage = 1;
  const innerHitSize = 1;

  const fetchSessionList = async (initial = false) => {
    try {
      setLoadingConversations(true);
      const token = await getAccessToken();
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/user/conversations`);
      url.searchParams.set("per_page", perPage.toString());
      url.searchParams.set("inner_hit_size", innerHitSize.toString());
      if (!cursor && initial) url.searchParams.set("include_total", "true");
      if (cursor) url.searchParams.set("cursor", cursor);
      if (userIdFilter) url.searchParams.set("end_user_id", userIdFilter);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        const sorted = data.sessions.sort((a: any, b: any) => {
          const dateA = new Date(a.end_timestamp).getTime();
          const dateB = new Date(b.end_timestamp).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setConversations((prev) => [...(initial ? [] : prev), ...sorted]);
        if (initial && data.total_sessions_est) setTotalSessions(data.total_sessions_est);
        setHasMore(data.has_more);
        setCursor(data.next_cursor);
      } else {
        throw new Error(data.detail || "Алдаа гарлаа.");
      }
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Харилцан яриа татахад алдаа гарлаа",
        message: err.message || "Серверээс өгөгдөл авч чадсангүй.",
      });
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchSessionDetail = async (sessionId: string, msgCursor?: string) => {
    try {
      setLoadingMessages(sessionId);
      const token = await getAccessToken();
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/user/conversations`);
      url.searchParams.set("session_id", sessionId);
      url.searchParams.set("per_page", "50");
      if (msgCursor) url.searchParams.set("msg_cursor", msgCursor);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setExpandedMessages((prev) => ({
          ...prev,
          [sessionId]: [...(prev[sessionId] || []), ...data.messages],
        }));
      } else {
        throw new Error(data.detail || "Мессежүүд татаж чадсангүй.");
      }
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Мессеж татахад алдаа гарлаа",
        message: err.message || "Сервертэй холбогдож чадсангүй.",
      });
    } finally {
      setLoadingMessages(null);
    }
  };

  const toggleExpand = (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
      if (!expandedMessages[sessionId]) {
        fetchSessionDetail(sessionId);
      }
    }
  };

  useEffect(() => {
    fetchSessionList(true);
  }, [sortOrder, userIdFilter]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Хэрэглэгчийн Харилцан Яриа" />

      <div className="space-y-6">
        {alert && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            showLink={alert.showLink}
            linkHref={alert.linkHref}
            linkText={alert.linkText}
          />
        )}

        <ComponentCard title="Харилцан ярианы жагсаалт">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 dark:text-white">
            <div>
              <label className="text-sm mr-2">Хэрэглэгчийн ID:</label>
              <input
                type="text"
                className="border px-2 py-1 rounded text-sm"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                placeholder="user_id..."
              />
            </div>
            <div>
              <label className="text-sm mr-2">Огноо:</label>
              <select
                className="border px-2 py-1 rounded text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              >
                <option value="desc">Шинэ эхэлсэн</option>
                <option value="asc">Хуучин эхэлсэн</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden border rounded-xl border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[700px]">
                {loadingConversations ? (
                  <div className="space-y-2 p-6">
                    {Array.from({ length: perPage }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:text-white">
                        <TableCell isHeader>Session ID</TableCell>
                        <TableCell isHeader>Хэрэглэгч</TableCell>
                        <TableCell isHeader>Сүүлчийн мессеж</TableCell>
                        <TableCell isHeader>Шинэчилсэн огноо</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conversations.map((session) => {
                        const sessionId = session.session_id;
                        const preview = session.preview_messages || [];
                        const lastMessage = preview[preview.length - 1]?.content || "-";
                        const isExpanded = expandedSessionId === sessionId;
                        const messages = expandedMessages[sessionId] || [];
                        return (
                          <>
                            <TableRow
                              key={sessionId}
                              onClick={() => toggleExpand(sessionId)}
                              className="cursor-pointer dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                              <TableCell className="px-5 py-4">{sessionId}</TableCell>
                              <TableCell className="px-5 py-4">{preview[0]?.user_id || "-"}</TableCell>
                              <TableCell className="px-5 py-4 truncate max-w-xs">{lastMessage}</TableCell>
                              <TableCell className="px-5 py-4">{new Date(session.end_timestamp).toLocaleString("mn-MN")}</TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow key={`${sessionId}-expanded`}>
                                <TableCell colSpan={4} className="px-5 py-4 bg-gray-50 dark:bg-white/[0.02]">
                                  {loadingMessages === sessionId ? (
                                    <div className="space-y-2">
                                      {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full" />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="max-h-96 overflow-y-auto space-y-2 px-2">
                                      {messages.map((msg, index) => {
                                        const isUser = msg.role === "user";
                                        return (
                                          <div
                                            key={index}
                                            className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                                          >
                                            <div
                                              className={`max-w-[70%] p-3 rounded-xl border text-sm whitespace-pre-wrap
                                                ${isUser
                                                  ? "bg-gray-100 dark:bg-gray-700 text-left text-gray-800 dark:text-white"
                                                  : "bg-blue-100  text-white dark:bg-blue-600 text-right"
                                                }`}
                                            >
                                      <div className="text-xs opacity-70 mb-1">
                                        {msg.timestamp} • {msg.role}
                                      </div>
                                      <div>{msg.content}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => fetchSessionList()}
              >
                Дараагийн хуудас
              </button>
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}