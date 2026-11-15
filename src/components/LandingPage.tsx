import React from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface LandingPageProps {
  onBeginJourney: () => void;
  onOpenHelp: () => void;
  hasExistingSankalp: boolean;
  onContinueExisting?: () => void;
  soundEnabled: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onBeginJourney,
  onOpenHelp,
  hasExistingSankalp,
  onContinueExisting,
  soundEnabled,
}) => {
  return (
    <div className="h-dvh max-h-dvh bg-black text-[#e7e9ea] flex flex-col justify-between pt-4 sm:pt-5 pb-5 sm:pb-8 px-5 sm:px-8 max-w-5xl mx-auto w-full select-none relative overflow-hidden">
      {/* Subtle Warm Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-[radial-gradient(ellipse,rgba(255,212,0,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[#2f3336]/40 pb-3 shrink-0 z-10">
        <span className="font-bold text-[20px] sm:text-[22px] text-white tracking-tight">
          Sankalp
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) sound.playMalaClick(0.15);
              onOpenHelp();
            }}
            className="text-[14px] sm:text-[15px] text-[#a0a6ad] hover:text-[#ffd400] transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2f3336]/70 hover:border-[#ffd400]/40 cursor-pointer font-medium"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>

          {hasExistingSankalp && onContinueExisting && (
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) sound.playMalaClick(0.15);
                onContinueExisting();
              }}
              className="text-[14px] sm:text-[15px] font-semibold text-[#ffd400] hover:text-[#ffe247] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Center Hero - Grounded cohesive card on mobile, 2-column editorial layout on tablet/desktop */}
      <main className="my-auto py-2 z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-center">
        {/* Left / Primary Column */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5">
          {/* Artistic Devanagari Jai Shri Ram Lockup */}
          <div className="flex flex-col items-center md:items-start gap-1.5 shrink-0">
            <svg
              width="44"
              height="14"
              viewBox="0 0 44 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="opacity-85"
            >
              <path
                d="M2 7H15.5M28.5 7H42"
                stroke="url(#goldLine)"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <path
                d="M22 1.5L25 7L22 12.5L19 7L22 1.5Z"
                stroke="#ffd400"
                strokeOpacity="0.8"
                strokeWidth="1"
                fill="#ffd400"
                fillOpacity="0.16"
              />
              <defs>
                <linearGradient id="goldLine" x1="2" y1="7" x2="42" y2="7" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffd400" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#ffd400" stopOpacity="0.65" />
                  <stop offset="1" stopColor="#ffd400" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div
              className="font-devanagari-display text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.22] tracking-[0.03em] bg-gradient-to-b from-[#fff2ad] via-[#ffd400] to-[#c99e00] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(255,212,0,0.18)]"
              lang="hi"
            >
              ॥ जय श्री राम ॥
            </div>

            <div className="w-24 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#ffd400]/45 to-transparent md:from-[#ffd400]/55 md:via-[#ffd400]/25 md:to-transparent" />
          </div>

          <div className="space-y-2.5">
            <h1 className="text-[30px] sm:text-[40px] lg:text-[46px] font-bold text-white tracking-tight leading-[1.12]">
              Clarity. Focus. Action.
            </h1>

            <p className="text-[16px] sm:text-[18px] text-[#a0a6ad] font-normal max-w-md mx-auto md:mx-0 leading-relaxed">
              A calm daily habit built around your goal and Shri Hanuman Chalisa.
            </p>
          </div>

          {/* Desktop/Tablet Primary CTA */}
          <div className="hidden md:block pt-2 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) sound.playMalaClick(0.2);
                onBeginJourney();
              }}
              className="w-full h-13 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[16px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,212,0,0.16)] cursor-pointer"
            >
              <span>Begin your journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Quiet Editorial Card on all screen sizes */}
        <div className="md:col-span-5 w-full">
          <div className="p-5 sm:p-6 md:p-7 rounded-3xl bg-[#16181c]/75 border border-[#2f3336] space-y-4 md:space-y-5 text-left">
            <div className="text-[13px] font-semibold uppercase tracking-widest text-[#ffd400]">
              Daily Practice
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 text-[15px] sm:text-[16px] md:text-[17px] text-[#e5e7eb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd400] shrink-0" />
                <span>Set one clear goal</span>
              </div>

              <div className="flex items-center gap-3 text-[15px] sm:text-[16px] md:text-[17px] text-[#e5e7eb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd400] shrink-0" />
                <span>Chant every morning and night</span>
              </div>

              <div className="flex items-center gap-3 text-[15px] sm:text-[16px] md:text-[17px] text-[#e5e7eb]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd400] shrink-0" />
                <span>Turn quiet thought into steady action</span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#2f3336]/70">
              <p className="text-[14px] sm:text-[15px] text-[#9ca3ab] font-devanagari leading-relaxed">
                दुर्गम काज जगत के जेते ।<br />
                सुगम अनुग्रह तुम्हरे तेते ॥
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Action Bar */}
      <footer className="md:hidden shrink-0 z-10 w-full pt-2">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) sound.playMalaClick(0.2);
            onBeginJourney();
          }}
          className="w-full h-13 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[17px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,212,0,0.16)] cursor-pointer"
        >
          <span>Begin your journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Subtle Footer Spacer on Tablet/Desktop */}
      <div className="hidden md:flex items-center justify-between text-[13px] text-[#8e949a] border-t border-[#2f3336]/30 pt-3 shrink-0 z-10">
        <span>Private & offline</span>
        <span>Hanuman Chalisa · Sankalp</span>
      </div>
    </div>
  );
};
