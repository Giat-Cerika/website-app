"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Video,
  User,
  BarChart3,
  Edit,
  Smile,
  Clipboard,
  PlayCircle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    { label: "Total Artikel", value: "24", icon: FileText, color: "bg-blue-500" },
    { label: "Video Tutorial", value: "15", icon: Video, color: "bg-purple-500" },
    { label: "User Aktif", value: "1,234", icon: User, color: "bg-green-500" },
    { label: "Kuesioner", value: "89", icon: BarChart3, color: "bg-orange-500" },
  ];

  const dashboardCards = [
    {
      icon: FileText,
      title: "Informasi Kesehatan",
      desc: "Artikel & Tips Kesehatan Gigi",
      color: "from-blue-400 to-blue-600",
      count: "12",
      link: "/dashboard/informasi",
    },
    {
      icon: Edit,
      title: "Kuesioner",
      desc: "Isi Kuesioner Kesehatan",
      color: "from-cyan-400 to-cyan-600",
      count: "5",
      link: "/dashboard/kuisioner",
    },
    {
      icon: Smile,
      title: "Cek Kesehatan Gigi",
      desc: "Prediksi Karies Gigi",
      color: "from-teal-400 to-teal-600",
      count: "New",
      link: "/dashboard/prediksi",
    },
    {
      icon: Clipboard,
      title: "Materi Pembelajaran",
      desc: "Bahan Belajar & Edukasi",
      color: "from-purple-400 to-purple-600",
      count: "8",
      link: "/dashboard/materi",
    },
    {
      icon: PlayCircle,
      title: "Video Pembelajaran",
      desc: "Tutorial & Demonstrasi",
      color: "from-pink-400 to-pink-600",
      count: "15",
      link: "/dashboard/video",
    },
  ];

  const activities = [
    { action: "Artikel baru ditambahkan", time: "2 jam yang lalu", color: "bg-blue-500" },
    { action: "Video pembelajaran diupdate", time: "5 jam yang lalu", color: "bg-purple-500" },
    { action: "User baru mendaftar", time: "1 hari yang lalu", color: "bg-green-500" },
    { action: "Kuesioner baru dibuat", time: "2 hari yang lalu", color: "bg-orange-500" },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard,</h2>
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

      {/* Activity Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className={`${activity.color} w-3 h-3 rounded-full`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}