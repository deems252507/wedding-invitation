import { useWeddingData } from "@/lib/WeddingContext";

export function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  const d = useWeddingData();
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <img
        src={d.coverPhoto}
        alt="Foto prewedding"
        width={1024}
        height={1536}
        className="absolute inset-0 h-full w-full object-cover animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/75" />

      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-12 text-center text-cream">
        <div className="pt-6">
          <p className="animate-text-mask font-sans text-[0.58rem] tracking-[0.38em] text-cream/85">
            {d.coverTitle || "The Wedding of"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="animate-text-left font-script text-[3.4rem] leading-none tracking-wide text-cream drop-shadow-md sm:text-6xl">
            {d.brideName}
          </h1>
          <p className="animate-text-mask stagger-2 font-display text-2xl italic text-cream/90">
            &amp;
          </p>
          <h1 className="animate-text-right stagger-2 font-script text-[3.4rem] leading-none tracking-wide text-cream drop-shadow-md sm:text-6xl">
            {d.groomName}
          </h1>
          <p className="animate-text-mask stagger-3 mt-4 font-sans text-[0.58rem] tracking-[0.22em] text-cream/75">
            {d.weddingDateLabel}
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="animate-text-scale stagger-4 mt-8 inline-flex items-center gap-2 rounded-full border border-cream/50 bg-ink/40 px-6 py-2.5 font-sans text-[0.62rem] tracking-[0.2em] text-cream backdrop-blur-sm transition hover:bg-cream hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 12h16M12 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Buka Undangan
          </button>
        </div>

        <div className="animate-text-mask stagger-5 pb-2">
          <p className="font-sans text-[0.55rem] tracking-[0.28em] text-cream/60">Kepada</p>
          <p className="mt-1 font-display text-lg text-cream">{guest}</p>
        </div>
      </div>
    </div>
  );
}
