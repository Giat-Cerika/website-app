"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { toastSuccess, toastError } from "@/lib/toast";

export default function CreateMateriPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        video_path: videoPath,
        Title: title,
        Description: description,
      };

      await axiosInstance.post("/video/create", payload);

      toastSuccess("Video berhasil ditambahkan");

      setTitle("");
      setDescription("");
      setVideoPath("");

      router.push("/admin/video");
    } catch (error: any) {
      toastError(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Tambah Materi Baru
          </CardTitle>
        </CardHeader>
        < CardContent >
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Judul Materi
              </label>
              <Input
                placeholder="Masukkan judul materi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Deskripsi
              </label>
              <Textarea
                placeholder="Masukkan deskripsi materi"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Link Video (YouTube / Google Drive)
              </label>
              <Input
                placeholder="https://example.com/video"
                value={videoPath}
                onChange={(e) => setVideoPath(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Menyimpan..." : "Simpan Materi"}
            </Button>

          </form>
        </CardContent >
      </Card >
    </div >

  );
}
