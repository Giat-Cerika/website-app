"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
  User,
  Calendar,
  Target,
  TrendingUp,
  Send,
} from "lucide-react";
import AutoTable from "@/components/ui/table";
import { usePredictionStore } from "@/stores/usePredictionStore";
import { toastSuccess, toastError } from "@/lib/toast";
import Swal from "sweetalert2";

export default function PredictionsPage() {
  interface Student {
    id: string;
    name: string;
    username: string;
    nisn: string;
  }

  const {
    predictions,
    selectedPrediction,
    isLoading,
    fetchPredictions,
    deletePrediction,
    pagination,
  } = usePredictionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTLMModalOpen, setIsTLMModalOpen] = useState(false);
  const [isTLMAnimating, setIsTLMAnimating] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const per_page = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const STUDENT_ENDPOINT = "/student/all";
  const TLM_ENDPOINT = "/prediction/send-prediction";

  // TLM Form State
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [tlmForm, setTlmForm] = useState({
    student_id: "",
    suggestion: "",
  });
  const [isSendingTLM, setIsSendingTLM] = useState(false);

  useEffect(() => {
    fetchPredictions({ page, per_page, search: searchInput });
  }, [page, fetchPredictions]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setPage(1);
      fetchPredictions({ page: 1, per_page, search: searchInput });
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchInput, fetchPredictions, per_page]);

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const response = await fetch(`${API_BASE_URL}${STUDENT_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(data.data || data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toastError("Gagal memuat data Siswa");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const openViewModal = async (item: any) => {
    usePredictionStore.setState({ selectedPrediction: item });
    setIsModalOpen(true);
    setIsAnimating(true);
  };

  const openTLMModal = () => {
    if (!selectedPrediction) {
      toastError("Pilih data prediksi terlebih dahulu");
      return;
    }

    fetchStudents();
    setIsTLMModalOpen(true);
    setIsTLMAnimating(true);
    setTlmForm({ student_id: "", suggestion: "" });
  };

  const closeTLMModal = () => {
    setIsTLMAnimating(false);
    setTimeout(() => {
      setIsTLMModalOpen(false);
      setTlmForm({ student_id: "", suggestion: "" });
    }, 200);
  };

  const handleSendTLM = async () => {
    if (!selectedPrediction) {
      toastError("Data prediksi tidak ditemukan");
      return;
    }

    if (!tlmForm.student_id) {
      toastError("Pilih Siswa terlebih dahulu");
      return;
    }

    if (!tlmForm.suggestion.trim()) {
      toastError("Masukkan saran terlebih dahulu");
      return;
    }

    const result = await Swal.fire({
      title: "Kirim data?",
      text: "Yakin ingin mengirim data ini ke Siswa?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Ya, kirim!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setIsSendingTLM(true);

    try {
      const response = await fetch(`${API_BASE_URL}${TLM_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          prediction_id: selectedPrediction.id,
          user_id: tlmForm.student_id,
          suggestion: tlmForm.suggestion,
        }),
      });

      if (!response.ok) throw new Error("Gagal mengirim data");

      toastSuccess("Data berhasil dikirim");
      closeTLMModal();
    } catch (err: any) {
      toastError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSendingTLM(false);
    }
  };

  // Helper functions to get label from value
  const getAttitudeLabel = (value: number) => {
    const options = [
      { label: "A = No current disease", value: 1 },
      { label: "B = Need for repair, maintenance", value: 2 },
      { label: "C = Active disease", value: 3 },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getSalivaLabel = (key: string, value: number) => {
    const salivaOptions: { [key: string]: { label: string; value: number }[] } =
      {
        hydration: [
          { label: ">60 sec", value: 3 },
          { label: "30-60 sec", value: 2 },
          { label: "<30 sec", value: 1 },
        ],
        viscosity: [
          { label: "Sticky", value: 3 },
          { label: "Frothy", value: 2 },
          { label: "Watery", value: 1 },
        ],
        ph: [
          { label: "5.0-5.8", value: 3 },
          { label: "5.8-6.8", value: 2 },
          { label: "6.8-7.8", value: 1 },
        ],
        quantity: [
          { label: "<15 ml", value: 3 },
          { label: "15-50 ml", value: 2 },
          { label: ">50 ml", value: 1 },
        ],
        buffering: [
          { label: "0-5 pts", value: 3 },
          { label: "6-9 pts", value: 2 },
          { label: "10-12 pts", value: 1 },
        ],
      };
    return (
      salivaOptions[key]?.find((opt) => opt.value === value)?.label || value
    );
  };

  const getPlaqueLabel = (key: string, value: number) => {
    const plaqueOptions: { [key: string]: { label: string; value: number }[] } =
      {
        ph: [
          { label: "5.5", value: 3 },
          { label: "6.0-6.5", value: 2 },
          { label: "7.0", value: 1 },
        ],
        maturity: [
          { label: "BLUE STAIN", value: 3 },
          { label: "RED STAIN", value: 1 },
        ],
      };
    return (
      plaqueOptions[key]?.find((opt) => opt.value === value)?.label || value
    );
  };

  const getCariesHistoryLabel = (value: number) => {
    const options = [
      { label: "Tidak ada Riwayat", value: 1 },
      { label: "Karies Awal", value: 2 },
      { label: "Karies Aktif", value: 3 },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getDietLabel = (key: string, value: number) => {
    const dietOptions: { [key: string]: { label: string; value: number }[] } = {
      sugar: [
        { label: ">2", value: 3 },
        { label: ">1", value: 2 },
        { label: "Nil", value: 1 },
      ],
      acid: [
        { label: ">3", value: 3 },
        { label: ">2", value: 2 },
        { label: "<2", value: 1 },
      ],
    };
    return dietOptions[key]?.find((opt) => opt.value === value)?.label || value;
  };

  const getFluorideLabel = (value: number) => {
    const options = [
      { label: "Regular fluoride exposure", value: 1 },
      { label: "Occasional fluoride", value: 2 },
      { label: "No fluoride", value: 3 },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getModifyingFactorLabel = (value: number) => {
    const options = [
      { label: "Low risk factors", value: 1 },
      { label: "Moderate risk factors", value: 2 },
      { label: "High risk factors", value: 3 },
    ];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  };

  const handleDelete = async (item: any) => {
    const result = await Swal.fire({
      title: "Hapus prediksi?",
      text: `Yakin menghapus data prediksi untuk ${item.patient_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deletePrediction(item.id);
        toastSuccess("Data prediksi berhasil dihapus");

        if (predictions.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchPredictions({ page, per_page, search: searchInput });
        }
      } catch (error: any) {
        toastError(error.message || "Gagal menghapus prediksi");
      }
    }
  };

  const fields = [
    { key: "patient_name", label: "Nama Pasien" },
    { key: "age", label: "Umur" },
    { key: "date_of_evaluation", label: "Tanggal Evaluasi" },
    {
      key: "result",
      label: "Hasil",
      render: (value: string) => {
        const normalized = value.toLowerCase();

        const colorClass =
          normalized === "high"
            ? "bg-red-100 text-red-700"
            : normalized === "medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
          >
            {value}
          </span>
        );
      },
    },
    { key: "score", label: "Skor" },
    { key: "confidence", label: "Confidence" },
  ];

  const getRiskColor = (result: string) => {
    const r = result.toLowerCase();

    if (r === "high") return "from-red-500 to-red-600 border-red-700";
    if (r === "medium")
      return "from-yellow-500 to-yellow-600 border-yellow-700";
    return "from-green-500 to-green-600 border-green-700";
  };

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const currentPage = pagination.current_page;
    const totalPages = pagination.total_pages;
    const pages = [];

    const maxVisible = 10;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxVisible);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                disabled={isLoading}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium disabled:opacity-40"
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
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg border transition-all text-sm font-medium min-w-[40px] ${
                p === currentPage
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              } disabled:opacity-40`}
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
                disabled={isLoading}
                className="hidden sm:flex px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium disabled:opacity-40"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-sm text-gray-600 order-3 hidden sm:block">
          Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
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

        .loading-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6 animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Prediksi</h1>
      </div>

      <div className="mb-6 animate-fadeIn">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama pasien..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="animate-fadeIn">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchInput
                ? "Tidak ada hasil ditemukan"
                : "Belum ada data prediksi"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchInput
                ? `Tidak ditemukan prediksi dengan kata kunci "${searchInput}"`
                : "Belum ada riwayat prediksi caries risk"}
            </p>
          </div>
        ) : (
          <AutoTable
            data={predictions}
            fields={fields}
            onDelete={handleDelete}
            onView={openViewModal}
            page={page}
            perPage={per_page}
          />
        )}
      </div>

      {renderPagination()}

      {/* Detail Modal */}
      {isModalOpen && selectedPrediction && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-200 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-transform duration-200 ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detail Prediksi</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openTLMModal}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Data
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-600">
                      Nama Pasien
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedPrediction.patient_name || "-"}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-gray-600">Umur</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedPrediction.age} tahun
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-gray-600">
                      Tanggal Evaluasi
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedPrediction.date_of_evaluation}
                  </p>
                </div>
              </div>

              {/* Risk Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${getRiskColor(
                    selectedPrediction.result
                  )}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-white" />
                    <p className="text-sm font-semibold text-white/90">
                      Tingkat Risiko
                    </p>
                  </div>
                  <p className="text-4xl font-black text-white capitalize mb-2">
                    {selectedPrediction.result}
                  </p>
                  <p className="text-white/90 font-semibold">
                    Score: {selectedPrediction.score}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-white" />
                    <p className="text-sm font-semibold text-white/90">
                      Confidence
                    </p>
                  </div>
                  <p className="text-4xl font-black text-white mb-3">
                    {selectedPrediction.confidence}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(selectedPrediction.confidence_detail).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-white/20 p-2 rounded-lg"
                        >
                          <span className="font-semibold text-white capitalize">
                            {key}:
                          </span>
                          <span className="font-bold text-white">{value}%</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  Deskripsi & Rekomendasi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPrediction.description}
                </p>
              </div>

              {/* Caries Risk Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                  Detail Penilaian Risiko Karies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Attitude & Status
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {getAttitudeLabel(
                        selectedPrediction.caries_risk.attitude_and_status
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Caries History
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {getCariesHistoryLabel(
                        selectedPrediction.caries_risk.caries_history
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Fluoride
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {getFluorideLabel(
                        selectedPrediction.caries_risk.fluoride
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Modifying Factor
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {getModifyingFactorLabel(
                        selectedPrediction.caries_risk.modifying_factor
                      )}
                    </p>
                  </div>
                </div>

                {/* Diet */}
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <h4 className="font-bold text-gray-800 mb-3">Diet</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Sugar</p>
                      <p className="text-lg font-bold text-gray-800">
                        {getDietLabel(
                          "sugar",
                          selectedPrediction.caries_risk.diet.sugar
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Acid</p>
                      <p className="text-lg font-bold text-gray-800">
                        {getDietLabel(
                          "acid",
                          selectedPrediction.caries_risk.diet.acid
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plaque */}
                {selectedPrediction.caries_risk.plaque && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-bold text-gray-800 mb-3">Plaque</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedPrediction.caries_risk.plaque.ph && (
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="text-lg font-bold text-gray-800">
                            {getPlaqueLabel(
                              "ph",
                              selectedPrediction.caries_risk.plaque.ph
                            )}
                          </p>
                        </div>
                      )}
                      {selectedPrediction.caries_risk.plaque.maturity && (
                        <div>
                          <p className="text-sm text-gray-600">Maturity</p>
                          <p className="text-lg font-bold text-gray-800">
                            {getPlaqueLabel(
                              "maturity",
                              selectedPrediction.caries_risk.plaque.maturity
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Saliva */}
                {selectedPrediction.caries_risk.saliva && (
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <h4 className="font-bold text-gray-800 mb-3">Saliva</h4>
                    {selectedPrediction.caries_risk.saliva.resting_saliva && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Resting Saliva
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              Hydration
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "hydration",
                                selectedPrediction.caries_risk.saliva
                                  .resting_saliva.hydration
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              Viscosity
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "viscosity",
                                selectedPrediction.caries_risk.saliva
                                  .resting_saliva.viscosity
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">pH</p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "ph",
                                selectedPrediction.caries_risk.saliva
                                  .resting_saliva.ph
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedPrediction.caries_risk.saliva
                      .stimulated_saliva && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Stimulated Saliva
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              Quantity
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "quantity",
                                selectedPrediction.caries_risk.saliva
                                  .stimulated_saliva.quantity
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">pH</p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "ph",
                                selectedPrediction.caries_risk.saliva
                                  .stimulated_saliva.ph
                              )}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">
                              Buffering
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getSalivaLabel(
                                "buffering",
                                selectedPrediction.caries_risk.saliva
                                  .stimulated_saliva.buffering
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TLM Modal */}
      {isTLMModalOpen && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4 transition-opacity duration-200 ${
            isTLMAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeTLMModal}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl transition-transform duration-200 ${
              isTLMAnimating
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">
                    Kirim data prediksi ke Siswa
                  </h2>
                </div>
                <button
                  onClick={closeTLMModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info Preview */}
              {selectedPrediction && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Data Prediksi:
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Nama Pasien:</p>
                      <p className="font-bold text-gray-800">
                        {selectedPrediction.patient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tingkat Risiko:</p>
                      <p
                        className={`font-bold capitalize ${
                          selectedPrediction.result.toLowerCase() === "high"
                            ? "text-red-600"
                            : selectedPrediction.result.toLowerCase() ===
                              "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {selectedPrediction.result}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Score:</p>
                      <p className="font-bold text-gray-800">
                        {selectedPrediction.score}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal Evaluasi:</p>
                      <p className="font-bold text-gray-800">
                        {selectedPrediction.date_of_evaluation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Siswa <span className="text-red-500">*</span>
                </label>
                <select
                  value={tlmForm.student_id}
                  onChange={(e) =>
                    setTlmForm({ ...tlmForm, student_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-gray-800"
                  disabled={isLoadingStudents}
                >
                  <option value="">
                    {isLoadingStudents
                      ? "Memuat data Siswa..."
                      : "-- Pilih Siswa --"}
                  </option>
                  {students.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.nisn || student.student_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Suggestion Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Saran/Suggestion <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={tlmForm.suggestion}
                  onChange={(e) =>
                    setTlmForm({ ...tlmForm, suggestion: e.target.value })
                  }
                  placeholder="Masukkan saran untuk Siswa"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-800"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={closeTLMModal}
                  disabled={isSendingTLM}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendTLM}
                  disabled={
                    isSendingTLM ||
                    !tlmForm.student_id ||
                    !tlmForm.suggestion.trim()
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingTLM ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
