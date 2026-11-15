import React from 'react';
import { Play, Edit3, Flame } from 'lucide-react';
import { Sankalp, Sadhana } from '../types';
import { sound } from '../utils/audio';
import { formatVowParagraph } from './VowsHistoryList';

interface ContemplationScreenProps {
  sankalp: Sankalp;
  sadhana: Sadhana;
  onBeginChanting: () => void;
  onOpenSankalp: () => void;
  soundEnabled: boolean;
}

export const ContemplationScreen: React.FC<ContemplationScreenProps> = ({
  sankalp,
  sadhana,
  onBeginChanting,
  onOpenSankalp,
  soundEnabled,
}) => {
  const { what, whyClause, how } = formatVowParagraph(sankalp);

  return (
    <div className="bg-black text-[#e7e9ea] py-4 sm:py-6 px-4 sm:px-8 max-w-4xl mx-auto w-full pb-6 select-none">
      {/* Top Header */}
      <div className="flex items-end justify-between border-b border-[#2f3336] pb-3.5 sm:pb-4 mb-4 sm:mb-6">
        <div>
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#ffd400] tracking-wider uppercase block">
            Today’s Practice
          </span>
          <h1 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-tight mt-0.5">
            Day {sadhana.currentDay} of {sadhana.totalDaysTarget}
          </h1>
        </div>

        {sadhana.streak > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#16181c] border border-[#2f3336] text-[14px] font-semibold text-white tabular-nums">
            <Flame className="w-4 h-4 text-[#ffd400] fill-[#ffd400]" />
            <span>{sadhana.streak}d streak</span>
          </div>
        )}
      </div>

      {/* Focused Sankalp Reading Card + Single Primary CTA */}
      <div className="space-y-4 sm:space-y-5">
        <div className="p-5 sm:p-7 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#ffd400] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd400]" />
              Your Sankalp
            </span>

            <button
              type="button"
              onClick={onOpenSankalp}
              className="text-[#9ca3ab] hover:text-white transition-colors text-[14px] font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <p className="text-[19px] sm:text-[23px] text-[#e5e7eb] leading-relaxed sm:leading-[1.68] font-normal tracking-tight whitespace-pre-wrap break-words">
            My goal is to <span className="text-white font-semibold">{what}</span>, <span className="text-[#f5f5f7]">{whyClause}</span>. Every day, I will <span className="text-[#f5f5f7]">{how}</span>.
          </p>

          <div className="pt-3.5 border-t border-[#2f3336]/60 flex items-center justify-between text-[14px] text-[#9ca3ab]">
            <span>
              {sadhana.chantsPerDay} {sadhana.chantsPerDay === 1 ? 'chant' : 'chants'} today
            </span>
            {sadhana.chantsPerDay > 1 && (
              <span className="tabular-nums font-medium">
                {sadhana.todayChantsDone} of {sadhana.chantsPerDay} done
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (soundEnabled) sound.playMalaClick(0.2);
            onBeginChanting();
          }}
          className="w-full h-13 sm:h-14 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[17px] sm:text-[18px] transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-[#ffd400]/15 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>
            Begin Chanting
            {sadhana.chantsPerDay > 1 ? ` (${sadhana.chantsPerDay} Chants)` : ''}
          </span>
        </button>
      </div>
    </div>
  );
};
