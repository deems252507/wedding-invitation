"use client";

import { useInView } from "@/components/ui/image-text-reveal";

/** Garis emas dengan berlian kecil di tengah; garisnya "menggambar" diri saat masuk layar. */
export function Ornament({ className = "" }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6);
  return (
    <div
      ref={ref}
      aria-hidden
      className={`orn ${inView ? "orn-in" : ""} ${className}`}
    >
      <span className="orn-dot" />
    </div>
  );
}
