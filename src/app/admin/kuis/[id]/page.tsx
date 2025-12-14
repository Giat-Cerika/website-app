"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/useQuizStore";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { selectedQuiz, fetchQuizById, isLoading } = useQuizStore();

  useEffect(() => {
    if (id) {
      fetchQuizById(id);
    }
  }, [id, fetchQuizById]);

  // Tampilkan loading
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Memuat detail kuis...</span>
      </div>
    );
  }

  // Jika tidak ada data (gagal fetch atau tidak ditemukan)
  if (!selectedQuiz) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Kuis tidak ditemukan atau terjadi kesalahan saat memuat data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

      </div>

      {/* Main Card */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold leading-tight">
            {selectedQuiz.title}
          </CardTitle>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Kode: {selectedQuiz.code}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(selectedQuiz.start_date)} – {formatDate(selectedQuiz.end_date)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Deskripsi Kuis</h3>
            <div
              className="prose prose-sm md:prose-base max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: selectedQuiz.description || "<p>Tidak ada deskripsi.</p>",
              }}
            />
          </div>

          {/* Informasi tambahan (opsional) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Jumlah Soal</p>
              <p className="text-lg font-medium">{selectedQuiz.amount_questions ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sudah Ditugaskan</p>
              <p className="text-lg font-medium">{selectedQuiz.amount_assigned ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}