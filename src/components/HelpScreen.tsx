import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface HelpScreenProps {
  onBack: () => void;
  soundEnabled: boolean;
}

const MASTER_PROMPT = `Help me get clear on one goal (Sankalp) that I will read and reflect on every day alongside chanting Shri Hanuman Chalisa.

Before writing the final answers, ask me 3 simple questions to help me think clearly:
1. What is the one important goal I want to achieve in the next 3 to 6 months?
2. Why does this matter to me personally?
3. What is one small action (20 to 30 minutes) I can do every single day toward it?

Once we talk through it, give me three short, ready-to-copy blocks in this format:

=== 1. WHAT (THE GOAL) ===
[One clear sentence, maximum 160 characters.]

=== 2. WHY (THE PURPOSE) ===
[2 to 3 simple sentences on why this matters to me.]

=== 3. HOW (DAILY STEP) ===
[One small, practical step I can take every day.]`;

export const HelpScreen: React.FC<HelpScreenProps> = ({
  onBack,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MASTER_PROMPT);
      if (soundEnabled) sound.playMalaClick(0.2);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = MASTER_PROMPT;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="bg-black text-[#e7e9ea] max-w-5xl mx-auto w-full py-5 px-4 sm:px-8 pb-10 select-none">
      {/* Screen Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 border-b border-[#2f3336] flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) sound.playMalaClick(0.15);
            onBack();
          }}
          className="w-9 h-9 rounded-full hover:bg-white/[0.08] flex items-center justify-center text-[#e7e9ea] transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-tight">
            Need Help Deciding?
          </h1>
          <span className="text-[13px] sm:text-[14px] text-[#9ca3ab]">
            For Gemini, Claude, ChatGPT, or Grok
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Action Bar: Immediate Copy CTA first */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[15px] sm:text-[16px] text-[#b0b6bc] leading-relaxed max-w-xl">
            Copy this prompt into any AI chat to think through your goal and get three short answers ready to paste back here.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto sm:min-w-[200px] h-12 px-6 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[15px] sm:text-[16px] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,212,0,0.16)] cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Optional Details Below: Prompt Preview & What It Covers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-3">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[#ffd400] block">
                Prompt
              </span>
              <p className="text-[15px] text-[#b0b6bc] leading-relaxed whitespace-pre-wrap select-text">
                {MASTER_PROMPT}
              </p>
            </div>
          </div>

          <div className="md:col-span-5 space-y-3">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[#9ca3ab] block px-1">
              What You Will Get
            </span>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#16181c] border border-[#2f3336]">
              <span className="text-[14px] font-mono text-[#ffd400] mt-0.5 font-bold">01</span>
              <div className="space-y-0.5">
                <div className="text-[16px] font-semibold text-white">What</div>
                <div className="text-[14px] sm:text-[15px] text-[#9ca3ab]">One clear goal under 160 characters.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#16181c] border border-[#2f3336]">
              <span className="text-[14px] font-mono text-[#ffd400] mt-0.5 font-bold">02</span>
              <div className="space-y-0.5">
                <div className="text-[16px] font-semibold text-white">Why</div>
                <div className="text-[14px] sm:text-[15px] text-[#9ca3ab]">Why it matters to you.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#16181c] border border-[#2f3336]">
              <span className="text-[14px] font-mono text-[#ffd400] mt-0.5 font-bold">03</span>
              <div className="space-y-0.5">
                <div className="text-[16px] font-semibold text-white">How</div>
                <div className="text-[14px] sm:text-[15px] text-[#9ca3ab]">A small step you can do daily.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
