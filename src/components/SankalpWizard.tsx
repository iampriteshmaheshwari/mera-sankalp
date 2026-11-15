import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sun, Moon, Bell, Clock, HelpCircle, X } from 'lucide-react';
import { sound } from '../utils/audio';
import { requestNotificationPermission } from '../utils/storage';
import { HelpScreen } from './HelpScreen';

interface SankalpWizardProps {
  onComplete: (data: {
    what: string;
    why: string;
    how: string;
    chantsPerDay: number;
    totalDaysTarget: number;
    wakeTime: string;
    sleepTime: string;
    notificationsEnabled: boolean;
  }) => void;
  onCancel?: () => void;
  soundEnabled: boolean;
  initialValues?: {
    what?: string;
    why?: string;
    how?: string;
    chantsPerDay?: number;
    totalDaysTarget?: number;
    wakeTime?: string;
    sleepTime?: string;
  };
}

export const SankalpWizard: React.FC<SankalpWizardProps> = ({
  onComplete,
  onCancel,
  soundEnabled,
  initialValues,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [what, setWhat] = useState(initialValues?.what || '');
  const [why, setWhy] = useState(initialValues?.why || '');
  const [how, setHow] = useState(initialValues?.how || '');
  const [wakeTime, setWakeTime] = useState<string>(initialValues?.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState<string>(initialValues?.sleepTime || '22:30');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [chantsPerDay, setChantsPerDay] = useState<number>(initialValues?.chantsPerDay || 3);
  const [totalDaysTarget, setTotalDaysTarget] = useState<number>(
    initialValues?.totalDaysTarget || 21
  );

  const MAX_GOAL_CHARS = 160;
  const totalSteps = 5;

  // Format 24h string to crisp 12h display with AM/PM
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

  // Adjust time by delta minutes (+/- 15 mins)
  const adjustTime = (current: string, deltaMinutes: number) => {
    const [hStr, mStr] = (current || '06:30').split(':');
    let total = (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0) + deltaMinutes;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  };

  const handleNext = () => {
    if (step === 1 && !what.trim()) return;
    if (step === 2 && !why.trim()) return;
    if (step === 3 && !how.trim()) return;

    if (soundEnabled) sound.playMalaClick(0.3);

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        what: what.trim(),
        why: why.trim(),
        how: how.trim(),
        chantsPerDay,
        totalDaysTarget,
        wakeTime,
        sleepTime,
        notificationsEnabled,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (soundEnabled) sound.playMalaClick(0.2);
      setStep(step - 1);
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (soundEnabled) sound.playMalaClick(0.2);
  };

  if (isHelpOpen) {
    return (
      <HelpScreen
        onBack={() => setIsHelpOpen(false)}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div className="h-dvh min-h-dvh bg-black text-[#e7e9ea] max-w-5xl mx-auto w-full flex flex-col justify-between pt-5 sm:pt-7 pb-6 sm:pb-8 px-4 sm:px-8 select-none">
      {/* Top Step Progress Bar & Help Button */}
      <div className="shrink-0 mb-3 sm:mb-4">
        <div className="flex items-center justify-between text-[14px] sm:text-[15px] text-[#9ca3ab] mb-2 font-medium">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) sound.playMalaClick(0.2);
                if (onCancel) onCancel();
              }}
              className="w-8 h-8 rounded-full border border-[#ffd400]/40 hover:border-[#ffd400] bg-black hover:bg-[#ffd400]/10 flex items-center justify-center text-[#ffd400] transition-colors cursor-pointer shrink-0 shadow-[0_0_12px_rgba(255,212,0,0.12)]"
              aria-label="Close"
              title="Close"
            >
              <X className="w-4 h-4 text-[#ffd400]" />
            </button>

            <span className="text-[#ffd400] font-semibold text-[14px] sm:text-[15px]">
              {step === 1 && '1. Goal'}
              {step === 2 && '2. Purpose'}
              {step === 3 && '3. Daily Action'}
              {step === 4 && '4. Daily Routine'}
              {step === 5 && '5. Commitment'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) sound.playMalaClick(0.2);
                setIsHelpOpen(true);
              }}
              className="text-[13px] sm:text-[14px] text-[#9ca3ab] hover:text-[#ffd400] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <span className="tabular-nums font-medium text-[#9ca3ab] text-[13px] sm:text-[14px]">
              {step}/{totalSteps}
            </span>
          </div>
        </div>
        <div className="w-full h-1 bg-[#2f3336] rounded-full overflow-hidden">
          <div
            className={`h-full bg-[#ffd400] transition-all duration-200 ease-out rounded-full ${
              step === 1
                ? 'w-1/5'
                : step === 2
                ? 'w-2/5'
                : step === 3
                ? 'w-3/5'
                : step === 4
                ? 'w-4/5'
                : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* STEP 1: The Goal (160 chars) */}
        {step === 1 && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="shrink-0 flex items-baseline justify-between gap-3">
              <div>
                <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                  What is your goal?
                </h1>
                <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] mt-0.5">
                  Write what you want to achieve.
                </p>
              </div>
              <span
                className={`text-[13px] font-bold tabular-nums px-2.5 py-1 rounded-full border shrink-0 ${
                  what.length >= MAX_GOAL_CHARS
                    ? 'border-red-500/40 text-red-400 bg-red-500/10'
                    : 'border-[#2f3336] text-[#9ca3ab] bg-[#16181c]'
                }`}
              >
                {what.length} / {MAX_GOAL_CHARS}
              </span>
            </div>

            <div className="flex-1 flex flex-col min-h-0 pt-1">
              <textarea
                value={what}
                maxLength={MAX_GOAL_CHARS}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Enter your goal clearly..."
                autoFocus
                className="w-full flex-1 rounded-3xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-5 sm:p-6 text-[17px] sm:text-[18px] text-white placeholder:text-[#8e949a] focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 2: The Why */}
        {step === 2 && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="shrink-0">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                Why does it matter?
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] mt-0.5">
                Your honest reason behind this goal.
              </p>
            </div>

            <div className="flex-1 flex flex-col min-h-0 pt-1">
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Why this matters to you..."
                autoFocus
                className="w-full flex-1 rounded-3xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-5 sm:p-6 text-[17px] sm:text-[18px] text-white placeholder:text-[#8e949a] focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 3: The How */}
        {step === 3 && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="shrink-0">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                How will you do it?
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] mt-0.5">
                Small daily steps you can take.
              </p>
            </div>

            <div className="flex-1 flex flex-col min-h-0 pt-1">
              <textarea
                value={how}
                onChange={(e) => setHow(e.target.value)}
                placeholder="Start with basic what you feel is right and steps required to achieve it. Something actionable. It’s ok if you feel it doesnt totally make sense or aligns completely. You can come back and change it tomorrow once you have clarity. Don't wait for perfection from day 1. Type in and begin."
                autoFocus
                className="w-full flex-1 rounded-3xl bg-[#16181c] border border-[#2f3336] focus:border-[#ffd400] p-5 sm:p-6 text-[16px] sm:text-[17px] text-white placeholder:text-[#8e949a] focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Daily Rhythm */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between py-1 min-h-0 space-y-3">
            <div className="shrink-0">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                Daily Routine
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] mt-0.5">
                Best practiced before your day starts and before sleep.
              </p>
            </div>

            <div className="my-auto grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 py-2">
              {/* 1. Morning Anchor Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between gap-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                  <div className="flex items-center gap-2 text-[#ffd400] font-bold text-[14px] sm:text-[15px]">
                    <Sun className="w-4 h-4 text-[#ffd400] shrink-0" />
                    <span>Wake Up Time</span>
                  </div>
                  <span className="text-[13px] text-[#9ca3ab] font-medium">
                    Morning reminder
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="relative group">
                    <span className="text-[24px] md:text-[20px] xl:text-[25px] font-bold text-white tracking-tight tabular-nums select-none group-hover:text-[#ffd400] transition-colors whitespace-nowrap">
                      {formatDisplayTime(wakeTime)}
                    </span>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Tap to change wake up time"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setWakeTime(adjustTime(wakeTime, -15));
                        if (soundEnabled) sound.playMalaClick(0.15);
                      }}
                      className="h-8 lg:h-9 px-2.5 lg:px-3 rounded-xl bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                    >
                      -15m
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWakeTime(adjustTime(wakeTime, 15));
                        if (soundEnabled) sound.playMalaClick(0.15);
                      }}
                      className="h-8 lg:h-9 px-2.5 lg:px-3 rounded-xl bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                    >
                      +15m
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Mid-Day Alignment Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between gap-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                  <div className="flex items-center gap-2 text-[#ffd400] font-bold text-[14px] sm:text-[15px]">
                    <Clock className="w-4 h-4 text-[#ffd400] shrink-0" />
                    <span>Mid-Day Check-in</span>
                  </div>
                  <span className="text-[13px] text-[#9ca3ab] font-medium">
                    Daily reminder
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[24px] md:text-[20px] xl:text-[25px] font-bold text-white tracking-tight tabular-nums select-none whitespace-nowrap">
                    02:30 PM
                  </span>

                  <button
                    type="button"
                    onClick={handleRequestNotifications}
                    className="h-8 lg:h-9 px-3 lg:px-3.5 rounded-xl border border-[#2f3336] text-[13px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer bg-black text-[#ffd400] hover:border-[#ffd400]"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#ffd400]" />
                    <span>{notificationsEnabled ? 'Active' : 'Enable'}</span>
                  </button>
                </div>
              </div>

              {/* 3. Night Anchor Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] flex flex-col justify-between gap-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                  <div className="flex items-center gap-2 text-[#ffd400] font-bold text-[14px] sm:text-[15px]">
                    <Moon className="w-4 h-4 text-[#ffd400] shrink-0" />
                    <span>Sleep Time</span>
                  </div>
                  <span className="text-[13px] text-[#9ca3ab] font-medium">
                    Night reminder
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="relative group">
                    <span className="text-[24px] md:text-[20px] xl:text-[25px] font-bold text-white tracking-tight tabular-nums select-none group-hover:text-[#ffd400] transition-colors whitespace-nowrap">
                      {formatDisplayTime(sleepTime)}
                    </span>
                    <input
                      type="time"
                      value={sleepTime}
                      onChange={(e) => setSleepTime(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Tap to change sleep time"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSleepTime(adjustTime(sleepTime, -15));
                        if (soundEnabled) sound.playMalaClick(0.15);
                      }}
                      className="h-8 lg:h-9 px-2.5 lg:px-3 rounded-xl bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                    >
                      -15m
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSleepTime(adjustTime(sleepTime, 15));
                        if (soundEnabled) sound.playMalaClick(0.15);
                      }}
                      className="h-8 lg:h-9 px-2.5 lg:px-3 rounded-xl bg-black border border-[#2f3336] text-[13px] font-bold text-[#e7e9ea] hover:border-[#ffd400] transition-colors cursor-pointer"
                    >
                      +15m
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Commitment */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-between py-1 min-h-0 space-y-4">
            <div className="shrink-0">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                Commitment
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] mt-0.5">
                Daily chants and target days.
              </p>
            </div>

            <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 items-start py-2">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#9ca3ab] uppercase tracking-wider block">
                    Daily Chants
                  </label>
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#ffd400]">
                    {chantsPerDay} {chantsPerDay === 1 ? 'Chant / Day' : 'Chants / Day'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {[
                    { count: 1, label: '1' },
                    { count: 3, label: '3' },
                    { count: 7, label: '7' },
                    { count: 11, label: '11' },
                  ].map((item) => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => {
                        setChantsPerDay(item.count);
                        if (soundEnabled) sound.playMalaClick(0.2);
                      }}
                      className={`h-16 sm:h-18 rounded-2xl border text-[18px] sm:text-[20px] font-bold flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        chantsPerDay === item.count
                          ? 'border-[#ffd400] bg-[#ffd400] text-black'
                          : 'border-[#2f3336] bg-[#16181c] text-[#e7e9ea] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[13px] font-medium ${
                          chantsPerDay === item.count ? 'text-black/80' : 'text-[#9ca3ab]'
                        }`}
                      >
                        {item.count === 1 ? 'Chant' : 'Chants'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#9ca3ab] uppercase tracking-wider block">
                    Duration
                  </label>
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#ffd400]">
                    {totalDaysTarget} Days
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { days: 21, sub: 'Start' },
                    { days: 40, sub: 'Steady' },
                    { days: 108, sub: 'Deep' },
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => {
                        setTotalDaysTarget(item.days);
                        if (soundEnabled) sound.playMalaClick(0.2);
                      }}
                      className={`h-16 sm:h-18 rounded-2xl border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        totalDaysTarget === item.days
                          ? 'border-[#ffd400] bg-[#ffd400] text-black'
                          : 'border-[#2f3336] bg-[#16181c] text-[#e7e9ea] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-[16px] sm:text-[18px] font-bold">
                        {item.days} Days
                      </span>
                      <span
                        className={`text-[13px] font-medium ${
                          totalDaysTarget === item.days ? 'text-black/80' : 'text-[#9ca3ab]'
                        }`}
                      >
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="shrink-0 pt-3 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) sound.playMalaClick(0.2);
              handleBack();
            }}
            className="h-12 sm:h-13 px-5 sm:px-6 rounded-full border border-[#2f3336] text-[#e7e9ea] hover:bg-white/[0.06] hover:border-[#ffd400]/40 transition-colors flex items-center justify-center gap-2 text-[15px] sm:text-[16px] font-semibold cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={
            (step === 1 && !what.trim()) ||
            (step === 2 && !why.trim()) ||
            (step === 3 && !how.trim())
          }
          className={`h-12 sm:h-13 flex-1 rounded-full font-bold text-[16px] sm:text-[17px] transition-colors flex items-center justify-center gap-2 ${
            (step === 1 && !what.trim()) ||
            (step === 2 && !why.trim()) ||
            (step === 3 && !how.trim())
              ? 'bg-[#16181c] border border-[#2f3336] text-[#8e949a] cursor-not-allowed'
              : 'bg-[#ffd400] hover:bg-[#e6be00] text-black shadow-[0_0_25px_rgba(255,212,0,0.2)] cursor-pointer'
          }`}
        >
          {step < totalSteps ? (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Begin Practice</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
