"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Plus, X } from "lucide-react";
import AutoTable from "@/components/ui/Table";

interface Materi {
    id: string;
    title: string;
    description: string;
    created_at: string;
    created_by: string;
}

export default function MateriPage() {
    const initialMateri: Materi[] = [
        {
            id: "1",
            title: "Pengenalan Kesehatan Gigi",
            description: "Materi dasar struktur gigi.",
            created_by: "user-01",
            created_at: "2025-01-01",
        },
        {
            id: "2",
            title: "Penyakit Gigi",
            description: "Pembahasan karies & gingivitis.",
            created_by: "user-02",
            created_at: "2025-02-12",
        },
    ];

    const [materi, setMateri] = useState(initialMateri);

    // === FIELD YANG BISA DIUBAH ===
    const fields = [
        { key: "title", label: "Judul Materi" },
        { key: "description", label: "Deskripsi" },
        { key: "created_at", label: "Dibuat Pada" },
    ];

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selected, setSelected] = useState<Materi | null>(null);

    const handleDelete = (item: Materi) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Materi akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53935",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                setMateri((prev) => prev.filter((m) => m.id !== item.id));
                Swal.fire("Terhapus!", "Materi berhasil dihapus.", "success");
            }
        });
    };

    const handleEdit = (item: Materi) => {
        setSelected(item);
        setIsEditOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selected) return;

        setMateri((prev) =>
            prev.map((m) => (m.id === selected.id ? selected : m))
        );

        Swal.fire(
            "Berhasil!",
            "Data materi berhasil diperbarui.",
            "success"
        );
        setIsEditOpen(false);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Materi Pembelajaran</h1>

                <a
                    href="/admin/materi/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition"
                >
                    <Plus className="w-5 h-5" /> Tambah Materi
                </a>
            </div>

            <AutoTable
                data={materi}
                fields={fields}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {isEditOpen && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Materi</h2>
                            <button onClick={() => setIsEditOpen(false)}>
                                <X className="w-6 h-6 text-gray-600 hover:text-black" />
                            </button>
                        </div>

                        <label className="block mb-3">
                            <span className="text-gray-700">Judul</span>
                            <input
                                type="text"
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                value={selected.title}
                                onChange={(e) =>
                                    setSelected({ ...selected, title: e.target.value })
                                }
                            />
                        </label>

                        <label className="block mb-3">
                            <span className="text-gray-700">Deskripsi</span>
                            <textarea
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                                rows={4}
                                value={selected.description}
                                onChange={(e) =>
                                    setSelected({
                                        ...selected,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
