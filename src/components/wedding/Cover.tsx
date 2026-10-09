import coverImg from "@/assets/cover.jpg";

export function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  return (
    <div className="scene relative h-[100dvh] w-full overflow-hidden">
      <img
        src={coverImg}
        alt="Foto prewedding Shopia dan Nathan"
        width={1024}
        height={1536}
        className="animate-kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-between px-8 py-14 text-center">
        <div className="animate-rise">
          <p className="font-sans text-[0.62rem] tracking-[0.42em] text-cream/80">
            WEDDING INVITATION
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-[0.06em] text-cream">
            Shopia &amp; Nathan
          </h1>
        </div>

        <div className="animate-rise-slow space-y-3">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] text-cream/70">
            KEPADA YTH. BAPAK/IBU/SAUDARA/I
          </p>
          <p className="font-display text-2xl text-cream">{guest}</p>
          <p className="mx-auto max-w-xs font-sans text-[0.6rem] leading-relaxed tracking-[0.14em] text-cream/60">
            Mohon maaf jika ada kesalahan penulisan nama dan gelar
          </p>
          <button onClick={onOpen} className="btn-outline sheen mt-4">
            OPEN INVITATION
          </button>
        </div>
      </div>
    </div>
  );
}
