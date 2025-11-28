// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import axios from "axios";
// import Swal from "sweetalert2";

// export default function CreateMateriPage() {
//   const [judul, setJudul] = useState("");
//   const [deskripsi, setDeskripsi] = useState("");
//   const [link, setLink] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("/api/materi", {
//         judul,
//         deskripsi,
//         link,
//       });

//       Swal.fire({
//         title: "Berhasil!",
//         text: "Materi berhasil ditambahkan",
//         icon: "success",
//       });

//       setJudul("");
//       setDeskripsi("");
//       setLink("");
//     } catch (error) {
//       Swal.fire({
//         title: "Gagal!",
//         text: "Terjadi kesalahan saat menyimpan data",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle>Tambah Materi</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium">Judul Materi</label>
//               <Input
//                 placeholder="Masukkan judul"
//                 value={judul}
//                 onChange={(e) => setJudul(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Deskripsi</label>
//               <Textarea
//                 placeholder="Masukkan deskripsi materi"
//                 value={deskripsi}
//                 onChange={(e) => setDeskripsi(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Link Materi (Opsional)</label>
//               <Input
//                 placeholder="https://contoh.com/materi"
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//               />
//             </div>

//             <Button type="submit" disabled={loading} className="w-full">
//               {loading ? "Menyimpan..." : "Simpan"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export default function MateriCreate() {}
