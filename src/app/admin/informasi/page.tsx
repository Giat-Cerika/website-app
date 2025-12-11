"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function InformasiPage() {
  const initialData: Article[] = [
    {
      id: "1",
      title: "Cara Merawat Gigi Sehat",
      description:
        "Merawat gigi penting dilakukan sejak dini agar terhindar dari kerusakan dan infeksi. Berikut beberapa langkah sederhana...",
      created_by: "user-01",
      created_at: "2025-01-01T10:00:00Z",
      updated_at: "2025-01-01T10:00:00Z",
    },
    {
      id: "2",
      title: "Penyebab Gigi Berlubang",
      description:
        "Gigi berlubang disebabkan oleh bakteri yang berkembang di dalam mulut. Ketahui cara pencegahannya...",
      created_by: "user-02",
      created_at: "2025-02-14T09:30:00Z",
      updated_at: "2025-02-14T09:30:00Z",
    },
    {
      id: "3",
      title: "Tips Menyikat Gigi yang Benar",
      description:
        "Menyikat gigi harus dilakukan dengan cara yang benar agar hasilnya maksimal dan tidak merusak enamel...",
      created_by: "user-03",
      created_at: "2025-03-10T07:11:00Z",
      updated_at: "2025-03-10T07:11:00Z",
    },
  ];

  const [articles, setArticles] = useState<Article[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setArticles(initialData);
      return;
    }

    const filtered = initialData.filter((a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setArticles(filtered);
  }, [searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus artikel ini?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      alert("Artikel berhasil dihapus (dummy)");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Informasi Kesehatan Gigi
        </h2>
        <p className="text-gray-600">Kelola artikel kesehatan gigi</p>
      </div>

      {/* Search & Add Button */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Artikel
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  Info Gigi
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tidak ada artikel ditemukan</p>
        </div>
      )}
    </div>
  );
}
