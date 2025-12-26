"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, InfinityIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toastSuccess, toastError } from "@/lib/toast";
import { useQuizStore } from "@/stores/useQuizStore";
import { useCategoryStore } from "@/stores/useCategoryStore";

export default function CreateQuizPage() {
  const router = useRouter();
  const createQuiz = useQuizStore((state) => state.createQuiz);

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [infiniteMode, setInfiniteMode] = useState(false);

  const {
    categories,
    fetchCategories,
    isLoading: quizTypeLoading,
  } = useCategoryStore();

  const [form, setForm] = useState({
    code: "",
    title: "",
    quiz_type_id: "",
    start_date_only: "",
    start_time_only: "",
    end_date_only: "",
    end_time_only: "",
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let initialized = false;

    const loadSummernote = async () => {
      if (typeof window === "undefined") return;

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

      if (!document.querySelector('link[href*="summernote"]')) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href =
          "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css";
        document.head.appendChild(css);
      }

      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      const $ = (window as any).jQuery;

      if ($ && editorRef.current) {
        $(editorRef.current).summernote({
          height: 250,
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

        initialized = true;
      }
    };

    loadSummernote();

    return () => {
      const $ = (window as any).jQuery;
      if ($ && editorRef.current && initialized) {
        $(editorRef.current).summernote("destroy");
      }
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDateTime = (dateStr: string, timeStr: string = "") => {
    if (infiniteMode) {
      // Set time to 00:00:00 for infinite mode
      const date = new Date(dateStr + "T00:00:00");
      const fakeUTC = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return fakeUTC.toISOString();
    } else {
      // Combine date and time
      const date = new Date(dateStr + "T" + timeStr);
      const fakeUTC = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return fakeUTC.toISOString();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.quiz_type_id || !description) {
      toastError("Semua field wajib diisi");
      return;
    }

    if (!form.start_date_only || !form.end_date_only) {
      toastError("Tanggal mulai dan selesai wajib diisi");
      return;
    }

    if (!infiniteMode && (!form.start_time_only || !form.end_time_only)) {
      toastError("Waktu mulai dan selesai wajib diisi");
      return;
    }

    setLoading(true);

    const payload = {
      code: form.code,
      title: form.title,
      quiz_type_id: form.quiz_type_id,
      start_date: formatDateTime(form.start_date_only, form.start_time_only),
      end_date: formatDateTime(form.end_date_only, form.end_time_only),
      description,
    };

    try {
      await createQuiz(payload);

      toastSuccess("Kuis berhasil dibuat");
      router.push("/admin/kuis");
    } catch (err: any) {
      toastError(err.message || "Gagal membuat kuis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <style>{`
        .note-editor {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
      `}</style>

      <Button
        className="mb-4 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tambah Kuis</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="font-semibold mb-1 block">
                Kode Kuis
              </label>
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}

              />
            </div>

            <div>
              <label className="font-semibold mb-1 block">
                Judul Kuis <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}

                required
              />
            </div>

            <div>
              <label className="font-semibold mb-1 block">
                Tipe Kuis <span className="text-red-500">*</span>
              </label>
              <select
                name="quiz_type_id"
                value={form.quiz_type_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={quizTypeLoading}
                required
              >
                <option value="">
                  {quizTypeLoading ? "Memuat tipe..." : "Pilih Tipe"}
                </option>

                {categories.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold mb-1 block">
                Deskripsi Kuis <span className="text-red-500">*</span>
              </label>
              <div ref={editorRef}></div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="infiniteMode"
                checked={infiniteMode}
                onChange={(e) => setInfiniteMode(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="infiniteMode"
                className="font-medium text-gray-700 cursor-pointer select-none"
              >
                <span className="flex items-center gap-2">Infinity Mode<InfinityIcon className="w-4 h-4" /></span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-1 block">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="start_date_only"
                  value={form.start_date_only}
                  onChange={handleChange}
                  required
                  className="mb-2"
                />
                {!infiniteMode && (
                  <Input
                    type="time"
                    name="start_time_only"
                    value={form.start_time_only}
                    onChange={handleChange}
                    required={!infiniteMode}
                    step="1"

                  />
                )}
              </div>

              <div>
                <label className="font-semibold mb-1 block">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  name="end_date_only"
                  value={form.end_date_only}
                  onChange={handleChange}
                  required
                  className="mb-2"
                />
                {!infiniteMode && (
                  <Input
                    type="time"
                    name="end_time_only"
                    value={form.end_time_only}
                    onChange={handleChange}
                    required={!infiniteMode}
                    step="1"

                  />
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Catatan:</strong> {infiniteMode
                  ? "Mode Infinity aktif - waktu akan diset ke 00:00:00 secara otomatis"
                  : "Pastikan mengisi waktu dengan format 24 jam (HH:MM:SS)"}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Kuis
                </>
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}