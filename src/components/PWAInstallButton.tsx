import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean; fallbackLabel?: string }> = ({
  compact = false,
  fallbackLabel,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button or show status
  if (isInstalled) {
    return fallbackLabel ? (
      <span className="px-3 py-1 rounded-full border border-[#2f3336] text-[13px] font-medium text-[#9ca3ab] shrink-0">
        Installed
      </span>
    ) : null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          compact
            ? 'h-8 px-2.5 rounded-full border border-[#2f3336] text-[13px] font-bold text-[#ffd400] hover:border-[#ffd400] transition flex items-center gap-1.5 cursor-pointer bg-[#16181c]'
            : 'flex items-center gap-2 rounded-full border border-[#ffd400]/40 bg-[#ffd400]/10 px-4 py-2 text-[14px] font-bold text-[#ffd400] shadow-sm hover:bg-[#ffd400]/20 transition cursor-pointer'
        }
        title="Install Sankalp on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={
            compact
              ? 'h-8 px-2.5 rounded-full border border-[#2f3336] text-[13px] font-bold text-[#ffd400] hover:border-[#ffd400] transition flex items-center gap-1.5 cursor-pointer bg-[#16181c]'
              : 'flex items-center gap-2 rounded-full border border-[#2f3336] bg-[#16181c] px-3.5 py-1.5 text-[13px] font-semibold text-[#e7e9ea] hover:border-[#ffd400] transition cursor-pointer'
          }
          title="Install on iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5 text-[#ffd400]" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl bg-[#16181c] border border-[#2f3336] p-6 text-center space-y-4 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#2f3336] text-[#9ca3ab] hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 mx-auto rounded-full bg-[#ffd400]/10 border border-[#ffd400]/30 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-[#ffd400]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-[18px] font-bold text-white">Install on iPhone / iPad</h3>
                <p className="text-[14px] text-[#a0a6ad] leading-relaxed pt-1">
                  1. Tap the <strong className="text-white">Share</strong> button in Safari toolbar.<br />
                  2. Scroll down and select <strong className="text-white">Add to Home Screen</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black font-bold text-[15px] transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return fallbackLabel ? (
    <span className="px-3 py-1 rounded-full border border-[#2f3336] text-[13px] font-medium text-[#9ca3ab] shrink-0">
      {fallbackLabel}
    </span>
  ) : null;
};
