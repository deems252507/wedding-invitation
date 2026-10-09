"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store password in sessionStorage for API auth header
    sessionStorage.setItem("admin_password", password);
    // Quick validation by calling settings endpoint
    fetch("/api/settings", {
      headers: { "x-admin-password": password },
    })
      .then((res) => {
        if (res.ok || res.status === 200) {
          // PUT will actually check password; for now just navigate
          // We'll validate on first save
          router.push("/admin/dashboard");
        } else {
          setError("Password salah");
        }
      })
      .catch(() => {
        // Even if API fails (no DB yet), allow entry for demo
        router.push("/admin/dashboard");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Undangan Pernikahan
        </p>
        <label className="admin-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input mb-4"
          placeholder="Masukkan password admin"
          required
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-navy text-cream py-2.5 rounded font-medium hover:bg-navy/90 transition"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
