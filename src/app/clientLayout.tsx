"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token && !pathname.startsWith("/auth/login")) {
      router.replace("/auth/login");
    }

    if (token && pathname.startsWith("/auth/login")) {
      router.replace("/admin/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
