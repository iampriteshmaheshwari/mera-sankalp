import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  History,
  Save,
  Sun,
  Moon,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Sankalp, Sadhana } from '../types';
import { sound } from '../utils/audio';

interface SankalpFullPageProps {
  sankalp: Sankalp;
  sadhana: Sadhana;
  onBack: () => void;
  onUpdateSankalpAndSadhana: (data: {
    why: string;
    how: string;
    chantsPerDay: number;
    totalDaysTarget: number;
    wakeTime: string;
    sleepTime: string;
    note?: string;
  }) => void;
  onRefineGoalWithoutReset: (
    newWhat: string,
    newWhy: string,
    newHow: string,
    note?: string
  ) => void;
  onResetWithNewGoal: (
    newWhat: string,
    newWhy: string,
    newHow: string,
    chantsPerDay: number,
    totalDaysTarget: number,
    wakeTime: string,
    sleepTime: string
  ) => void;
  soundEnabled: boolean;
}

export const SankalpFullPage: React.FC<SankalpFullPageProps> = ({
  sankalp,
  sadhana,
  onBack,
  onUpdateSankalpAndSadhana,
  onRefineGoalWithoutReset,
  onResetWithNewGoal,
  soundEnabled,
}) => {
  const MAX_GOAL_CHARS = 160;

  // Directly editable form values
  const [what, setWhat] = useState<string>(sankalp.what);
  const [why, setWhy] = useState<string>(sankalp.why);
  const [how, setHow] = useState<string>(sankalp.how);
  const [chantsPerDay, setChantsPerDay] = useState<number>(sadhana.chantsPerDay);
  const [totalDaysTarget, setTotalDaysTarget] = useState<number>(sadhana.totalDaysTarget);
  const [wakeTime, setWakeTime] = useState<string>(sadhana.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState<string>(sadhana.sleepTime || '22:30');
  const [refinementNote, setRefinementNote] = useState<string>('');
  const [showGoalChangeDialog, setShowGoalChangeDialog] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const formatDisplayTime = (time24: string) => {
    if (!time24) return '06:30 AM';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const hFormatted = h < 10 ? `0${h}` : `${h}`;
    return `${hFormatted}:${m} ${period}`;
  };

  const adjustTime = (current: string, deltaMinutes: number) => {
    const [hStr, mStr] = (current || '06:30').split(':');
    let total = (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0) + deltaMinutes;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  };

  // Auto-resize refs for textareas
  const whatRef = useRef<HTMLTextAreaElement>(null);
  const whyRef = useRef<HTMLTextAreaElement>(null);
  const howRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 68)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight(whatRef.current);
    adjustTextareaHeight(whyRef.current);
    adjustTextareaHeight(howRef.current);
  }, [what, why, how]);

  const isWhatChanged = what.trim() !== sankalp.what.trim();
  const isWhyHowChanged = why.trim() !== sankalp.why.trim() || how.trim() !== sankalp.how.trim();
  const isSadhanaChanged =
    chantsPerDay !== sadhana.chantsPerDay ||
    totalDaysTarget !== sadhana.totalDaysTarget ||
    wakeTime !== (sadhana.wakeTime || '06:30') ||
    sleepTime !== (sadhana.sleepTime || '22:30');
  const isAnyChanged = isWhatChanged || isWhyHowChanged || isSadhanaChanged;

  const handleSaveClick = () => {
    if (!what.trim()) return;

    // If What changed, give user the thoughtful prompt: Refinement vs Brand New Goal
    if (isWhatChanged) {
      setShowGoalChangeDialog(true);
      return;
    }

    // If only Why/How or Sadhana rhythm changed
    if (isWhyHowChanged || isSadhanaChanged) {
      if (soundEnabled) sound.playMalaClick(0.3);
      onUpdateSankalpAndSadhana({
        why: why.trim(),
        how: how.trim(),
        chantsPerDay,
        totalDaysTarget,
        wakeTime,
        sleepTime,
        note: refinementNote.trim() || 'Updated details',
      });
      setSaveSuccess('Sankalp updated');
      setTimeout(() => {
        setSaveSuccess(null);
        onBack();
      }, 1000);
    } else {
      onBack();
    }
  };

  // User confirmed: this is just clarifying/refining goal wording -> PRESERVE STREAK!
  const handleSaveAsGoalRefinement = () => {
    if (soundEnabled) sound.playMalaClick(0.3);
    onRefineGoalWithoutReset(
      what.trim(),
      why.trim(),
      how.trim(),
      refinementNote.trim() || 'Refined goal phrasing & clarity'
    );
    // Also save sadhana changes if any
    if (isSadhanaChanged) {
      onUpdateSankalpAndSadhana({
        why: why.trim(),
        how: how.trim(),
        chantsPerDay,
        totalDaysTarget,
        wakeTime,
        sleepTime,
        note: 'Updated sadhana specs along with goal phrasing',
      });
    }
    setShowGoalChangeDialog(false);
    setSaveSuccess('Goal phrasing updated. Streak preserved!');
    setTimeout(() => {
      setSaveSuccess(null);
      onBack();
    }, 1200);
  };

  // User confirmed: this is fundamentally a NEW Sankalp -> RESET STREAK
  const handleSaveAsNewSankalp = () => {
    if (soundEnabled) sound.playTempleBell(0.8);
    onResetWithNewGoal(
      what.trim(),
      why.trim(),
      how.trim(),
      chantsPerDay,
      totalDaysTarget,
      wakeTime,
      sleepTime
    );
    setShowGoalChangeDialog(false);
    onBack();
  };

  return (
    <div className="bg-black text-[#e7e9ea] py-5 px-4 sm:px-8 max-w-5xl mx-auto w-full pb-12 select-none">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 border-b border-[#2f3336] flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full hover:bg-white/[0.08] flex items-center justify-center text-[#e7e9ea] transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-tight">
              Edit Sankalp
            </h1>
            <span className="text-[13px] sm:text-[14px] text-[#9ca3ab] tabular-nums">
              Day {sadhana.currentDay} of {sadhana.totalDaysTarget} · {sadhana.streak}d streak
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveClick}
          disabled={!isAnyChanged}
          className={`px-5 py-1.5 rounded-full font-bold text-[14px] transition-colors flex items-center gap-1.5 cursor-pointer ${
            isAnyChanged
              ? 'bg-[#ffd400] hover:bg-[#e6be00] text-black shadow-sm'
              : 'border border-[#2f3336] text-[#8e949a] bg-[#16181c] cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-[#ffd400]/10 border border-[#ffd400]/30 text-[#ffd400] text-[14px] sm:text-[15px] font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main Responsive Layout */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 1. What, 2. Why, 3. How */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. What / Lakshya Input (with 160 char limit) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[#ffd400] block">
                  1. What · The Goal
                </label>
                <span
                  className={`text-[13px] font-bold tabular-nums ${
                    what.length >= MAX_GOAL_CHARS ? 'text-red-400' : 'text-[#9ca3ab]'
                  }`}
                >
                  {what.length} / {MAX_GOAL_CHARS}
                </span>
              </div>
              <p className="text-[14px] text-[#9ca3ab]">
                What you want to achieve (up to 160 characters).
              </p>
              <textarea
                ref={whatRef}
                value={what}
                maxLength={MAX_GOAL_CHARS}
                onChange={(e) => {
                  setWhat(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                rows={2}
                className="w-full rounded-2xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-4 text-[16px] sm:text-[17px] text-white placeholder:text-[#8e949a] leading-relaxed focus:outline-none transition resize-none overflow-hidden"
                placeholder="What is your goal?"
              />
            </div>

            {/* 2. Why / Hetu Input */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-bold text-[#ffd400] block">
                2. Why · Deep Purpose
              </label>
              <p className="text-[14px] text-[#9ca3ab]">
                Your reason behind this goal. Updates preserve your streak.
              </p>
              <textarea
                ref={whyRef}
                value={why}
                onChange={(e) => {
                  setWhy(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                rows={3}
                className="w-full rounded-2xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-4 text-[16px] sm:text-[17px] text-white placeholder:text-[#8e949a] leading-relaxed focus:outline-none transition resize-none overflow-hidden"
                placeholder="Why must you achieve this?"
              />
            </div>

            {/* 3. How / Karma Input */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-bold text-[#ffd400] block">
                3. How · Dedicated Action
              </label>
              <p className="text-[14px] text-[#9ca3ab]">
                Small daily steps toward it. You can refine this anytime.
              </p>
              <textarea
                ref={howRef}
                value={how}
                onChange={(e) => {
                  setHow(e.target.value);
                  adjustTextareaHeight(e.target);
                }}
                rows={3}
                className="w-full rounded-2xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-4 text-[16px] sm:text-[17px] text-white placeholder:text-[#8e949a] leading-relaxed focus:outline-none transition resize-none overflow-hidden"
                placeholder="Start with basic what you feel is right and steps required to achieve it. Something actionable. It’s ok if you feel it doesnt totally make sense or aligns completely. You can come back and change it tomorrow once you have clarity. Don't wait for perfection from day 1. Type in and begin."
              />
            </div>
          </div>

          {/* Right Column: 4. Daily Routine, 5. Chants, 6. Duration */}
          <div className="lg:col-span-5 space-y-6">
            {/* 4. Daily Rhythm: Wake & Sleep times */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[#ffd400] block">
                  4. Daily Rhythm & Reminders
                </label>
                <span className="text-[13px] text-[#9ca3ab]">Anchor times</span>
              </div>
              <p className="text-[14px] text-[#9ca3ab]">
                Practice when you wake and before sleep.
              </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#ffd400] font-bold text-[14px]">
                  <Sun className="w-4 h-4" />
                  <span>Wake Up Time</span>
                </div>
                <span className="text-[13px] text-[#9ca3ab]">Morning anchor</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="relative group">
                  <span className="text-[24px] sm:text-[26px] font-bold text-white tracking-tight tabular-nums select-none group-hover:text-[#ffd400] transition whitespace-nowrap">
                    {formatDisplayTime(wakeTime)}
                  </span>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Tap to change morning wake time"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setWakeTime(adjustTime(wakeTime, -15));
                      if (soundEnabled) sound.playMalaClick(0.15);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                  >
                    -15m
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWakeTime(adjustTime(wakeTime, 15));
                      if (soundEnabled) sound.playMalaClick(0.15);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                  >
                    +15m
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#ffd400] font-bold text-[14px]">
                  <Moon className="w-4 h-4" />
                  <span>Sleep Time</span>
                </div>
                <span className="text-[13px] text-[#9ca3ab]">Night reminder</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="relative group">
                  <span className="text-[24px] sm:text-[26px] font-bold text-white tracking-tight tabular-nums select-none group-hover:text-[#ffd400] transition whitespace-nowrap">
                    {formatDisplayTime(sleepTime)}
                  </span>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Tap to change bedtime"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSleepTime(adjustTime(sleepTime, -15));
                      if (soundEnabled) sound.playMalaClick(0.15);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                  >
                    -15m
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSleepTime(adjustTime(sleepTime, 15));
                      if (soundEnabled) sound.playMalaClick(0.15);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                  >
                    +15m
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Daily Chants Selector */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-bold text-[#ffd400] block">
              5. Daily Hanuman Chalisa Chants
            </label>
            <span className="text-[13px] text-[#9ca3ab] font-medium">Preserves streak</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {[1, 3, 7, 11].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setChantsPerDay(count);
                  if (soundEnabled) sound.playMalaClick(0.2);
                }}
                className={`h-13 rounded-2xl border text-[14px] sm:text-[15px] font-bold transition flex items-center justify-center px-1 text-center cursor-pointer ${
                  chantsPerDay === count
                    ? 'border-[#ffd400] bg-[#ffd400] text-black shadow-sm'
                    : 'border-[#2f3336] bg-[#16181c] text-[#e7e9ea] hover:bg-white/[0.05]'
                }`}
              >
                {count} {count === 1 ? 'Chant' : 'Chants'}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Sadhana Duration Selector */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-bold text-[#ffd400] block">
              6. Commitment Duration
            </label>
            <span className="text-[13px] text-[#9ca3ab] font-medium">Preserves streak</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[
              { days: 21, label: '21 Days' },
              { days: 40, label: '40 Days' },
              { days: 108, label: '108 Days' },
            ].map((item) => (
              <button
                key={item.days}
                type="button"
                onClick={() => {
                  setTotalDaysTarget(item.days);
                  if (soundEnabled) sound.playMalaClick(0.2);
                }}
                className={`h-13 rounded-2xl border text-[14px] sm:text-[15px] font-bold transition flex items-center justify-center cursor-pointer ${
                  totalDaysTarget === item.days
                    ? 'border-[#ffd400] bg-[#ffd400] text-black shadow-sm'
                    : 'border-[#2f3336] bg-[#16181c] text-[#e7e9ea] hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Version Refinement Note */}
        {isAnyChanged && !isWhatChanged && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[14px] text-[#9ca3ab] font-medium block">
              Refinement note (optional):
            </label>
            <input
              type="text"
              value={refinementNote}
              onChange={(e) => setRefinementNote(e.target.value)}
              placeholder="e.g. Sharpened action plan for morning routine..."
              className="w-full rounded-xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] px-3.5 py-2.5 text-[15px] text-white placeholder:text-[#8e949a] focus:outline-none transition"
            />
          </div>
        )}
          </div>
        </div>

        {/* Intelligent Goal Edit Decision Dialog */}
        {showGoalChangeDialog && (
          <div className="p-5 rounded-3xl bg-[#16181c] border-2 border-[#ffd400]/40 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#ffd400]/10 text-[#ffd400] shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-white">
                  How would you like to record this goal change?
                </h3>
                <p className="text-[14px] text-[#a0a6ad] leading-relaxed">
                  You can update your wording anytime as you get clearer on your goal.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              {/* Option 1: Rephrasing (Preserves Streak) */}
              <div className="p-4 rounded-2xl bg-black border border-[#ffd400]/30 hover:border-[#ffd400] transition flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-bold text-[#ffd400]">
                      Refining Phrasing & Clarity
                    </span>
                    <span className="text-[13px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                      Streak Intact
                    </span>
                  </div>
                  <p className="text-[14px] text-[#9ca3ab] leading-relaxed">
                    Same core goal, but clearer wording or spelling fix. Logs to history and maintains
                    your current streak.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAsGoalRefinement}
                  className="w-full py-2.5 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[14px] transition cursor-pointer"
                >
                  Save & Keep Streak
                </button>
              </div>

              {/* Option 2: Brand New Goal (Resets Streak) */}
              <div className="p-4 rounded-2xl bg-black border border-[#2f3336] hover:border-white/20 transition flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-bold text-white">A Brand New Goal</span>
                    <span className="text-[13px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                      Resets to Day 1
                    </span>
                  </div>
                  <p className="text-[14px] text-[#9ca3ab] leading-relaxed">
                    A completely different goal. Starts a new Sankalp from Day 1.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAsNewSankalp}
                  className="w-full py-2.5 rounded-full border border-[#2f3336] hover:bg-white/[0.08] text-white font-bold text-[14px] transition-colors cursor-pointer"
                >
                  Start New Sankalp
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGoalChangeDialog(false)}
                className="text-[14px] text-[#9ca3ab] hover:text-white font-medium cursor-pointer"
              >
                Keep editing
              </button>
            </div>
          </div>
        )}

        {/* Primary Save Changes Button */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 rounded-full border border-[#2f3336] hover:bg-white/[0.05] text-[#e7e9ea] font-bold text-[15px] sm:text-[16px] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={!isAnyChanged}
            className={`flex-1 py-3.5 rounded-full font-bold text-[15px] sm:text-[16px] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isAnyChanged
                ? 'bg-[#ffd400] hover:bg-[#e6be00] text-black shadow-md'
                : 'bg-white/10 text-[#8e949a] cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Complete Version History */}
        {sankalp.versions && sankalp.versions.length > 0 && (
          <div className="pt-6 border-t border-[#2f3336] space-y-3">
            <div className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-2 text-white font-bold">
                <History className="w-4 h-4 text-[#ffd400]" />
                <span>Version History ({sankalp.versions.length})</span>
              </div>
            </div>

            <div className="space-y-3">
              {sankalp.versions.map((v, i) => (
                <div
                  key={v.id || i}
                  className="p-4 rounded-2xl bg-[#16181c] border border-[#2f3336] space-y-2 text-[14px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[13px] font-bold px-2.5 py-0.5 rounded-full ${
                        v.changeType === 'created'
                          ? 'bg-[#ffd400]/15 text-[#ffd400]'
                          : v.changeType === 'goal_refined'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : v.changeType === 'goal_restarted'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-white/10 text-[#e7e9ea]'
                      }`}
                    >
                      {v.changeType === 'created' && 'Started'}
                      {v.changeType === 'goal_refined' && 'Phrasing Updated (Streak Kept)'}
                      {v.changeType === 'goal_restarted' && 'New Sankalp'}
                      {v.changeType === 'why_how_modified' && 'Details Updated'}
                      {v.changeType === 'sadhana_modified' && 'Schedule Updated'}
                    </span>
                    <span className="text-[13px] text-[#9ca3ab]">
                      {new Date(v.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <p className="text-[15px] text-white font-medium">"{v.what}"</p>
                    {v.note && <p className="text-[13px] text-[#9ca3ab] italic">{v.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
