"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useClassStore } from "@/stores/useClassStore";
import { toastSuccess, toastError } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateKelasPage() {
  const router = useRouter();
  const createClass = useClassStore((state) => state.createClass);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name_class: "", grade: "", teacher: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!form.name_class || !form.grade || !form.teacher) {
      toastError("Semua field wajib diisi!");
      return;
    }

    try {
      await createClass(form);
      toastSuccess("Kelas berhasil dibuat.");
      router.push("/admin/kelas");
    } catch (error: any) {
      toastError(error.message || "Terjadi kesalahan saat membuat kelas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tambah Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Nama Kelas</label>
              <Input
                name="name_class"
                value={form.name_class}
                onChange={handleChange}
                placeholder="Contoh: Kelas A"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Grade</label>
              <Input
                name="grade"
                value={form.grade}
                onChange={handleChange}
                placeholder="Contoh: 7"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Wali Kelas</label>
              <Input
                name="teacher"
                value={form.teacher}
                onChange={handleChange}
                placeholder="Contoh: Ibu Siti"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
