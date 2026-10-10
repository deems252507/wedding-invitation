"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { useWeddingData } from "@/lib/WeddingContext";

/**
 * Hero sinematik: foto pasangan membesar saat digulir.
 * Foto khusus diatur di admin (Umum → Foto zoom). Jika kosong: foto hero ke-2, galeri, lalu hero utama.
 * Tidak dirender jika admin belum mengunggah foto.
 */
export function Expand() {
  const d = useWeddingData();
  const src =
    d.expandPhoto || d.heroPhotos[1] || d.gallery[0]?.image || d.heroPhoto || d.coverPhoto || "";
  if (!src) return null;
  return (
    <ScrollExpandMedia
      id="beranda-zoom"
      mediaType="image"
      mediaSrc={src}
      title={d.brideName}
      titleEnd={d.groomName}
      date={d.weddingDateLabel}
    />
  );
}
