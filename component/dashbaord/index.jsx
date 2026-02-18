"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../sidebar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        {pathname === "/dashboard" && (
          <h1 className="text-3xl font-bold p-8">Dashboard</h1>
        )}

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
