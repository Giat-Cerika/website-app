"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Upload, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { useQuestionStore } from "@/stores/useQuestionStore";

interface Answer {
    answer_text: string;
    score_value: number;
}

export default function AddQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };

    const [questionText, setQuestionText] = useState("");
    const [answers, setAnswers] = useState<Answer[]>([
        { answer_text: "", score_value: 0 },
    ]);
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createQuestion, isLoading } = useQuestionStore();

    const handleAddAnswer = () => {
        setAnswers([...answers, { answer_text: "", score_value: 0 }]);
    };

    const handleRemoveAnswer = (index: number) => {
        if (answers.length > 1) {
            setAnswers(answers.filter((_, i) => i !== index));
        }
    };

    const handleAnswerChange = (
        index: number,
        field: keyof Answer,
        value: string | number
    ) => {
        const newAnswers = [...answers];
        if (field === "score_value") {
            newAnswers[index][field] = Number(value);
        } else {
            newAnswers[index][field] = value as string;
        }
        setAnswers(newAnswers);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                Swal.fire({
                    title: "Error!",
                    text: "File harus berupa gambar",
                    icon: "error",
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: "Error!",
                    text: "Ukuran file maksimal 5MB",
                    icon: "error",
                });
                return;
            }

            setQuestionImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setQuestionImage(null);
        setImagePreview(null);
    };

    const validateForm = () => {
        if (!questionText.trim()) {
            Swal.fire({
                title: "Error!",
                text: "Teks pertanyaan harus diisi",
                icon: "error",
            });
            return false;
        }

        if (answers.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "Minimal harus ada 1 jawaban",
                icon: "error",
            });
            return false;
        }

        for (let i = 0; i < answers.length; i++) {
            if (!answers[i].answer_text.trim()) {
                Swal.fire({
                    title: "Error!",
                    text: `Jawaban ${i + 1} tidak boleh kosong`,
                    icon: "error",
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const result = await Swal.fire({
            title: "Tambah Soal?",
            text: "Apakah Anda yakin ingin menambahkan soal ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Tambahkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3b82f6",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: "Menyimpan...",
                text: "Sedang menambahkan soal ke kuis",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            await createQuestion({
                quiz_id: String(id),
                question_text: questionText,
                answers,
                question_image: questionImage ?? undefined,
            });

            Swal.fire({
                title: "Berhasil!",
                text: "Soal berhasil ditambahkan",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            router.push(`/admin/kuis/${id}`);
        } catch (error: any) {

            Swal.fire({
                title: "Gagal!",
                text:
                    error?.message ||
                    "Terjadi kesalahan saat menambahkan soal",
                icon: "error",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Button
                onClick={() => router.back()}
                className="flex items-center gap-2"
                disabled={isSubmitting}
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>

            <Card className="shadow-lg rounded-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                    <CardTitle className="text-2xl font-bold">Tambah Soal Baru</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Tambahkan soal baru untuk kuis ini
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* Question Text */}
                    <div className="space-y-2">
                        <div className="text-base font-semibold">
                            Teks Pertanyaan <span className="text-red-500">*</span>
                        </div>
                        <Textarea
                            id="question_text"
                            placeholder="Masukkan teks pertanyaan..."
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="min-h-32 resize-y"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Question Image */}
                    <div className="space-y-2">
                        <div className="text-base font-semibold">
                            Gambar Pertanyaan (Opsional)
                        </div>

                        {imagePreview ? (
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-64 mx-auto rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    id="question_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="question_image"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="w-12 h-12 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        Klik untuk upload gambar
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        PNG, JPG, GIF hingga 5MB
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Answers Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-base font-semibold">
                                Jawaban <span className="text-red-500">*</span>
                            </div>
                            <Button
                                onClick={handleAddAnswer}
                                className="gap-2"
                                disabled={isSubmitting}
                            >
                                <Plus className="w-4 h-4" /> Tambah Jawaban
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {answers.map((answer, index) => (
                                <Card key={index} className="shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 space-y-4">
                                                <div className="space-y-2">
                                                    <div>
                                                        Teks Jawaban
                                                    </div>
                                                    <Input
                                                        id={`answer_text_${index}`}
                                                        placeholder="Masukkan teks jawaban..."
                                                        value={answer.answer_text}
                                                        onChange={(e) =>
                                                            handleAnswerChange(index, "answer_text", e.target.value)
                                                        }
                                                        disabled={isSubmitting}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        Nilai Skor
                                                    </div>
                                                    <Input
                                                        id={`score_value_${index}`}
                                                        type="number"
                                                        placeholder="0"
                                                        value={answer.score_value}
                                                        onChange={(e) =>
                                                            handleAnswerChange(index, "score_value", e.target.value)
                                                        }
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>

                                            {answers.length > 1 && (
                                                <Button
                                                    onClick={() => handleRemoveAnswer(index)}
                                                    className="mt-8"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Tambah Soal
                                </>
                            )}
                        </Button>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}