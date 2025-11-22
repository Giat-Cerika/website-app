"use client";

import { useEffect, useState } from "react";
import { User, Mail, Calendar, Shield, Loader2 } from "lucide-react";
// import Swal from "sweetalert2";

interface Profile {
  name: string;
  username: string;
  role: string;
  created_at: string;
  photo?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
        //   Swal.fire("Error", "Anda belum login!", "error");
          return;
        }

        const res = await fetch(`http://localhost:8080/api/v1/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil profil");
        }

        const data = await res.json();
        setProfile(data.data || data);
      } catch (error) {
        // Swal.fire("Gagal", "Tidak dapat memuat profil pengguna", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Tidak ada data profil ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <img
            src={profile.photo || "/default-avatar.png"}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-600">{profile.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <User className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-gray-600 text-sm">Nama Lengkap</p>
            <p className="font-semibold text-gray-800">{profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <Mail className="w-6 h-6 text-cyan-500" />
          <div>
            <p className="text-gray-600 text-sm">Username</p>
            <p className="font-semibold text-gray-800">{profile.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <Shield className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-gray-600 text-sm">Peran</p>
            <p className="font-semibold text-gray-800 capitalize">{profile.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <Calendar className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-gray-600 text-sm">Bergabung Sejak</p>
            <p className="font-semibold text-gray-800">
              {new Date(profile.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
