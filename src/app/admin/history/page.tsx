"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, BookOpen, Users, Trophy, Calendar, Clock, TrendingUp, Eye, X } from "lucide-react";
import { useQuizHistoryStore } from "@/stores/useQuizHistoryStore";
import { quizHistoryService } from "@/services/quiz-history.service";
import type { DetailHistory, QuizHistory } from "@/types/quiz-history.types";

export default function QuizHistoryPage() {
    const { quizHistories, isLoading, fetchQuizHistories } = useQuizHistoryStore();

    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 10;
    const [selectedQuiz, setSelectedQuiz] = useState<QuizHistory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchQuizHistories();
    }, [fetchQuizHistories]);

    // Filter dan pagination di frontend
    const filteredData = useMemo(() => {
        return quizHistories.filter(quiz =>
            quiz.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [quizHistories, searchInput]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, page, perPage]);

    const totalPages = Math.ceil(filteredData.length / perPage);

    // Reset page saat search berubah
    useEffect(() => {
        setPage(1);
    }, [searchInput]);

    const getStatusLabel = (category: number) => {
        return quizHistoryService.getStatusLabel(category);
    };

    const calculateStats = (details: DetailHistory[]) => {
        const total = details.length;
        const avgScore = details.reduce((sum, d) => sum + d.percentage, 0) / total;
        const completed = details.filter(d => d.status === "completed").length;

        return { total, avgScore: avgScore.toFixed(1), completed };
    };

    const openModal = (quiz: QuizHistory) => {
        setSelectedQuiz(quiz);
        setIsModalOpen(true);
        setIsAnimating(true);
    };

    const closeModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsModalOpen(false);
            setSelectedQuiz(null);
        }, 200);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);

        if (page <= 3) {
            endPage = Math.min(totalPages, maxVisible);
        }

        if (page >= totalPages - 2) {
            startPage = Math.max(1, totalPages - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => setPage(1)}
                                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium"
                            >
                                1
                            </button>
                            {startPage > 2 && (
                                <span className="hidden sm:inline px-2 text-gray-400">...</span>
                            )}
                        </>
                    )}

                    {pages.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1.5 rounded-lg border transition-all text-sm font-medium min-w-[40px] ${p === page
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "border-gray-300 hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="hidden sm:inline px-2 text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => setPage(totalPages)}
                                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    Halaman <span className="font-semibold">{page}</span> dari{" "}
                    <span className="font-semibold">{totalPages}</span>
                </div>
            </div>
        );
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
            `}</style>

            <div className="flex items-center justify-between mb-6 animate-slideInDown">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Riwayat Kuis</h1>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600">Total Kuis</p>
                    <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
                </div>
            </div>

            <div className="mb-6 animate-fadeIn">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari judul kuis..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
                    />
                </div>
            </div>

            <div className="animate-fadeIn">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-white rounded-lg shadow-sm animate-pulse"
                            />
                        ))}
                    </div>
                ) : paginatedData.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {searchInput ? "Tidak ada hasil ditemukan" : "Belum ada data quiz"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {searchInput
                                ? `Tidak ditemukan quiz dengan kata kunci "${searchInput}"`
                                : "Belum ada riwayat quiz"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedData.map((quiz) => {
                            const stats = calculateStats(quiz.detail_histories);
                            return (
                                <div
                                    key={quiz.quiz_id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Left Section - Quiz Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
                                                        <div
                                                            className="text-sm text-gray-600 mt-1"
                                                            dangerouslySetInnerHTML={{ __html: quiz.description }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Tanggal Mulai</p>
                                                            <p className="text-sm font-semibold text-gray-800">{quiz.start_date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                                                        <Users className="w-4 h-4 text-purple-600" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Total Peserta</p>
                                                            <p className="text-sm font-semibold text-gray-800">{stats.total}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Rata-rata</p>
                                                            <p className="text-sm font-semibold text-gray-800">{stats.avgScore}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                                        <Trophy className="w-4 h-4 text-yellow-600" />
                                                        <div>
                                                            <p className="text-xs text-gray-600">Selesai</p>
                                                            <p className="text-sm font-semibold text-gray-800">{stats.completed}/{stats.total}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section - Action Button */}
                                            <div className="flex flex-col items-center justify-center">
                                                <button
                                                    onClick={() => openModal(quiz)}
                                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    Lihat Detail
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {quiz.detail_histories.length} peserta
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {renderPagination()}

            {/* Modal Detail Peserta */}
            {isModalOpen && selectedQuiz && (
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transition-transform duration-200 ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
                                    <div
                                        className="text-white/90 text-sm mt-1"
                                        dangerouslySetInnerHTML={{ __html: selectedQuiz.description }}
                                    />
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <p className="text-sm font-semibold text-gray-600">Total Peserta</p>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {calculateStats(selectedQuiz.detail_histories).total}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <p className="text-sm font-semibold text-gray-600">Rata-rata Nilai</p>
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">
                                        {calculateStats(selectedQuiz.detail_histories).avgScore}%
                                    </p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                        <p className="text-sm font-semibold text-gray-600">Selesai</p>
                                    </div>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {calculateStats(selectedQuiz.detail_histories).completed}/{calculateStats(selectedQuiz.detail_histories).total}
                                    </p>
                                </div>
                            </div>

                            {/* Participant List */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Daftar Peserta
                                </h3>
                                <div className="space-y-3">
                                    {selectedQuiz.detail_histories.map((detail, index) => {
                                        const statusInfo = getStatusLabel(detail.status_category);
                                        return (
                                            <div
                                                key={detail.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">{detail.student_name}</p>
                                                        <p className="text-sm text-gray-600">{detail.class}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-800">
                                                            {detail.score}/{detail.max_score}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{detail.percentage.toFixed(1)}%</p>
                                                    </div>

                                                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>

                                                    <div className="flex flex-col items-end gap-1 min-w-[140px]">
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Mulai: {detail.started_at}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Selesai: {detail.completed_at}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}