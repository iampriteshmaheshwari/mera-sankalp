import React from 'react';
import { SlidersHorizontal, HelpCircle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { sound } from '../utils/audio';

interface HeaderProps {
  onGoHome: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  currentTab: 'sadhana' | 'wisdom';
  onSelectTab: (tab: 'sadhana' | 'wisdom') => void;
  hasSankalp: boolean;
  soundEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenSettings,
  onOpenHelp,
  currentTab,
  onSelectTab,
  hasSankalp,
  soundEnabled,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-black/90 backdrop-blur-md border-b border-[#2f3336]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 h-13 sm:h-15 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Clean Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) sound.playMalaClick(0.15);
            onGoHome();
          }}
          className="flex items-center shrink-0 text-left cursor-pointer"
          aria-label="Sankalp Home"
        >
          <span className="font-bold text-[19px] sm:text-[21px] text-white tracking-tight">
            Sankalp
          </span>
        </button>

        {/* Center: Minimal Segmented Toggle (Sadhana vs Resources) */}
        {hasSankalp && (
          <div className="flex items-center bg-[#121316] p-0.5 rounded-full border border-[#272a2e] shrink-0">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled && currentTab !== 'sadhana') sound.playMalaClick(0.15);
                onSelectTab('sadhana');
              }}
              className={`px-3.5 py-1 rounded-full text-[13px] sm:text-[14px] font-medium cursor-pointer ${
                currentTab === 'sadhana'
                  ? 'bg-[#ffd400] text-black font-bold'
                  : 'text-[#9ca3ab] hover:text-white'
              }`}
            >
              Sadhana
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled && currentTab !== 'wisdom') sound.playMalaClick(0.15);
                onSelectTab('wisdom');
              }}
              className={`px-3.5 py-1 rounded-full text-[13px] sm:text-[14px] font-medium cursor-pointer ${
                currentTab === 'wisdom'
                  ? 'bg-[#ffd400] text-black font-bold'
                  : 'text-[#9ca3ab] hover:text-white'
              }`}
            >
              Resources
            </button>
          </div>
        )}

        {/* Right: Clean Icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) sound.playMalaClick(0.2);
              onOpenHelp();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#9ca3ab] hover:text-[#ffd400] hover:bg-white/[0.06] transition cursor-pointer"
            aria-label="Help"
            title="Help"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>

          <PWAInstallButton compact={true} />

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#9ca3ab] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
