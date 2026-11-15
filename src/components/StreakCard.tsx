import React from 'react';
import { Flame, Edit3 } from 'lucide-react';
import { Sankalp, Sadhana } from '../types';
import { sound } from '../utils/audio';
import { formatVowParagraph } from './VowsHistoryList';

interface StreakCardProps {
  sankalp: Sankalp;
  sadhana: Sadhana;
  onOpenSankalp: () => void;
  onOpenAshirwad?: () => void;
  soundEnabled: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  sankalp,
  sadhana,
  onOpenSankalp,
  onOpenAshirwad,
  soundEnabled,
}) => {
  const percentComplete = Math.min(
    100,
    Math.round((sadhana.completedDays.length / sadhana.totalDaysTarget) * 100)
  );
  const { what, whyClause, how } = formatVowParagraph(sankalp);

  return (
    <div className="bg-black text-[#e7e9ea] py-4 sm:py-6 px-4 sm:px-8 max-w-5xl mx-auto w-full pb-6 select-none">
      {/* Top Banner */}
      <div className="flex items-end justify-between gap-4 border-b border-[#2f3336] pb-3.5 sm:pb-4 mb-4 sm:mb-6">
        <div>
          <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-[#ffd400] block">
            Done for Today
          </span>
          <h1 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mt-0.5 leading-tight">
            Day {sadhana.currentDay} of {sadhana.totalDaysTarget}
          </h1>
        </div>

        {onOpenAshirwad && (
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) sound.playMalaClick(0.15);
              onOpenAshirwad();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-full border border-[#ffd400]/35 text-[#ffd400] hover:bg-[#ffd400]/10 text-[13px] sm:text-[14px] font-semibold transition-colors cursor-pointer shrink-0"
          >
            Today’s Ashirwad
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Compact Streak & Progress */}
        <div className="md:col-span-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#ffd400]/10 border border-[#ffd400]/25 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-[#ffd400] fill-[#ffd400]" />
                </div>
                <div>
                  <div className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight leading-none tabular-nums">
                    {sadhana.streak}{' '}
                    <span className="text-[17px] sm:text-[19px] font-semibold text-[#ffd400]">
                      {sadhana.streak === 1 ? 'Day Streak' : 'Days Streak'}
                    </span>
                  </div>
                  {sadhana.highestStreak > sadhana.streak && (
                    <span className="text-[13px] text-[#9ca3ab] mt-1 block tabular-nums">
                      Best: {sadhana.highestStreak}d
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[15px] font-bold text-[#ffd400] tabular-nums shrink-0">
                {percentComplete}%
              </span>
            </div>

            <div className="w-full h-2 bg-[#2f3336] rounded-full overflow-hidden">
              <div
                style={{ width: `${percentComplete}%` }}
                className="h-full bg-[#ffd400] rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Single Clean Sankalp Card */}
        <div className="md:col-span-7">
          <div className="p-5 sm:p-7 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#ffd400] font-semibold uppercase tracking-widest flex items-center gap-2">
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

            <p className="text-[18px] sm:text-[21px] font-normal text-[#e5e7eb] leading-relaxed whitespace-pre-wrap break-words">
              My goal is to <span className="text-white font-semibold">{what}</span>, <span className="text-[#f5f5f7]">{whyClause}</span>. Every day, I will <span className="text-[#f5f5f7]">{how}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
