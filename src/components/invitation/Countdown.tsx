"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () => {
      const now = new Date();
      if (now >= target) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: differenceInDays(target, now),
        hours: differenceInHours(target, now) % 24,
        minutes: differenceInMinutes(target, now) % 60,
        seconds: differenceInSeconds(target, now) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="font-cormorant text-3xl md:text-4xl font-semibold text-cream tabular-nums">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="font-poppins text-[10px] tracking-[1.8px] uppercase text-cream/60 mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
