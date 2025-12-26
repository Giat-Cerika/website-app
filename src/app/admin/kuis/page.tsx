"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, InfinityIcon, Loader2 } from "lucide-react";
import AutoTable from "@/components/ui/table";
import { useQuizStore } from "@/stores/useQuizStore";
import { toastSuccess, toastError } from "@/lib/toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function KuisPage() {
  const { quizes, isLoading, fetchQuizes, updateQuiz, deleteQuiz, pagination } =
    useQuizStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [infiniteMode, setInfiniteMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const per_page = 10;

  const editorRef = useRef<HTMLDivElement | null>(null);
  const summernoteInitialized = useRef(false);

  useEffect(() => {
    fetchQuizes({ page, per_page, search: searchInput });
  }, [page, fetchQuizes]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setPage(1);
      fetchQuizes({ page: 1, per_page, search: searchInput });
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchInput, fetchQuizes, per_page]);

  // Load Summernote when modal opens
  useEffect(() => {
    const loadSummernote = async () => {
      if (!isOpen || typeof window === "undefined") return;

      // Load jQuery
      if (!(window as any).jQuery) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Load Summernote CSS
      if (!document.querySelector('link[href*="summernote"]')) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href =
          "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css";
        document.head.appendChild(css);
      }

      // Load Summernote JS
      if (!(window as any).jQuery.fn.summernote) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const $ = (window as any).jQuery;

      if ($ && editorRef.current && !summernoteInitialized.current) {
        $(editorRef.current).summernote({
          height: 200,
          placeholder: "Tulis deskripsi kuis di sini...",
          toolbar: [
            ["style", ["bold", "italic", "underline"]],
            ["para", ["ul", "ol"]],
            ["insert", ["link"]],
            ["view", ["fullscreen", "codeview"]],
          ],
          callbacks: {
            onChange: (content: string) => {
              setDescription(content);
            },
          },
        });

        $(editorRef.current).summernote("code", description);
        summernoteInitialized.current = true;
      }
    };

    if (isOpen) {
      loadSummernote();
    }

    return () => {
      const $ = (window as any).jQuery;
      if ($ && editorRef.current && summernoteInitialized.current) {
        $(editorRef.current).summernote("destroy");
        summernoteInitialized.current = false;
      }
    };
  }, [isOpen]);

  const openEditModal = (item: any) => {
    setEditItem(item);
    setDescription(item.description || "");

    // Check if dates have time or are set to 00:00:00
    const startDate = new Date(item.start_date);
    const endDate = new Date(item.end_date);
    const hasTime = startDate.getHours() !== 0 || startDate.getMinutes() !== 0 ||
      endDate.getHours() !== 0 || endDate.getMinutes() !== 0;

    setInfiniteMode(!hasTime);
    setIsOpen(true);
    setIsAnimating(true);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setEditItem(null);
      setDescription("");
      setInfiniteMode(false);
    }, 200);
  };

  const handleView = (item: any) => {
    router.push(`/admin/kuis/${item.id}`);
  };

  const formatDateTime = (dateStr: string, timeStr: string = "") => {
    if (infiniteMode) {
      return `${dateStr}T00:00:00Z`;
    } else {
      // Combine date and time
      return new Date(dateStr + "T" + timeStr).toISOString();
    }
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    if (!editItem.title || !editItem.code || !description) {
      toastError("Semua field wajib diisi");
      return;
    }

    const result = await Swal.fire({
      title: "Simpan perubahan?",
      text: "Apakah Anda yakin ingin menyimpan perubahan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    });

    setIsUpdating(true);

    if (result.isConfirmed) {
      try {
        const payload = {
          code: editItem.code,
          title: editItem.title,
          description: description,
          start_date: formatDateTime(editItem.start_date_only, editItem.start_time_only),
          end_date: formatDateTime(editItem.end_date_only, editItem.end_time_only),
        };

        await updateQuiz(editItem.id, payload);
        toastSuccess("Data kuis berhasil diperbarui");
        fetchQuizes({ page, per_page, search: searchInput });
        closeModal();
      } catch (error: any) {
        toastError(error.message || "Gagal memperbarui data kuis");
      }
    }
  };

  const handleDelete = async (item: any) => {
    const result = await Swal.fire({
      title: "Hapus kuis?",
      text: `Yakin menghapus kuis ${item.title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteQuiz(item.id);
        toastSuccess("Data kuis berhasil dihapus");

        if (quizes.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchQuizes({ page, per_page, search: searchInput });
        }
      } catch (error: any) {
        toastError(error.message || "Gagal menghapus kuis");
      }
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Open";
      case 2:
        return "Close";
      default:
        return "Unknown";
    }
  };

  const fields = [
    { key: "title", label: "Judul Kuis" },
    { key: "quiz_type", label: "Tipe" },
    { key: "status", label: "Status" }
  ];

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const currentPage = pagination.current_page;
    const totalPages = pagination.total_pages;
    const pages = [];

    const maxVisible = 10;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxVisible);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
            title="Halaman sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                disabled={isLoading}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium disabled:opacity-40"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="hidden sm:inline px-2 text-gray-400">...</span>
              )}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg border transition-all text-sm font-medium min-w-[40px] ${p === currentPage
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
                } disabled:opacity-40`}
            >
              {p}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="hidden sm:inline px-2 text-gray-400">...</span>
              )}
              <button
                onClick={() => setPage(totalPages)}
                disabled={isLoading}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium disabled:opacity-40"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
            title="Halaman selanjutnya"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-sm text-gray-600 order-3 hidden sm:block">
          Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
          <span className="font-semibold">{totalPages}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .loading-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .note-editor {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
      `}</style>

      <div className="flex items-center justify-between mb-6 animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-800">Data Kuis</h1>
        <a
          href="/admin/kuis/create"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition shadow hover:shadow-lg active:scale-95 duration-300 font-medium"
        >
          <Plus className="w-5 h-5" /> Tambah Kuis
        </a>
      </div>

      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama kuis"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-26 text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
          />
        </div>
        {searchInput && (
          <div className="mt-2 text-sm text-gray-600">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="loading-pulse">Mencari...</span>
              </span>
            ) : (
              <span></span>
            )}
          </div>
        )}
      </div>

      <div className="animate-fadeIn">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : quizes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchInput ? "Tidak ada hasil ditemukan" : "Belum ada data kuis"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchInput
                ? `Tidak ditemukan kuis dengan kata kunci "${searchInput}"`
                : "Klik tombol Tambah Kuis untuk membuat data baru"}
            </p>
          </div>
        ) : (
          <AutoTable
            data={quizes.map((q) => ({
              ...q,
              status: getStatusText(q.status),
            }))}
            fields={fields}
            onView={handleView}
            onEdit={(item) =>
              item.status === "Open"
                ? Swal.fire({
                  title: "Info",
                  html: `<p>Kuis dengan status <strong>"${item.status}"</strong> tidak bisa diedit</p>`,
                  icon: "info",
                })
                : openEditModal(
                  {
                    ...quizes.find((q) => q.id === item.id),
                    start_date_only: new Date(quizes.find((q) => q.id === item.id)?.start_date || "").toISOString().split("T")[0],
                    start_time_only: new Date(quizes.find((q) => q.id === item.id)?.start_date || "").toTimeString().slice(0, 8),
                    end_date_only: new Date(quizes.find((q) => q.id === item.id)?.end_date || "").toISOString().split("T")[0],
                    end_time_only: new Date(quizes.find((q) => q.id === item.id)?.end_date || "").toTimeString().slice(0, 8),
                  }
                )
            }
            onDelete={(item) =>
              item.status === "Open"
                ? Swal.fire({
                  title: "Info",
                  html: `<p>Kuis dengan status <strong>"${item.status}"</strong> tidak bisa dihapus</p>`,
                  icon: "info",
                })
                : handleDelete(
                  quizes.find((q) => q.id === item.id)
                )
            }
            page={page}
            perPage={per_page}
          />

        )}
      </div>

      {renderPagination()}

      {isOpen && editItem && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-200 p-4 overflow-y-auto ${isAnimating ? "opacity-100" : "opacity-0"
            }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl my-8 transition-transform duration-200 max-h-[90vh] overflow-y-auto ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Kuis</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Kode Kuis <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={editItem.code}
                  onChange={(e) =>
                    setEditItem({ ...editItem, code: e.target.value })
                  }
                  placeholder="QZ-001"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Judul Kuis <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem({ ...editItem, title: e.target.value })
                  }
                  placeholder="Contoh: Kuis Matematika"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <div ref={editorRef}></div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  id="infiniteMode"
                  checked={infiniteMode}
                  onChange={(e) => setInfiniteMode(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="infiniteMode" className="font-medium text-gray-700 cursor-pointer">
                  <span className="flex items-center gap-2">Infinity Mode<InfinityIcon className="w-4 h-4" /></span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editItem.start_date_only}
                    onChange={(e) =>
                      setEditItem({ ...editItem, start_date_only: e.target.value })
                    }
                  />
                  {!infiniteMode && (
                    <input
                      type="time"
                      step={1}
                      className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
                      value={editItem.start_time_only}
                      onChange={(e) =>
                        setEditItem({ ...editItem, start_time_only: e.target.value })
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editItem.end_date_only}
                    onChange={(e) =>
                      setEditItem({ ...editItem, end_date_only: e.target.value })
                    }
                  />
                  {!infiniteMode && (
                    <input
                      type="time"
                      step={1}
                      className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
                      value={editItem.end_time_only}
                      onChange={(e) =>
                        setEditItem({ ...editItem, end_time_only: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all active:scale-95 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95 font-medium shadow-lg"
              >
                {isUpdating ? (
                  <>
                    <span className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </span>
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}