"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, ArrowLeft, Plus, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";
import { useQuestionStore } from "@/stores/useQuestionStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ENDPOINT = "/question";

export default function QuestionListPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [token, setToken] = useState<string | null>(null);

  const {
    questions,
    fetchQuestionsByQuizId,
    deleteQuestion,
    isLoading,
  } = useQuestionStore();

  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // State untuk Update Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    question_text: "",
    question_image: "",
    answers: [] as Array<{
      answer_text: string;
      score_value: number;
    }>
  });

  useEffect(() => {
    if (id) fetchQuestionsByQuizId(String(id));
  }, [id, fetchQuestionsByQuizId]);

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    setToken(t);
  }, []);

  const handleViewDetail = async (questionId: string) => {
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    setSelectedQuestion(null);

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${questionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.status_code === 200) {
        setSelectedQuestion(result.data);
      } else {
        throw new Error(result.message || "Gagal memuat detail soal");
      }
    } catch (error) {
      console.error("Error fetching question detail:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat memuat detail soal",
        icon: "error",
      });
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleOpenUpdateModal = async (questionId: string) => {
    setIsUpdateModalOpen(true);
    setIsLoadingDetail(true);

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT}/${questionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.status_code === 200) {
        setUpdateFormData({
          question_text: result.data.question_text || "",
          question_image: result.data.question_image || "",
          answers: result.data.answers?.map((ans: any) => ({
            answer_text: ans.answer_text,
            score_value: ans.score_value
          })) || []
        });
        setSelectedQuestion(result.data);
      } else {
        throw new Error(result.message || "Gagal memuat detail soal");
      }
    } catch (error) {
      console.error("Error fetching question detail:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat memuat detail soal",
        icon: "error",
      });
      setIsUpdateModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdateQuestion = async () => {
    console.log("SUBMIT UPDATE FORM:", updateFormData);
    if (!selectedQuestion) return;

    // Validasi
    if (!updateFormData.question_text.trim()) {
      Swal.fire({
        title: "Perhatian!",
        text: "Pertanyaan tidak boleh kosong",
        icon: "warning",
      });
      return;
    }

    const hasEmptyAnswer = updateFormData.answers.some(ans => !ans.answer_text.trim());
    if (hasEmptyAnswer) {
      Swal.fire({
        title: "Perhatian!",
        text: "Semua pilihan jawaban harus diisi",
        icon: "warning",
      });
      return;
    }

    const hasCorrectAnswer = updateFormData.answers.some(ans => ans.score_value > 0);
    if (!hasCorrectAnswer) {
      Swal.fire({
        title: "Perhatian!",
        text: "Harus ada minimal satu jawaban benar",
        icon: "warning",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Buat FormData
      const formData = new FormData();
      formData.append("question_text", updateFormData.question_text);

      if (updateFormData.question_image) {
        formData.append("question_image", updateFormData.question_image);
      }

      // Tambahkan answers sebagai JSON string atau individual fields
      formData.append("answers", JSON.stringify(updateFormData.answers));

      const response = await fetch(
        `${API_BASE_URL}${ENDPOINT}/${selectedQuestion.question_id}/edit`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status_code === 200) {
        Swal.fire({
          title: "Berhasil!",
          text: "Soal berhasil diperbarui",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsUpdateModalOpen(false);
        fetchQuestionsByQuizId(String(id));
      } else {
        throw new Error(result.message || "Gagal memperbarui soal");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Tidak dapat memperbarui soal",
        icon: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const updatedAnswers = [...updateFormData.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value
    };
    setUpdateFormData({ ...updateFormData, answers: updatedAnswers });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedQuestion(null);
    setUpdateFormData({
      question_text: "",
      question_image: "",
      answers: []
    });
  };

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
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Soal {index + 1}
                    </p>
                    <p className="font-medium line-clamp-2">
                      {q.question_text}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetail(q.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleOpenUpdateModal(q.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(q.id)}
                      className="bg-red-600 hover:bg-red-700"
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

      {/* Modal Detail Soal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-blue-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Detail Soal
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-20 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Memuat detail soal...
            </div>
          ) : selectedQuestion ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kuis</p>
                <p className="font-semibold text-lg">
                  {selectedQuestion.quiz}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pertanyaan
                </p>
                <p className="text-base leading-relaxed">
                  {selectedQuestion.question_text}
                </p>
              </div>

              {selectedQuestion.question_image && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gambar Soal
                  </p>
                  <img
                    src={selectedQuestion.question_image}
                    alt="Question"
                    className="w-full max-w-md rounded-lg border shadow-sm"
                  />
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Pilihan Jawaban
                </p>
                <div className="space-y-3">
                  {selectedQuestion.answers?.map((answer: any, idx: number) => (
                    <div
                      className={`p-4 rounded-lg border-2 transition text-gray-800 ${answer.score_value > 0
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="font-medium">
                            {answer.answer_text}
                          </span>
                        </div>
                        {answer.score_value > 0 && (
                          <span className="text-xs font-semibold bg-green-600 text-white px-3 py-1 rounded-full">
                            Jawaban Benar
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 ml-8">
                        Nilai: {answer.score_value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 pt-4 border-t text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Dibuat:</span>{" "}
                  {selectedQuestion.created_at}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleCloseModal} className="gap-2">
                  <X className="w-4 h-4" /> Tutup
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal Update Soal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-blue-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Soal
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-20 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              Memuat detail soal...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pertanyaan </p>
                <Textarea
                  id="question_text"
                  value={updateFormData.question_text}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      question_text: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-2 text-gray-800"
                />
              </div>

              {/* Question Image */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">URL Gambar Soal (Opsional)</p>
                <Input
                  id="question_image"
                  type="file"
                  value={updateFormData.question_image}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      question_image: e.target.value,
                    })
                  }
                  className="mt-2 text-gray-800"
                />
              </div>

              {/* Answers */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pilihan Jawaban</p>
                <div className="space-y-4">
                  {updateFormData.answers.map((answer, index) => (
                    <div
                      className="border rounded-lg p-4 space-y-3 text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <Input
                          value={answer.answer_text}
                          onChange={(e) =>
                            handleAnswerChange(index, "answer_text", e.target.value)
                          }
                          placeholder={`Jawaban ${String.fromCharCode(65 + index)}`}
                          className="flex-1 text-gray-800"
                        />
                      </div>
                      <div className="flex items-center gap-4 ml-8">
                        <p className="text-sm text-muted-foreground mb-2">
                          Nilai:
                        </p>
                        <Input
                          id={`score-${index}`}
                          type="number"
                          value={answer.score_value}
                          onChange={(e) =>
                            handleAnswerChange(
                              index,
                              "score_value",
                              Number(e.target.value)
                            )
                          }
                          className="w-24 text-gray-800"
                          min="0"
                        />
                        {answer.score_value > 0 && (
                          <span className="text-xs font-semibold bg-green-600 text-white px-2 py-1 rounded">
                            Jawaban Benar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={handleCloseUpdateModal}
                  disabled={isUpdating}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleUpdateQuestion}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
