"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export default function ImageUpload({ label, value, onChange, folder = "photos" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getPass = () =>
    typeof window !== "undefined" ? sessionStorage.getItem("admin_password") || "" : "";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": getPass() },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload gagal");
        return;
      }
      onChange(data.url);
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="admin-label">{label}</label>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="w-32 h-32 object-cover rounded border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-navy hover:text-navy transition disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-xs">Upload</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
