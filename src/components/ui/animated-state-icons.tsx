"use client";

/**
 * Animated State Icons (framer-motion).
 * Diadaptasi dari komponen "animated-state-icons":
 *  - Prop `state` (opsional) membuat ikon DIKONTROL dari luar (mis. sedang memutar musik,
 *    sudah tersalin, sedang mengirim). Jika `state` tidak diberikan, ikon bergantian otomatis.
 *  - Hanya ikon yang dipakai di undangan yang disertakan.
 */

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StateIconProps {
  size?: number;
  color?: string;
  className?: string;
  /** Dipakai hanya saat `state` tidak diberikan (mode demo otomatis). */
  duration?: number;
  /** Kontrol manual: true = keadaan kedua (selesai / tersalin / terkirim / terbuka ...). */
  state?: boolean;
}

function useToggle(state: boolean | undefined, interval: number) {
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (state !== undefined) return;
    const id = setInterval(() => setAuto((v) => !v), interval);
    return () => clearInterval(id);
  }, [state, interval]);
  return state ?? auto;
}

const svgBase = (size: number) => ({ width: size, height: size });

/* ─── LOADING → SUCCESS ─── lingkaran berputar berubah jadi centang */
export function SuccessIcon({ size = 40, color = "currentColor", className, duration = 2200, state }: StateIconProps) {
  const done = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <motion.circle
        cx="20"
        cy="20"
        r="16"
        stroke={color}
        strokeWidth={2}
        animate={done ? { pathLength: 1, opacity: 1 } : { pathLength: 0.7, opacity: 0.4 }}
        transition={{ duration: 0.5 }}
      />
      {!done && (
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="25 75"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "20px 20px" }}
        />
      )}
      <motion.path
        d="M12 20l6 6 10-12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={done ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: done ? 0.2 : 0 }}
      />
    </svg>
  );
}

/* ─── PLAY → PAUSE ─── (state=true menampilkan tombol jeda, yaitu saat sedang diputar) */
export function PlayPauseIcon({ size = 40, color = "currentColor", className, duration = 2400, state }: StateIconProps) {
  const playing = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.g
            key="pause"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ transformOrigin: "20px 20px" }}
          >
            <rect x="12" y="10" width="5" height="20" rx="1.5" fill={color} />
            <rect x="23" y="10" width="5" height="20" rx="1.5" fill={color} />
          </motion.g>
        ) : (
          <motion.g
            key="play"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ transformOrigin: "20px 20px" }}
          >
            <polygon points="14,10 30,20 14,30" fill={color} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ─── LOCK → UNLOCK ─── gembok terbuka */
export function LockUnlockIcon({ size = 40, color = "currentColor", className, duration = 2600, state }: StateIconProps) {
  const unlocked = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <rect x="9" y="18" width="22" height="16" rx="3" stroke={color} strokeWidth={2} />
      <motion.path
        d="M14 18V13a6 6 0 0112 0v5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        animate={unlocked ? { d: "M14 18V13a6 6 0 0112 0v2" } : { d: "M14 18V13a6 6 0 0112 0v5" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      />
      <motion.circle
        cx="20"
        cy="26"
        r="2"
        fill={color}
        animate={unlocked ? { scale: 0.6, opacity: 0.4 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}

/* ─── COPY → COPIED ─── papan klip dengan centang */
export function CopiedIcon({ size = 40, color = "currentColor", className, duration = 2200, state }: StateIconProps) {
  const copied = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <rect x="12" y="10" width="18" height="22" rx="2" stroke={color} strokeWidth={2} />
      <path
        d="M10 14h-0a2 2 0 00-2 2v18a2 2 0 002 2h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.3}
      />
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.path
            key="check"
            d="M16 21l4 4 6-8"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.g
            key="lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="17" y1="18" x2="25" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="23" x2="25" y2="23" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="28" x2="22" y2="28" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ─── HEART → FILLED ─── hati terisi dengan memantul */
export function HeartIcon({
  size = 40,
  color = "currentColor",
  filledColor = "#EF4444",
  className,
  duration = 2000,
  state,
}: StateIconProps & { filledColor?: string }) {
  const filled = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <motion.path
        d="M20 34s-12-7.5-12-16a7.5 7.5 0 0112-6 7.5 7.5 0 0112 6c0 8.5-12 16-12 16z"
        stroke={filled ? filledColor : color}
        strokeWidth={2}
        fill={filled ? filledColor : "none"}
        animate={filled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        style={{ transformOrigin: "20px 22px" }}
      />
    </svg>
  );
}

/* ─── SEND ─── pesawat kertas terbang lalu kembali */
export function SendIcon({ size = 40, color = "currentColor", className, duration = 2600, state }: StateIconProps) {
  const sent = useToggle(state, duration);
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("", className)} style={svgBase(size)} aria-hidden>
      <motion.g
        animate={sent ? { x: 30, y: -30, opacity: 0, scale: 0.5 } : { x: 0, y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <path d="M34 6L16 20l-6-2L34 6z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        <path d="M34 6L22 34l-6-14" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        <line x1="16" y1="20" x2="22" y2="34" stroke={color} strokeWidth={2} />
      </motion.g>
    </svg>
  );
}
