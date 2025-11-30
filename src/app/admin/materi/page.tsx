"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X, Eye, FileText, Calendar, User, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast";
import { useMateriStore } from "@/stores/useMaterialStore";
import { Materi } from "@/types/material.types";
import "@/components/styles/material.css";

export default function MateriPage() {
  const router = useRouter();
  const {
    materi,
    isLoading,
    fetchMateri,
    updateMateri,
    deleteMateri,
  } = useMateriStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Materi | null>(null);
  const [description, setDescription] = useState("");
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const per_page = 10;

  useEffect(() => {
    fetchMateri({
      page,
      per_page,
      search: search.trim() !== "" ? search : undefined,
    });
  }, [page, search, fetchMateri]);

  const editorRef = useRef<any>(null);

  useEffect(() => {
    let summernoteInitialized = false;

    const loadSummernote = async () => {
      try {
        if (typeof window === "undefined") return;

        if (!(window as any).jQuery) {
          await new Promise((resolve, reject) => {
            const jquery = document.createElement("script");
            jquery.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
            jquery.onload = resolve;
            jquery.onerror = () => reject("Gagal memuat jQuery");
            document.head.appendChild(jquery);
          });
        }

        // Load CSS
        if (!document.querySelector('link[href*="summernote"]')) {
          const summernoteCss = document.createElement("link");
          summernoteCss.rel = "stylesheet";
          summernoteCss.href =
            "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css";
          document.head.appendChild(summernoteCss);
        }

        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js";
          script.onload = resolve;
          script.onerror = () => reject("Gagal memuat Summernote");
          document.body.appendChild(script);
        });

        const $ = (window as any).jQuery;

        if ($ && editorRef.current) {
          $(editorRef.current).summernote({
            height: 300,
            placeholder: "Tulis deskripsi materi di sini...",
            callbacks: {
              onChange: function (contents: string) {
                setDescription(contents);
              },
              onInit: () => {
                summernoteInitialized = true;
              },
              onError: (err: any) => {
              }
            }
          });
        } else {
        }

      } catch (err) {
      }
    };

    loadSummernote();

    return () => {
      const $ = (window as any).jQuery;
      if ($ && editorRef.current && summernoteInitialized) {
        $(editorRef.current).summernote("destroy");
      }
    };
  }, []);

  useEffect(() => {
    if (!isEditOpen) return;

    const $ = (window as any).jQuery;

    setTimeout(() => {
      if ($ && editorRef.current) {
        $(editorRef.current).summernote({
          height: 300,
          placeholder: "Tulis deskripsi materi...",
          focus: true,
          callbacks: {
            onChange: function (contents: string) {
              setDescription(contents);
            }
          }
        });

        if (description) {
          $(editorRef.current).summernote("code", description);
        }
      }
    }, 300);

    return () => {
      if ($ && editorRef.current) {
        $(editorRef.current).summernote("destroy");
      }
    };
  }, [isEditOpen]);

  useEffect(() => {
    fetchMateri({ page, per_page: 10 });
  }, [page, fetchMateri]);

  const handleDelete = async (item: Materi) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Materi akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    const success = await deleteMateri(item.id);
    if (success) {
      toastSuccess("Materi berhasil dihapus");
    } else {
      toastError("Gagal menghapus materi");
    }
  };

  const handleEdit = (item: Materi) => {
    setSelected(item);
    setDescription(item.description);

    setTimeout(() => {
      const $ = (window as any).jQuery;
      if ($ && editorRef.current) {
        $(editorRef.current).summernote("code", item.description);
      }
    }, 300);

    setIsEditOpen(true);
  };


  const handleView = (item: Materi) => {
    setSelected(item);
    setSelectedGalleryIndex(0);
    setIsDetailOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selected) return;

    const $ = (window as any).jQuery;
    const htmlContent = $(editorRef.current).summernote("code");

    const success = await updateMateri(selected.id, {
      title: selected.title,
      description: htmlContent, // ← Simpan HTML Summernote
    });

    if (success) {
      toastSuccess("Data materi berhasil diperbarui");
      setIsEditOpen(false);
    } else {
      toastError("Gagal memperbarui materi");
    }
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6 animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-800">
          Materi Pembelajaran
        </h1>
        <a
          href="/admin/materi/create"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition shadow hover:shadow-lg active:scale-95 duration-300 font-medium"
        >
          <Plus className="w-5 h-5" /> Tambah Materi
        </a>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          className="px-4 text-gray-800 py-2 border border-gray-300 rounded-lg w-72 focus:ring-2 focus:ring-blue-500"
          placeholder="Cari materi..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden loading-skeleton"
            >
              <div className="w-full h-48 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : materi.length === 0 ? (
        <div className="text-center py-12 animate-fadeIn">
          <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Belum ada materi pembelajaran</p>
          <p className="text-gray-500 text-sm mt-2">Klik tombol "Tambah Materi" untuk membuat materi baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {materi.map((item) => (
            <div
              key={item.id}
              className="materi-card bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative overflow-hidden bg-gray-900 h-48">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {stripHtmlTags(item.description)}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  <span>Dibuat: {item.created_at}</span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleView(item)}
                    className="btn-view text-white text-sm px-4 py-2 rounded-lg font-medium"
                  >
                    <Eye className="w-4 h-4 btn-view-icon" />
                    Lihat Detail
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn-action btn-edit p-2 rounded-lg transition-all"
                      title="Edit materi"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="btn-action btn-delete p-2 rounded-lg transition-all"
                      title="Hapus materi"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className={`px-4 py-2 text-gray-800 rounded-lg border ${page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
            }`}
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {page}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={materi.length < per_page}  // <-- Tambah ini
          className={`px-4 text-gray-800 py-2 rounded-lg border ${materi.length < per_page
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
            }`}
        >
          Next
        </button>
      </div>

      {isDetailOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto overscroll-contain">

            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-3xl font-bold text-gray-800 mt-4">
                {selected.title}
              </h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 hover:rotate-90"
              >
                <X className="w-7 h-7 text-gray-500" />
              </button>
            </div>

            <div className="m-6 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>
                  {selected.created_at}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span>{selected.created_by || "Admin"}</span>
              </div>

              {selected.material_images && selected.material_images.length > 0 && (
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  <span>{selected.material_images.length} Gambar</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg relative">

                {selected.material_images && selected.material_images.length > 0 ? (
                  <img
                    src={selected.material_images[selectedGalleryIndex]}
                    alt="Cover Gallery"
                    className="w-full h-96 object-cover"
                  />
                ) : selected.cover ? (
                  <img
                    src={selected.cover}
                    alt="Cover"
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FileText className="w-96 h-96 text-white opacity-50" />
                  </div>
                )}

                {selected.material_images && selected.material_images.length > 0 && (
                  <div className="flex gap-3 p-4 mt-3 overflow-x-auto bg-gray-50 rounded-lg">
                    {selected.material_images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`gallery-${index}`}
                        className={`w-16 h-16 rounded-lg object-cover cursor-pointer transition-all border-2 ${index === selectedGalleryIndex
                          ? "border-blue-600 scale-105"
                          : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                        onClick={() => setSelectedGalleryIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="">
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selected.description }}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all active:scale-95"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 modal-backdrop">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Materi</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 hover:rotate-90"
              >
                <X className="w-7 h-7 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* JUDUL */}
              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2">
                  <span className="text-blue-600">📝</span>
                  Judul Materi
                </span>
                <input
                  type="text"
                  className="w-full text-gray-700 mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={selected.title || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, title: e.target.value })
                  }
                  placeholder="Masukkan judul materi..."
                />
              </label>

              {/* DESKRIPSI */}
              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2">
                  <span className="text-green-600">💬</span>
                  Deskripsi
                </span>
                <div className="mt-2">
                  <div ref={editorRef} />
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all active:scale-95 font-medium hover:shadow-md"
                onClick={() => setIsEditOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95 font-medium shadow-lg hover:shadow-xl"
                onClick={handleSaveEdit}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}