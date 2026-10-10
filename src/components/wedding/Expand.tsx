"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { useWeddingData } from "@/lib/WeddingContext";

/**
 * Hero sinematik: foto pasangan membesar saat digulir.
 * Foto diambil dari data admin (foto hero ke-2, lalu galeri, lalu foto hero utama).
 * Tidak dirender jika admin belum mengunggah foto.
 */
export function Expand() {
  const d = useWeddingData();
  const src = d.heroPhotos[1] || d.gallery[0]?.image || d.heroPhoto || d.coverPhoto || "";
  if (!src) return null;
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc={src}
      title={d.brideName}
      titleEnd={d.groomName}
      date={d.weddingDateLabel}
    />
  );
}
