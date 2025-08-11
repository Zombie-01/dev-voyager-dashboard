'use client';

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Markdown from "@/components/common/Markdown";

type Article = {
  id: string;
  url: string;
  title: string | null;
  body: string | null;
  author: string | null;
  scraped_at?: string | null;
  suggested_questions?: string[];
};

type ApiResponse = {
  media_articles: Article[];
  pagination?: { total: number; page: number; per_page: number; pages: number };
};

const PER_PAGE_DEFAULT = 10;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [debTitle, setDebTitle] = useState("");
  const [debBody, setDebBody] = useState("");
  const [debAuthor, setDebAuthor] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE_DEFAULT);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setLoader] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [active, setActive] = useState<Article | null>(null);

  // Debounce filters
  useEffect(() => {
    const t1 = setTimeout(() => setDebTitle(title), 400);
    const t2 = setTimeout(() => setDebBody(body), 400);
    const t3 = setTimeout(() => setDebAuthor(author), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [title, body, author]);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("en-CA", { timeZone: "Asia/Ulaanbaatar" });
    } catch {
      return iso;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const token = await getAccessToken();
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/media-admin/media/articles`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("per_page", String(perPage));
        if (debTitle) url.searchParams.set("title", debTitle);
        if (debBody) url.searchParams.set("body", debBody);
        if (debAuthor) url.searchParams.set("author", debAuthor);
        const res = await fetch(url.toString(), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Нийтлэлийг татахад алдаа гарлаа.");
        const json: ApiResponse = await res.json();
        setArticles(json.media_articles || []);
        setTotalPages(json.pagination?.pages || 1);
      } catch (err: any) {
        toast.error(err?.message || "Алдаа гарлаа");
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [debTitle, debBody, debAuthor, page, perPage]);

  useEffect(() => {
    if (!openId) {
      setActive(null);
      return;
    }
    const art = articles.find((a) => a.id === openId) || null;
    setActive(art);
  }, [openId, articles]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Нийтлэлүүд" />

      <div className="space-y-6">
        <ComponentCard title="Нийтлэлийн жагсаалт">
          {/* Filters + Per page */}
          <div className="mb-4 flex flex-wrap gap-3 items-end">
            <div className="max-w-xs w-full sm:w-64">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Гарчиг</label>
              <input
                type="text"
                placeholder="title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div className="max-w-xs w-full sm:w-64">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Бие</label>
              <input
                type="text"
                placeholder="body..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div className="max-w-xs w-full sm:w-64">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Зохиогч</label>
              <input
                type="text"
                placeholder="author..."
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div className="ml-auto">
              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Хуудаслалт</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} мөр
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loader or Table */}
          {loader ? (
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:text-white">
                          <TableCell isHeader>Гарчиг</TableCell>
                          <TableCell isHeader>Зохиогч</TableCell>
                          <TableCell isHeader>URL</TableCell>
                          <TableCell isHeader>Scraped</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/10">
                        {articles.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                              Нийтлэл олдсонгүй.
                            </TableCell>
                          </TableRow>
                        )}
                        {articles.map((a) => (
                          <TableRow key={a.id} className="dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10">
                            <TableCell className="px-5 py-4 text-start">
                              <div className="font-medium">{a.title || '-'}</div>
                              {a.body && (
                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 max-h-24 overflow-hidden">
                                  <Markdown content={(a.body || '').slice(0, 600)} />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                              {a.author || '-'}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-blue-600 underline dark:text-blue-400">
                              <a href={a.url} target="_blank" rel="noopener noreferrer">
                                {a.url}
                              </a>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(a.scraped_at)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <button
                                onClick={() => setOpenId(a.id)}
                                className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                              >
                                Дэлгэрэнгүй
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </ComponentCard>
      </div>

      {/* Detail Modal */}
      <DetailModal open={!!openId} onClose={() => setOpenId(null)} article={active} />
    </div>
  );
}

type DetailProps = { open: boolean; onClose: () => void; article: Article | null };
import { Modal } from "@/components/ui/modal";

function DetailModal({ open, onClose, article }: DetailProps) {
  if (!open || !article) return null;
  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-5xl w-[90vw]">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{article.title || 'Untitled'}</h2>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {article.author ? <>Зохиогч: <b>{article.author}</b> • </> : null}
              <a className="text-blue-600 underline dark:text-blue-400" href={article.url} target="_blank" rel="noopener noreferrer">Эх сурвалж</a>
              {article.scraped_at && <> • {new Date(article.scraped_at).toLocaleString('en-CA', { timeZone: 'Asia/Ulaanbaatar' })}</>}
            </div>
          </div>
        </div>

        <div className="mt-5 max-h-[60vh] overflow-y-auto pr-1">
          {article.body ? (
            <Markdown content={article.body} />
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm">Агуулга байхгүй байна.</div>
          )}
        </div>

        {article.suggested_questions && article.suggested_questions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Санал болгож буй асуултууд</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
              {article.suggested_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm dark:bg-white/10 dark:text-white">Хаах</button>
        </div>
      </div>
    </Modal>
  );
}
