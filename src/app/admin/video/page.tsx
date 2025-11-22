"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, X, Play, Eye } from "lucide-react";
import { useVideoStore } from "@/stores/useVideoStore";
import { toastSuccess, toastError, toastWarning } from "@/lib/toast";
import "@/components/styles/video.css";

export default function VideoPage() {
    const {
        videos = [],
        isLoading,
        fetchVideos,
        deleteVideo,
        updateVideo,
    } = useVideoStore();

    const [page, setPage] = useState(1);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const getYouTubeThumbnail = (url?: string): string => {
        if (!url) return "/no-thumbnail.png";
        try {
            const videoId = url.split("v=")[1] || url.split("/").pop();
            return videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : "/no-thumbnail.png";
        } catch {
            return "/no-thumbnail.png";
        }
    };

    useEffect(() => {
        fetchVideos({ page, per_page: 10 });
    }, [page, fetchVideos]);

    const handleDelete = async (item: any) => {
        const confirm = await Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Video akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await deleteVideo(item.id);
            toastSuccess("Video berhasil dihapus");
            fetchVideos({ page, per_page: 10 });
        } catch (error: any) {
            toastError(error.message || "Gagal menghapus video");
        }
    };

    const handleEdit = (item: any) => {
        setSelected(item);
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selected) return;

        try {
            await updateVideo(selected.id, {
                title: selected.title,
                description: selected.description,
                video_path: selected.video_path,
            });
            toastSuccess("Data video berhasil diperbarui");
            setIsEditOpen(false);
            fetchVideos({ page, per_page: 10 });
        } catch (error: any) {
            toastError(error.message || "Gagal memperbarui video");
        }

    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 animate-slideInDown">
                <h1 className="text-3xl font-bold text-gray-800">
                    Video Pembelajaran
                </h1>
                <a
                    href="/admin/video/create"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition shadow hover:shadow-lg active:scale-95 duration-300 font-medium"
                >
                    <Plus className="w-5 h-5" /> Tambah Video
                </a>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden loading-skeleton">
                            <div className="w-full h-48 bg-gray-300"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {videos.map((item) => (
                        <div key={item.id} className="video-card bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="relative overflow-hidden bg-gray-900">
                                <img
                                    src={getYouTubeThumbnail(item.videoUrl)}
                                    alt={item.title || "Video"}
                                    className="w-full h-48 object-cover"
                                />                               
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                    {item.description}
                                </p>
                                
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                    <a
                                        href={item.videoUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-watch text-white text-sm px-4 py-2 rounded-lg font-medium"
                                    >
                                        <Eye className="w-4 h-4 btn-watch-icon" />
                                        Tonton
                                    </a>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="btn-action btn-edit p-2 rounded-lg transition-all"
                                            title="Edit video"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="btn-action btn-delete p-2 rounded-lg transition-all"
                                            title="Hapus video"
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

            {/* EDIT MODAL */}
            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 modal-backdrop">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl modal-content">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Edit Video</h2>
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
                                    Judul Video
                                </span>
                                <input
                                    type="text"
                                    className="w-full text-gray-700 mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={selected.title || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, title: e.target.value })
                                    }
                                    placeholder="Masukkan judul video..."
                                />
                            </label>

                            {/* URL YOUTUBE */}
                            <label className="block">
                                <span className="text-gray-700 font-medium flex items-center gap-2">
                                    <span className="text-red-600">🎥</span>
                                    Link YouTube
                                </span>
                                <input
                                    type="text"
                                    className="w-full text-gray-700 mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                                    value={selected.videoUrl || selected.video_path || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, videoUrl:e.target.value, video_path: e.target.value })
                                    }
                                    placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                                />
                            </label>

                            {/* DESKRIPSI */}
                            <label className="block">
                                <span className="text-gray-700 font-medium flex items-center gap-2">
                                    <span className="text-green-600">💬</span>
                                    Deskripsi
                                </span>
                                <textarea
                                    className="w-full text-gray-700 mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    rows={2}
                                    value={selected.description || ""}
                                    onChange={(e) =>
                                        setSelected({ ...selected, description: e.target.value })
                                    }
                                    placeholder="Jelaskan isi video..."
                                />
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
    )
}