"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AutoTable from "@/components/ui/table";
import { useClassStore } from "@/stores/useClassStore";
import { toastSuccess, toastError } from "@/lib/toast";
import Swal from "sweetalert2";

export default function KelasPage() {
  const { classes, isLoading, fetchClasses, updateClass, deleteClass } = useClassStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openEditModal = (item: any) => {
    setEditItem(item);
    setIsOpen(true);
    setIsAnimating(true);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setEditItem(null);
    }, 200);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    const result = await Swal.fire({
      title: "Simpan perubahan?",
      text: "Apakah Anda yakin ingin menyimpan perubahan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await updateClass(editItem.id, editItem);
        toastSuccess("Data kelas berhasil diperbarui");
        fetchClasses();
        closeModal();
      } catch (error: any) {
        toastError(error.message || "Gagal memperbarui data kelas");
      }
    }
  };

  const handleDelete = async (item: any) => {
    if (!item) return;

    const result = await Swal.fire({
      title: "Hapus kelas?",
      text: `Apakah Anda yakin ingin menghapus kelas ${item.name_class}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteClass(item.id);
        toastSuccess("Data kelas berhasil dihapus");
        fetchClasses();
      } catch (error: any) {
        toastError(error.message || "Gagal menghapus kelas");
      }
    }
  };

  const fields = [
    { key: "name_class", label: "Nama Kelas" },
    { key: "grade", label: "Grade" },
    { key: "teacher", label: "Wali Kelas" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Kelas</h1>
        <a
          href="/admin/kelas/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" /> Tambah Kelas
        </a>
      </div>

      <AutoTable
        data={classes}
        fields={fields}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {isOpen && editItem && (
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-xl w-full max-w-md transition-transform duration-200 ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Kelas</h2>

            <div className="flex flex-col gap-3">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                Nama Kelas
              </span>
              <input
                className="w-full text-gray-700 p-2 border rounded-lg"
                value={editItem.name_class}
                onChange={(e) =>
                  setEditItem({ ...editItem, name_class: e.target.value })
                }
                placeholder="Nama Kelas"
              />

              <span className="text-gray-700 font-medium flex items-center gap-2">
                Grade
              </span>
              <input
                className="w-full text-gray-700 p-2 border rounded-lg"
                value={editItem.grade}
                onChange={(e) =>
                  setEditItem({ ...editItem, grade: e.target.value })
                }
                placeholder="Grade"
              />

              <span className="text-gray-700 font-medium flex items-center gap-2">
                Guru
              </span>
              <input
                className="w-full text-gray-700 p-2 border rounded-lg"
                value={editItem.teacher}
                onChange={(e) =>
                  setEditItem({ ...editItem, teacher: e.target.value })
                }
                placeholder="Wali Kelas"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
