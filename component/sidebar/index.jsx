"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import { toast } from "react-toastify";
import { initClientKeys } from "@/utils/clientCrypto";
import { useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  useEffect(() => {
    initClientKeys();
  }, []);
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      toast.success("Logged out successfully");

      router.replace("/");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link
            href="/dashboard/countries"
            className="block hover:text-green-400"
          >
            Countries
          </Link>

          <Link href="/dashboard/states" className="block hover:text-green-400">
            States
          </Link>

          <Link
            href="/dashboard/districts"
            className="block hover:text-green-400"
          >
            Districts
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 transition cursor-pointer text-white px-4 py-2 rounded mt-6"
      >
        Logout
      </button>
    </div>
  );
}
