"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) {
        toast.error("Full Name is required");
        return;
      }

      if (!form.email.trim()) {
        toast.error("Email is required");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        toast.error("Enter a valid email address");
        return;
      }

      if (!form.password.trim()) {
        toast.error("Password is required");
        return;
      }

      if (form.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      try {
        setLoading(true);

        const { data } = await API.post("/auth/register", form);

        toast.success(data.message);

        setForm({
          name: "",
          email: "",
          password: "",
        });

        router.push("/");
      } catch (error) {
        console.log(error);
        toast.error("Registration failed");
      } finally {
        setLoading(false);
      }
    },
    [form, router],
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer py-2 text-white rounded-lg flex items-center justify-center transition duration-300
    ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
  `}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have account?
          <Link href="/" className="text-green-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
