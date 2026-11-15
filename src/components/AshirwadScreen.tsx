import React from 'react';
import { ArrowRight } from 'lucide-react';
import ashirwadImg from '../assets/images/hanuman_blessing_viewer_1794563458753.jpg';
import { sound } from '../utils/audio';

interface AshirwadScreenProps {
  dayNumber: number;
  streak: number;
  onContinue: () => void;
  soundEnabled: boolean;
}

export const AshirwadScreen: React.FC<AshirwadScreenProps> = ({
  dayNumber,
  streak,
  onContinue,
  soundEnabled,
}) => {
  return (
    <div className="h-dvh max-h-dvh overflow-hidden bg-black text-[#f5f5f7] max-w-5xl mx-auto w-full px-5 sm:px-8 py-5 sm:py-7 flex flex-col justify-between select-none relative">
      {/* Subtle Infinite Warm Aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[460px] sm:w-[620px] h-[460px] sm:h-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,212,0,0.09)_0%,rgba(255,212,0,0.03)_42%,transparent_72%)] blur-2xl animate-pulse-subtle" />
      </div>

      {/* Top Quiet Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[#2f3336]/40 pb-3 z-10">
        <span
          className="font-devanagari text-[16px] sm:text-[18px] text-[#ffd400] tracking-wide font-semibold"
          lang="hi"
        >
          ॥ श्री हनुमते नमः ॥
        </span>
        <span className="text-[13px] sm:text-[14px] font-medium text-[#a0a6ad] tabular-nums">
          Day {dayNumber} · {streak}d streak
        </span>
      </div>

      {/* Center: Seamless Direct Darshan — Shri Hanuman ji Blessing the Viewer */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 z-10">
        <div className="relative h-full max-h-[430px] sm:max-h-[490px] md:max-h-[520px] aspect-[3/4] flex items-center justify-center overflow-hidden">
          <img
            src={ashirwadImg}
            alt="Shri Hanuman ji offering Ashirwad"
            className="w-full h-full object-contain"
          />
          {/* Edge fade into pure black */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        <p
          className="font-devanagari text-[16px] sm:text-[18px] text-[#ffd400]/90 tracking-[0.08em] pt-2 shrink-0"
          lang="hi"
        >
          संकल्प सिद्धि
        </p>
      </div>

      {/* Bottom Quiet Primary Action */}
      <div className="shrink-0 pt-3 z-10 flex justify-center">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) sound.playMalaClick(0.2);
            onContinue();
          }}
          className="w-full sm:w-auto sm:min-w-[260px] h-13 px-8 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[16px] sm:text-[17px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(255,212,0,0.18)] cursor-pointer"
        >
          <span>Pranam</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
