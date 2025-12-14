"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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

  const {
    categories,
    fetchCategories,
    isLoading: quizTypeLoading,
  } = useCategoryStore();

  const [form, setForm] = useState({
    code: "",
    title: "",
    quiz_type_id: "",
    start_date: "",
    end_date: "",
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
          placeholder: "Tulis deskripsi kuis di sini...",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.quiz_type_id || !description) {
      toastError("Semua field wajib diisi");
      return;
    }

    const payload = {
      code: form.code,
      title: form.title,
      quiz_type_id: form.quiz_type_id,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
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
              <label className="font-semibold mb-1 block">Kode Kuis</label>
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-semibold mb-1 block">Judul Kuis</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-semibold mb-1 block">Tipe Kuis</label>
              <select
                name="quiz_type_id"
                value={form.quiz_type_id}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                disabled={quizTypeLoading}
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
                Deskripsi Kuis
              </label>
              <div ref={editorRef}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-1 block">
                  Tanggal Mulai
                </label>
                <Input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="font-semibold mb-1 block">
                  Tanggal Selesai
                </label>
                <Input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : "Simpan Kuis"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
