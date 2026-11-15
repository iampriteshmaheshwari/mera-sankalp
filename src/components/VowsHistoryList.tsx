import React, { useState } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { Sankalp } from '../types';
import { sound } from '../utils/audio';

interface VowsHistoryListProps {
  activeSankalp: Sankalp;
  pastSankalps?: Sankalp[];
  soundEnabled: boolean;
  className?: string;
}

export const formatVowParagraph = (sankalp: Pick<Sankalp, 'what' | 'why' | 'how'>): {
  what: string;
  whyClause: string;
  how: string;
} => {
  const cleanPunctuation = (text: string) => text.trim().replace(/[.!?]+$/, '');
  const lowercaseFirstIfNormal = (text: string) => {
    if (!text) return text;
    if (text.length > 1 && text[0] === 'I' && (text[1] === ' ' || text[1] === "'")) return text;
    if (/^[A-Z]{2,}/.test(text)) return text;
    return text.charAt(0).toLowerCase() + text.slice(1);
  };

  const what = lowercaseFirstIfNormal(
    cleanPunctuation(sankalp.what).replace(/^(?:my goal is to|my goal is|i want to|to)\s+/i, '')
  );
  const rawWhy = lowercaseFirstIfNormal(
    cleanPunctuation(sankalp.why).replace(/^(?:because|since)\s+/i, '')
  );
  const whyClause = /^to\s+/i.test(rawWhy) ? rawWhy : `because ${rawWhy}`;
  const how = lowercaseFirstIfNormal(
    cleanPunctuation(sankalp.how).replace(/^(?:every day,?\s*i will|i will|daily,?\s*i will)\s+/i, '')
  );

  return { what, whyClause, how };
};

export const VowsHistoryList: React.FC<VowsHistoryListProps> = ({
  activeSankalp,
  pastSankalps = [],
  soundEnabled,
  className = 'pt-4 border-t border-[#2f3336]/70',
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allVows: Array<{ sankalp: Sankalp; isActive: boolean }> = [
    { sankalp: activeSankalp, isActive: true },
    ...pastSankalps.map((s) => ({ sankalp: s, isActive: false })),
  ];

  return (
    <section className={`${className} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-[#a0a6ad] flex items-center gap-2">
          <History className="w-4 h-4 text-[#ffd400]" />
          <span>All Sankalps ({allVows.length})</span>
        </span>
      </div>

      <div className="space-y-2.5">
        {allVows.map(({ sankalp, isActive }) => {
          const isOpen = expandedId === sankalp.id;
          const versions = sankalp.versions || [];

          return (
            <div
              key={sankalp.id}
              className={`rounded-2xl border bg-[#16181c] overflow-hidden transition-colors ${
                isActive ? 'border-[#ffd400]/25' : 'border-[#2f3336]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) sound.playMalaClick(0.15);
                  setExpandedId(isOpen ? null : sankalp.id);
                }}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd400] shrink-0" />
                    )}
                    <span className="text-[13px] font-semibold text-[#ffd400]">
                      {isActive ? 'Active' : 'Past'}
                    </span>
                    <span className="text-[13px] text-[#9ca3ab]">
                      · {versions.length} {versions.length === 1 ? 'version' : 'versions'}
                    </span>
                  </div>
                  <p className="text-[16px] sm:text-[17px] font-medium text-white truncate">
                    "{sankalp.what}"
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full border border-[#2f3336] flex items-center justify-center text-[#9ca3ab] shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-[#2f3336]/60 space-y-2.5">
                  {versions.map((v, idx) => {
                    const formatted = formatVowParagraph(v);
                    return (
                      <div
                        key={v.id || idx}
                        className="p-3.5 rounded-xl bg-black/50 border border-[#2f3336]/70 space-y-1.5 text-[14px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-[#ffd400]">
                            {v.changeType === 'created' && 'Started'}
                            {v.changeType === 'goal_refined' && 'Phrasing Updated'}
                            {v.changeType === 'goal_restarted' && 'New Sankalp'}
                            {v.changeType === 'why_how_modified' && 'Details Updated'}
                            {v.changeType === 'sadhana_modified' && 'Schedule Updated'}
                          </span>
                          <span className="text-[13px] text-[#9ca3ab] tabular-nums">
                            {new Date(v.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-[15px] text-[#f5f5f7] leading-relaxed">
                          My goal is to {formatted.what}, {formatted.whyClause}. Every day, I will {formatted.how}.
                        </p>

                        {v.note && (
                          <p className="text-[13px] text-[#9ca3ab]">{v.note}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
