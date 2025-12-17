"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Loader2,
  Lock,
  LockOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/useQuizStore";
import Swal from "sweetalert2";

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "Draft", color: "bg-gray-200 text-gray-700" },
  1: { label: "Open", color: "bg-green-100 text-green-700" },
  2: { label: "Close", color: "bg-red-100 text-red-700" },
};

const getStatusLabel = (status: number) => STATUS_MAP[status]?.label ?? "Unknown";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const {
    selectedQuiz,
    fetchQuizById,
    updateQuizStatus,
    isLoading,
  } = useQuizStore();

  const [isUpdatingOrderMode, setIsUpdatingOrderMode] = useState(false);

  useEffect(() => {
    if (id) fetchQuizById(id);
  }, [id, fetchQuizById]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleChangeStatus = async (newStatus: number) => {
    if (!selectedQuiz) return;
    if (selectedQuiz.status === newStatus) {
      Swal.fire({
        title: "Info",
        text: `Status kuis sudah "${getStatusLabel(newStatus)}"`,
        icon: "info",
      });
      return;
    }

    const result = await Swal.fire({
      title: `${newStatus === 1 ? "Buka" : "Tutup"} Kuis?`,
      html: `
        <p>Status kuis akan diubah dari
        <strong>"${getStatusLabel(selectedQuiz.status)}"</strong>
        menjadi
        <strong>"${getStatusLabel(newStatus)}"</strong></p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: newStatus === 1 ? "#10b981" : "#ef4444",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Memproses...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await updateQuizStatus(selectedQuiz.id, newStatus);
      await fetchQuizById(selectedQuiz.id);
      router.refresh();

      Swal.fire({
        title: "Berhasil!",
        text: `Status kuis berhasil diubah menjadi "${getStatusLabel(newStatus)}"`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Gagal!",
        text: error?.response?.data?.message || error?.message || "Terjadi kesalahan",
        icon: "error",
      });
    }
  };

  const handleChangeOrderMode = async (mode: "random" | "sequential") => {
    if (!selectedQuiz) return;
    if (selectedQuiz.question_order_mode === mode) return;

    setIsUpdatingOrderMode(true);
    
    // Show loading toast
    Swal.fire({
      title: "Mengubah Order Mode...",
      text: `Sedang mengubah ke mode ${mode === "random" ? "Random" : "Sequential"}`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await useQuizStore.getState().updateQuestionOrderMode(selectedQuiz.id, mode);
      await fetchQuizById(selectedQuiz.id);
      
      // Success notification
      Swal.fire({
        title: "Berhasil!",
        text: `Order mode berhasil diubah ke ${mode === "random" ? "Random" : "Sequential"}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat mengubah order mode.",
        icon: "error",
      });
    } finally {
      setIsUpdatingOrderMode(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Memuat detail kuis...</span>
      </div>
    );
  }

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
              Kuis tidak ditemukan atau terjadi kesalahan.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Button>

      <Card className="shadow-lg rounded-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl space-y-4">
          <div className="flex flex-row justify-between">
            <CardTitle className="text-3xl font-bold">
              {selectedQuiz.title}
            </CardTitle>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Order Mode:</span>
              <div className="relative">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 pr-10 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  value={selectedQuiz.question_order_mode}
                  onChange={(e) =>
                    handleChangeOrderMode(e.target.value as "random" | "sequential")
                  }
                  disabled={isUpdatingOrderMode}
                >
                  <option value="random">Random</option>
                  <option value="sequential">Sequential</option>
                </select>
                {isUpdatingOrderMode && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                STATUS_MAP[selectedQuiz.status]?.color
              }`}
            >
              {getStatusLabel(selectedQuiz.status)}
            </span>

            <div className="flex gap-2">
              {selectedQuiz.status !== 1 && (
                <Button
                  onClick={() => handleChangeStatus(1)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <LockOpen className="w-4 h-4" /> Open
                </Button>
              )}

              {selectedQuiz.status !== 2 && (
                <Button
                  onClick={() => handleChangeStatus(2)}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <Lock className="w-4 h-4" /> Close
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <Tag className="w-4 h-4 text-blue-600" />
              Kode: {selectedQuiz.code}
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              {formatDate(selectedQuiz.start_date)} – {formatDate(selectedQuiz.end_date)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Deskripsi Kuis</h3>
            <div
              className="prose max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: selectedQuiz.description || "<p>Tidak ada deskripsi.</p>",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-6 shadow-sm">
              <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold uppercase tracking-wide mb-2">
                Jumlah Soal
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {selectedQuiz.amount_questions ?? "-"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl p-6 shadow-sm">
              <p className="text-xs text-green-800 dark:text-green-300 font-semibold uppercase tracking-wide mb-2">
                Sudah Ditugaskan
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {selectedQuiz.amount_assigned ?? "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}