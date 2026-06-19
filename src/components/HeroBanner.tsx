'use client';

import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f5ede0] via-[#faf9f5] to-[#f0d6de] min-h-[60vh] sm:min-h-[70vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#d48e66]/15 animate-pulse" />
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-[#d48e66]/10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-16 left-1/4 w-24 h-24 rounded-full bg-[#b8c8d8]/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-10 w-12 h-12 rotate-12">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#d48e66]/30">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 rotate-12">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#d48e66]/20">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-white/20" />
        <div className="absolute bottom-1/3 left-10 w-6 h-6 rounded-full bg-[#b8c8d8]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#4a3730] leading-tight mb-4">
          Little Treasures,{' '}
          <span className="text-[#d48e66]">
            Big Joy
          </span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#6a5a4e] max-w-2xl mx-auto mb-8 leading-relaxed">
          Discover our enchanting collection of kids accessories — from sparkly hair clips to cozy bows.
          Every piece made with love for your little treasure.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d48e66] text-white font-semibold rounded-full text-base sm:text-lg shadow-lg hover:bg-[#c07850] hover:shadow-xl transition-all"
        >
          Shop Now
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
