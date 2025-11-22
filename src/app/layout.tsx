import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giat Cerika",
  description: "Sistem login Giat Cerika",
  icons: {
    icon: "/giat.jpeg",
    shortcut: "/giat.jpeg",
    apple: "/giat.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/giat.jpeg" type="image/jpeg" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
