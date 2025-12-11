"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FileText,
  User,
  TrendingUp,
  BookOpen,
  Video,
  LogOut,
  Newspaper,
  Building2,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("");

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FileText, label: "Informasi Kesehatan Gigi", path: "/admin/informasi" },
    { icon: Building2, label: "Kelas", path: "/admin/kelas" },
    { icon: Newspaper, label: "Kategori Kuis", path: "/admin/kategori" },
    { icon: TrendingUp, label: "Prediksi Karies", path: "/admin/prediksi" },
    { icon: BookOpen, label: "Materi", path: "/admin/materi" },
    { icon: Video, label: "Video Pembelajaran", path: "/admin/video" },
    { icon: User, label: "Profile", path: "/admin/profile" },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => pathname.startsWith(item.path));
    if (current) setActiveMenu(current.label);
  }, [pathname]);

  const handleNavigation = (label: string, path: string) => {
    setActiveMenu(label);
    router.push(path);
  };

  return (
    <aside
      className={`${
        isOpen ? "w-60" : "w-0"
      } bg-gradient-to-b from-blue-500 to-cyan-500 text-white transition-all duration-300 overflow-hidden shadow-xl relative flex flex-col`}
    >
      <div className="p-4 flex items-center gap-3 border-b border-white/20">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <img
            src="/giat.jpeg"
            alt="Logo"
            className="w-9 h-9 object-contain rounded-full"
          />
        </div>
        <h1 className="text-lg font-semibold leading-tight">GIAT CERIKA</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scroll">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.label;

          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.label, item.path)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${
                isActive
                  ? "bg-white text-blue-600 shadow-md"
                  : "hover:bg-white/15 hover:translate-x-1"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r-md"></span>
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-blue-600" : "text-white"
                }`}
              />
              <span
                className={`truncate ${
                  isActive ? "text-blue-700 font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/20">
        <button
          onClick={() => {
            sessionStorage.clear();
            router.push("/auth/login");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
