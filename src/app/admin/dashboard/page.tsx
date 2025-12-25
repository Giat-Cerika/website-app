"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FileText,
  Video,
  School,
  Edit,
  Smile,
  Clipboard,
  PlayCircle,
} from "lucide-react";
import { useMateriStore } from "@/stores/useMaterialStore";
import { useClassStore } from "@/stores/useClassStore";
import { useVideoStore } from "@/stores/useVideoStore";
import { useQuizStore } from "@/stores/useQuizStore";
import { usePredictionStore } from "@/stores/usePredictionStore";

export default function DashboardPage() {
  const router = useRouter();
  const fetchMateri = useMateriStore((s) => s.fetchMateri);
  const totalMateri = useMateriStore((s) => s.total);

  const fetchClass = useClassStore((s) => s.fetchClasses);
  const totalClass = useClassStore((s) => s.total);
  
  const fetchQuiz = useQuizStore((s) => s.fetchQuizes);
  const totalQuiz = useQuizStore((s) => s.total);

  const fetchVideo = useVideoStore((s) => s.fetchVideos);
  const totalVideo = useVideoStore((s) => s.total);
  
  const fetchPrediction = usePredictionStore((s) => s.fetchPredictions);
  const totalPrediction = usePredictionStore((s) => s.total);

    useEffect(() => {
      fetchMateri();
      fetchClass();
      fetchQuiz();
      fetchVideo();
      fetchPrediction();
    }, [fetchMateri, fetchClass, fetchQuiz, fetchVideo, fetchPrediction]);

  const stats = [
    { label: "Total Materi", value: totalMateri, icon: FileText, color: "bg-blue-500" },
    { label: "Video Edukasi", value: totalVideo, icon: Video, color: "bg-purple-500" },
    { label: "Kelas Aktif", value: totalClass, icon: School, color: "bg-green-500" },
    { label: "Total Kuis", value: totalQuiz, icon: Edit, color: "bg-orange-500" },
  ];

  const dashboardCards = [
    {
      icon: FileText,
      title: "Informasi Kesehatan",
      desc: "Artikel & Tips Kesehatan Gigi",
      color: "from-blue-400 to-blue-600",
      count: totalMateri,
      link: "/admin/materi",
    },
    {
      icon: Edit,
      title: "Kuis",
      desc: "Uji Pemahaman tentang Gigi",
      color: "from-cyan-400 to-cyan-600",
      count: totalQuiz,
      link: "/admin/kuis",
    },
    {
      icon: Smile,
      title: "Cek Kesehatan Gigi",
      desc: "Prediksi Karies Gigi",
      color: "from-teal-400 to-teal-600",
      count: totalPrediction,
      link: "/admin/data",
    },
    {
      icon: School,
      title: "Kelas Aktif",
      desc: "Daftar kelas yang aktif digunakan",
      color: "from-purple-400 to-purple-600",
      count: totalClass,
      link: "/admin/kelas",
    },
    {
      icon: PlayCircle,
      title: "Video Pembelajaran",
      desc: "Tutorial & Demonstrasi",
      color: "from-pink-400 to-pink-600",
      count: totalVideo,
      link: "/admin/video",
    },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Selamat datang di sistem informasi GIAT CERIKA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => router.push(card.link)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div
                className={`bg-gradient-to-br ${card.color} p-6 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-white/90 px-4 py-2 rounded-full">
                    <span className="font-bold text-sm text-blue-600">
                      {card.count}
                    </span>
                  </div>
                </div>

                <h3 className="text-white font-bold text-xl mb-2 relative z-10">
                  {card.title}
                </h3>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <p className="text-gray-600 mb-4">{card.desc}</p>
                <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                  Lihat Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </>
  );
}