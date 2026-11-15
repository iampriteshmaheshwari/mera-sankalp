import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ALL_CHALISA_SECTIONS,
  DHYANA_SHLOKA,
  OPENING_DOHAS,
  CHAUPAIS,
  CONCLUDING_DOHA,
  CONCLUDING_JAIKARA,
  ChalisaSection,
} from '../data/hanumanChalisa';
import { sound } from '../utils/audio';

interface ChantingSessionProps {
  currentChant: number; // 1-indexed
  totalChantsForDay: number;
  dayNumber: number;
  soundEnabled: boolean;
  initialScriptPref?: 'both' | 'hindi' | 'english';
  onToggleSound: () => void;
  onChantCompleted: () => void;
  onExitSession: () => void;
}

export const ChantingSession: React.FC<ChantingSessionProps> = ({
  currentChant,
  totalChantsForDay,
  dayNumber,
  soundEnabled,
  initialScriptPref = 'both',
  onToggleSound,
  onChantCompleted,
  onExitSession,
}) => {
  const [readingMode, setReadingMode] = useState<'scroll' | 'guided'>('scroll');
  const [scriptPref, setScriptPref] = useState<'hindi' | 'english' | 'both'>(initialScriptPref);
  const [verseIndex, setVerseIndex] = useState<number>(0);

  // Swipe gesture tracking refs for 100% reliable touch support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const sections: ChalisaSection[] = ALL_CHALISA_SECTIONS;
  const currentSection = sections[verseIndex] || sections[0];

  const handleFinishChantFlow = () => {
    if (soundEnabled) sound.playTempleBell(0.2);
    setVerseIndex(0);
    onChantCompleted();
  };

  const handleGuidedNext = () => {
    if (verseIndex < sections.length - 1) {
      setVerseIndex((prev) => prev + 1);
      if (soundEnabled) sound.playMalaClick(0.15);
    } else {
      handleFinishChantFlow();
    }
  };

  const handleGuidedPrev = () => {
    if (verseIndex > 0) {
      setVerseIndex((prev) => prev - 1);
      if (soundEnabled) sound.playMalaClick(0.15);
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    // Only fire if horizontal movement dominates and exceeds threshold
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        handleGuidedNext();
      } else {
        handleGuidedPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getSectionCategoryLabel = (section: ChalisaSection) => {
    switch (section.type) {
      case 'dhyana':
        return '॥ ध्यान श्लोक ॥';
      case 'doha':
        return '॥ दोहा ॥';
      case 'chaupai':
        return `॥ चौपाई ${section.number || ''} ॥`;
      case 'concluding_doha':
        return '॥ समापन दोहा ॥';
      case 'jaikara':
        return '॥ जयकारा ॥';
      default:
        return '';
    }
  };

  return (
    <div className="h-dvh min-h-dvh max-w-5xl mx-auto w-full flex flex-col justify-between pt-3 pb-5 px-4 sm:px-8 bg-black text-[#e7e9ea] overflow-hidden select-none relative">
      {/* Top Navigation Bar - Thoughtful Apple-grade un-wrapping header */}
      <header className="pb-3 border-b border-[#2f3336]/60 flex items-center justify-between gap-2 shrink-0 z-10">
        {/* Left: Exit */}
        <button
          onClick={onExitSession}
          className="h-9 px-3 rounded-full text-[#a0a6ad] hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-1.5 text-[15px] font-semibold cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        {/* Center: Unwrapped Progress */}
        <div className="text-center min-w-0 px-2">
          <div className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight whitespace-nowrap">
            Chant {currentChant} of {totalChantsForDay}
          </div>
          <div className="text-[13px] font-semibold text-[#ffd400] tracking-wider uppercase whitespace-nowrap">
            Day {dayNumber}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              const next: Record<string, 'hindi' | 'english' | 'both'> = {
                both: 'hindi',
                hindi: 'english',
                english: 'both',
              };
              setScriptPref(next[scriptPref]);
              if (soundEnabled) sound.playMalaClick(0.15);
            }}
            title="Toggle Hindi / English / Both"
            className="h-9 px-3 rounded-full border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition cursor-pointer flex items-center gap-1 bg-[#16181c]"
          >
            <span className="text-[#ffd400]">
              {scriptPref === 'hindi' && 'HI'}
              {scriptPref === 'english' && 'EN'}
              {scriptPref === 'both' && 'HI·EN'}
            </span>
          </button>

          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sound.playMalaClick(0.2);
            }}
            className="w-9 h-9 rounded-full border border-[#2f3336] text-[#a0a6ad] hover:text-white hover:border-[#ffd400] flex items-center justify-center transition cursor-pointer bg-[#16181c]"
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#ffd400]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8e949a]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Reading & Interaction Area */}
      <div className="flex-1 flex flex-col min-h-0 my-2">
        {/* Mode Switcher */}
        <div className="py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 bg-[#16181c] p-1 rounded-full border border-[#2f3336]">
            <button
              onClick={() => setReadingMode('scroll')}
              className={`px-3.5 py-1 rounded-full text-[13px] sm:text-[14px] font-semibold cursor-pointer ${
                readingMode === 'scroll'
                  ? 'bg-[#ffd400] text-black font-bold shadow-sm'
                  : 'text-[#a0a6ad] hover:text-white'
              }`}
            >
              All Verses
            </button>
            <button
              onClick={() => setReadingMode('guided')}
              className={`px-3.5 py-1 rounded-full text-[13px] sm:text-[14px] font-semibold cursor-pointer ${
                readingMode === 'guided'
                  ? 'bg-[#ffd400] text-black font-bold shadow-sm'
                  : 'text-[#a0a6ad] hover:text-white'
              }`}
            >
              Verse by Verse
            </button>
          </div>

          {readingMode === 'guided' && (
            <div className="text-[13px] sm:text-[14px] font-bold tabular-nums text-[#8e949a] flex items-center gap-1.5">
              <span className="text-[#ffd400]">{verseIndex + 1}</span>
              <span>/</span>
              <span>{sections.length}</span>
            </div>
          )}
        </div>

        {/* Verses Scroller or Guided Box */}
        <div className="flex-1 flex flex-col min-h-0 pt-1">
          {readingMode === 'scroll' ? (
            /* ALL VERSES SCROLL MODE */
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 pb-6">
              {/* 1. DHYANA SHLOKA */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px bg-[#2f3336] flex-1" />
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffd400] font-devanagari">
                    ॥ ध्यान श्लोक ॥
                  </span>
                  <div className="h-px bg-[#2f3336] flex-1" />
                </div>
                <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-2.5 text-center shadow-sm">
                  {scriptPref !== 'english' && (
                    <div className="font-devanagari text-[19px] sm:text-[21px] text-white leading-[1.7] font-medium">
                      {DHYANA_SHLOKA.hindi.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  {scriptPref !== 'hindi' && (
                    <div className="text-[15px] sm:text-[16px] text-[#a0a6ad] leading-relaxed">
                      {DHYANA_SHLOKA.english.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. OPENING DOHAS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px bg-[#2f3336] flex-1" />
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffd400] font-devanagari">
                    ॥ दोहा ॥
                  </span>
                  <div className="h-px bg-[#2f3336] flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {OPENING_DOHAS.map((doha) => (
                    <div
                      key={doha.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-2 text-center shadow-sm"
                    >
                      {scriptPref !== 'english' && (
                        <div className="font-devanagari text-[19px] sm:text-[21px] text-white leading-[1.7] font-medium">
                          {doha.hindi.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      )}
                      {scriptPref !== 'hindi' && (
                        <div className="text-[15px] sm:text-[16px] text-[#a0a6ad] leading-relaxed">
                          {doha.english.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. THE 40 CHAUPAIS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px bg-[#2f3336] flex-1" />
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffd400] font-devanagari">
                    ॥ चौपाई ॥
                  </span>
                  <div className="h-px bg-[#2f3336] flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {CHAUPAIS.map((chaupai) => (
                    <div
                      key={chaupai.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-2.5 hover:border-[#2f3336]/90 transition shadow-sm"
                    >
                      {scriptPref !== 'english' && (
                        <div className="font-devanagari text-[19px] sm:text-[21px] text-white leading-[1.7] font-medium">
                          {chaupai.hindi.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      )}
                      {scriptPref !== 'hindi' && (
                        <div className="text-[15px] sm:text-[16px] text-[#a0a6ad] leading-relaxed">
                          {chaupai.english.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. CONCLUDING DOHA */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px bg-[#2f3336] flex-1" />
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffd400] font-devanagari">
                    ॥ समापन दोहा ॥
                  </span>
                  <div className="h-px bg-[#2f3336] flex-1" />
                </div>
                <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-2.5 text-center shadow-sm">
                  {scriptPref !== 'english' && (
                    <div className="font-devanagari text-[19px] sm:text-[21px] text-white leading-[1.7] font-medium">
                      {CONCLUDING_DOHA.hindi.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  {scriptPref !== 'hindi' && (
                    <div className="text-[15px] sm:text-[16px] text-[#a0a6ad] leading-relaxed">
                      {CONCLUDING_DOHA.english.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. JAIKARA */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-px bg-[#2f3336] flex-1" />
                  <span className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffd400] font-devanagari">
                    ॥ जयकारा ॥
                  </span>
                  <div className="h-px bg-[#2f3336] flex-1" />
                </div>
                <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#ffd400]/25 space-y-2.5 text-center shadow-[0_0_25px_rgba(255,212,0,0.08)]">
                  {scriptPref !== 'english' && (
                    <div className="font-devanagari text-[20px] sm:text-[22px] text-[#ffd400] leading-[1.7] font-semibold">
                      {CONCLUDING_JAIKARA.hindi.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  {scriptPref !== 'hindi' && (
                    <div className="text-[15px] sm:text-[16px] text-white/90 leading-relaxed font-medium">
                      {CONCLUDING_JAIKARA.english.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* VERSE BY VERSE (GUIDED) */
            <div
              className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden py-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex-1 min-h-0 w-full p-5 sm:p-8 rounded-3xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between text-center shadow-lg relative overflow-hidden select-none">
                <div className="flex items-center justify-between text-[#ffd400] text-[14px] font-bold tracking-wider font-devanagari shrink-0">
                  <span>{getSectionCategoryLabel(currentSection)}</span>
                  <span className="text-[#8e949a] text-[13px] font-sans font-medium tabular-nums">
                    {verseIndex + 1} / {sections.length}
                  </span>
                </div>

                <div
                  key={currentSection.id}
                  className="my-auto py-2 sm:py-3 space-y-3 flex flex-col justify-center overflow-hidden"
                >
                  {scriptPref !== 'english' && (
                    <div className="font-devanagari text-[22px] sm:text-[28px] md:text-[32px] text-white font-semibold leading-relaxed tracking-wide">
                      {currentSection.hindi.map((l, i) => (
                        <p key={i}>{l}</p>
                      ))}
                    </div>
                  )}

                  {scriptPref !== 'hindi' && (
                    <div className="text-[16px] sm:text-[18px] text-[#a0a6ad] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
                      {currentSection.english.map((l, i) => (
                        <p key={i}>{l}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-[13px] text-[#8e949a] flex items-center justify-center gap-1 font-medium">
                  <span>‹ Swipe or tap below ›</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2.5 shrink-0">
                <button
                  onClick={handleGuidedPrev}
                  disabled={verseIndex === 0}
                  className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full border text-[15px] font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    verseIndex === 0
                      ? 'border-[#2f3336] text-[#8e949a] opacity-30 cursor-not-allowed'
                      : 'border-[#2f3336] text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleGuidedNext}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[15px] transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,212,0,0.2)] cursor-pointer"
                >
                  <span>
                    {verseIndex === sections.length - 1 ? 'Finish Chant' : 'Next Verse'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <footer className="shrink-0 pt-2 border-t border-[#2f3336]/60">
        <button
          onClick={handleFinishChantFlow}
          className="w-full py-3.5 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[16px] sm:text-[17px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,212,0,0.2)] cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {currentChant === totalChantsForDay ? 'Complete Final Chant' : 'Complete This Chant'}
          </span>
        </button>
      </footer>
    </div>
  );
};
