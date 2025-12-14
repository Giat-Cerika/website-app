"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast";
import axios from "axios";
import axiosForm from "@/lib/axios-form";

export default function CreateMateriPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>("");
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const editorRef = useRef<any>(null);

    useEffect(() => {
        let summernoteInitialized = false;

        const loadSummernote = async () => {
            try {
                if (typeof window === "undefined") return;

                console.log("[INFO] Starting to load Summernote...");

                if (!(window as any).jQuery) {
                    console.log("[INFO] Loading jQuery...");
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
                    console.log("[INFO] Loading Summernote CSS...");
                    const summernoteCss = document.createElement("link");
                    summernoteCss.rel = "stylesheet";
                    summernoteCss.href =
                        "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css";
                    document.head.appendChild(summernoteCss);
                }

                // Load Summernote Script
                console.log("[INFO] Loading Summernote script...");
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
                    console.log("[INFO] Initializing Summernote...");
                    $(editorRef.current).summernote({
                        height: 300,
                        placeholder: "Tulis deskripsi materi di sini...",
                        callbacks: {
                            onChange: function (contents: string) {
                                setDescription(contents);
                            },
                            onInit: () => {
                                console.log("[SUCCESS] Summernote initialized!");
                                summernoteInitialized = true;
                            },
                            onError: (err: any) => {
                                console.error("[ERROR] Summernote error:", err);
                            }
                        }
                    });
                } else {
                    console.error("[ERROR] jQuery atau editorRef tidak ditemukan.");
                }

            } catch (err) {
                console.error("[ERROR] Gagal load Summernote:", err);
                toastError("Gagal memuat editor");
            }
        };

        loadSummernote();

        return () => {
            const $ = (window as any).jQuery;
            if ($ && editorRef.current && summernoteInitialized) {
                console.log("[INFO] Destroying Summernote...");
                $(editorRef.current).summernote("destroy");
            }
        };
    }, []);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toastError("File harus berupa gambar");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toastError("Ukuran file maksimal 5MB");
                return;
            }
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (galleryImages.length + files.length > 10) {
            toastError("Maksimal 10 gambar gallery");
            return;
        }

        const validFiles: File[] = [];
        const previews: string[] = [];

        files.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toastError(`${file.name} bukan file gambar`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toastError(`${file.name} terlalu besar (max 5MB)`);
                return;
            }
            validFiles.push(file);
            previews.push(URL.createObjectURL(file));
        });

        setGalleryImages([...galleryImages, ...validFiles]);
        setGalleryPreviews([...galleryPreviews, ...previews]);
    };

    const removeGalleryImage = (index: number) => {
        const newImages = [...galleryImages];
        const newPreviews = [...galleryPreviews];

        URL.revokeObjectURL(newPreviews[index]);
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setGalleryImages(newImages);
        setGalleryPreviews(newPreviews);
    };

    const removeCoverImage = () => {
        if (coverPreview) {
            URL.revokeObjectURL(coverPreview);
        }
        setCoverImage(null);
        setCoverPreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");
        if (!token) {
            toastError("Token tidak ditemukan. Silakan login ulang.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("cover", coverImage as Blob);

            galleryImages.forEach((img) => {
                formData.append("gallery", img);
            });

            await axiosForm.post("/material/create", formData);

            toastSuccess("Materi berhasil ditambahkan");
            router.push("/admin/materi");
        } catch (error: any) {
            console.error("🔥 AXIOS ERROR:", error);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }

            toastError(error.response?.data?.message || "Gagal menyimpan materi");
        } finally {
            setLoading(false);
        }
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

        .upload-area {
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background-color: #eff6ff;
          transform: translateY(-2px);
        }

        .preview-image {
          transition: all 0.3s ease;
        }

        .preview-image:hover {
          transform: scale(1.05);
        }

        .btn-remove {
          transition: all 0.3s ease;
        }

        .btn-remove:hover {
          transform: scale(1.1) rotate(90deg);
          background-color: #dc2626;
        }
      `}</style>

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6 animate-slideInDown">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white rounded-lg transition-all active:scale-95"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Tambah Materi Baru</h1>
            </div>

            {/* FORM */}
            <Card className="max-w-4xl mx-auto shadow-lg animate-fadeIn">
                <CardHeader>
                    <CardTitle className="text-2xl">Form Materi Pembelajaran</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                                Judul Materi
                            </label>
                            <Input
                                placeholder="Contoh: Belajar Angka 1-10"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                                Cover Materi
                            </label>

                            {coverPreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={coverPreview}
                                        alt="Cover Preview"
                                        className="preview-image w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCoverImage}
                                        className="btn-remove absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-area block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                                    <div className="flex flex-col items-center gap-3">
                                        <Upload className="w-12 h-12 text-gray-400" />
                                        <p className="text-gray-600 font-medium">
                                            Klik untuk upload cover
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PNG, JPG, JPEG (Max 5MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                                Galeri Gambar
                                <span className="text-sm text-gray-500 font-normal">
                                    (Min 1, Max 10 gambar)
                                </span>
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                {galleryPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Gallery ${index + 1}`}
                                            className="preview-image w-full h-32 object-cover rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="btn-remove absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {galleryImages.length < 10 && (
                                    <label className="upload-area border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer">
                                        <Plus className="w-8 h-8 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Tambah</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
                                Deskripsi Materi
                            </label>
                            <div ref={editorRef}></div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95 shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Menyimpan...
                                    </div>
                                ) : (
                                    "Simpan Materi"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}