"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useQuestionStore } from "@/stores/useQuestionStore";

export default function QuestionListPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const {
    questions,
    fetchQuestionsByQuizId,
    deleteQuestion,
    isLoading,
  } = useQuestionStore();

  useEffect(() => {
    if (id) fetchQuestionsByQuizId(String(id));

    console.log(id);
  }, [id, fetchQuestionsByQuizId]);

  const handleDelete = async (questionId: string) => {
    const result = await Swal.fire({
      title: "Hapus Soal?",
      text: "Soal yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteQuestion(questionId);

      Swal.fire({
        title: "Berhasil!",
        text: "Soal berhasil dihapus",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat menghapus soal",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

        <Button
          onClick={() => router.push(`/admin/kuis/${id}/add-question`)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Soal
        </Button>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Daftar Soal
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Memuat soal...
            </div>
          ) : questions.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Belum ada soal pada kuis ini.
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Soal #{index + 1}
                    </p>
                    <p className="font-medium line-clamp-2">
                      {q.question_text}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        router.push(
                          `/admin/kuis/${id}/questions/${q.id}`
                        )
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() =>
                        router.push(
                          `/admin/kuis/${id}/questions/${q.id}/edit`
                        )
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
