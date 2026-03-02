"use client";

export default function AboutHero() {
  return (
    <section
      className="relative flex min-h-[40vh] w-full items-center justify-center bg-gradient-to-br from-[#d9480f]/90 via-[#1c7ed6]/90 to-orange-500/90 px-4 py-20 md:py-28"
      aria-label="About Luxestate"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
          About Luxestate
        </h1>
        <p className="mt-4 text-lg text-white/95 md:text-xl">
          The modern property platform built for buyers, sellers, and admins.
          Search, chat, list, and manage—all in one place.
        </p>
      </div>
    </section>
  );
}
