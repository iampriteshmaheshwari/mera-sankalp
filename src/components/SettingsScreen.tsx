import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Bell, Trash2, Music, Plus } from 'lucide-react';
import { sound } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';
import { Sankalp } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientHum: boolean;
  onToggleAmbient: () => void;
  scriptPreference: 'both' | 'hindi' | 'english';
  onChangeScriptPref: (pref: 'both' | 'hindi' | 'english') => void;
  onResetAll: () => void;
  onNewSankalp: () => void;
  pastSankalps?: Sankalp[];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  soundEnabled,
  onToggleSound,
  ambientHum,
  onToggleAmbient,
  scriptPreference,
  onChangeScriptPref,
  onResetAll,
  onNewSankalp,
  pastSankalps = [],
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [reminderStatus, setReminderStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted' ? 'Active' : 'Enable';
    }
    return 'Enable';
  });

  const handleConfirmReset = () => {
    onResetAll();
    setShowConfirmReset(false);
  };

  const handleEnableReminders = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setReminderStatus('Active');
      } else {
        const res = await Notification.requestPermission();
        if (res === 'granted') {
          setReminderStatus('Active');
          if (soundEnabled) sound.playMalaClick(0.2);
        } else {
          setReminderStatus('Blocked');
        }
      }
    }
  };

  return (
    <div className="bg-black text-[#e7e9ea] max-w-5xl mx-auto w-full py-5 px-4 sm:px-8 pb-10 select-none">
      {/* Top Header - Screen Based Navigation */}
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
              Settings
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Sankalp Management & Data/App */}
        <div className="space-y-5">
          {/* Sankalp Management */}
          <div className="p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[16px] font-bold text-white block">Your Sankalp</span>
                <span className="text-[14px] text-[#9ca3ab]">
                  Start a new Sankalp anytime
                </span>
              </div>
              <button
                type="button"
                onClick={onNewSankalp}
                className="px-4 py-2 rounded-full bg-[#ffd400] hover:bg-[#e6be00] text-black text-[14px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Sankalp</span>
              </button>
            </div>

            {pastSankalps.length > 0 && (
              <div className="pt-3 border-t border-[#2f3336]/60">
                <span className="text-[13px] text-[#9ca3ab] font-medium block mb-2">
                  Past Sankalps ({pastSankalps.length})
                </span>
                <div className="space-y-2">
                  {pastSankalps.map((s, idx) => (
                    <div key={s.id || idx} className="p-3 rounded-2xl bg-black border border-[#2f3336] text-[14px]">
                      <p className="text-white font-medium truncate">"{s.what}"</p>
                      <span className="text-[13px] text-[#9ca3ab]">
                        {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Offline App Installation */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] flex items-center justify-between gap-3">
            <div>
              <span className="text-[16px] font-bold text-white block">Offline Access</span>
              <span className="text-[14px] text-[#9ca3ab]">
                Add to home screen
              </span>
            </div>
            <PWAInstallButton fallbackLabel="Available" />
          </div>
        </div>

        {/* Right Column: Audio, Script, Notifications, Reset */}
        <div className="space-y-5">
          {/* Sound Preferences */}
          <div className="space-y-3">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#ffd400] block">
              Audio
            </span>

            {/* Chime */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336]">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#ffd400]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#9ca3ab]" />
                )}
                <div>
                  <span className="text-[16px] font-bold text-white block">Chime</span>
                  <span className="text-[14px] text-[#9ca3ab]">Subtle tone on completion</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onToggleSound();
                  if (!soundEnabled) sound.playMalaClick(0.2);
                }}
                className={`w-12 h-7 rounded-full transition p-0.5 cursor-pointer ${
                  soundEnabled ? 'bg-[#ffd400]' : 'bg-[#2f3336]'
                }`}
                aria-label="Toggle chime sound"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-black transition transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Meditative Drone */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336]">
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-[#ffd400]" />
                <div>
                  <span className="text-[16px] font-bold text-white block">Tanpura Drone</span>
                  <span className="text-[14px] text-[#9ca3ab]">Continuous meditative acoustic hum</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleAmbient}
                className={`w-12 h-7 rounded-full transition p-0.5 cursor-pointer ${
                  ambientHum ? 'bg-[#ffd400]' : 'bg-[#2f3336]'
                }`}
                aria-label="Toggle tanpura drone"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-black transition transform ${
                    ambientHum ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Script Preference */}
          <div className="space-y-2">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[#ffd400] block">
              Chalisa Script
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'both', label: 'Both' },
                { id: 'hindi', label: 'Hindi' },
                { id: 'english', label: 'English' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChangeScriptPref(item.id as 'both' | 'hindi' | 'english');
                    sound.playMalaClick(0.2);
                  }}
                  className={`py-3 px-2 rounded-2xl border text-center text-[15px] font-bold transition cursor-pointer ${
                    scriptPreference === item.id
                      ? 'border-[#ffd400] bg-[#ffd400] text-black'
                      : 'border-[#2f3336] bg-[#16181c] text-[#9ca3ab] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Reminders */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#16181c] border border-[#2f3336] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#ffd400]" />
              <div>
                <span className="text-[16px] font-bold text-white block">Daily Reminders</span>
                <span className="text-[14px] text-[#9ca3ab]">Morning, midday & night alerts</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleEnableReminders}
              className={`px-3.5 py-1.5 rounded-full border text-[13px] sm:text-[14px] font-semibold transition cursor-pointer shrink-0 ${
                reminderStatus === 'Active'
                  ? 'border-[#ffd400]/40 text-[#ffd400] bg-[#ffd400]/10'
                  : 'border-[#2f3336] hover:border-[#ffd400] text-[#e7e9ea] hover:text-[#ffd400]'
              }`}
            >
              {reminderStatus}
            </button>
          </div>

          {/* Reset All Data */}
          <div>
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-3.5 rounded-2xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-red-400 font-medium text-[15px] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Sankalp & Data</span>
              </button>
            ) : (
              <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-3">
                <span className="text-[15px] font-bold text-red-400 block">
                  Clear all data and restart?
                </span>
                <p className="text-[14px] text-[#a0a6ad]">
                  This will erase your current Sankalp, streak, and history.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2.5 rounded-full border border-[#2f3336] text-[14px] font-semibold text-white hover:bg-white/[0.08] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[14px] font-bold transition cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
