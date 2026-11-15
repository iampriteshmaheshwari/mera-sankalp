import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SankalpWizard } from './components/SankalpWizard';
import { ContemplationScreen } from './components/ContemplationScreen';
import { ChantingSession } from './components/ChantingSession';
import { StreakCard } from './components/StreakCard';
import { SankalpFullPage } from './components/SankalpFullPage';
import { SettingsScreen } from './components/SettingsScreen';
import { WisdomTab } from './components/WisdomTab';
import { HelpScreen } from './components/HelpScreen';
import { AshirwadScreen } from './components/AshirwadScreen';
import {
  loadAppState,
  saveAppState,
  recordChantProgress,
  updateSankalpAndSadhana,
  refineGoalWithoutReset,
  resetWithNewGoal,
  clearAllData,
  defaultState,
  getTodayDateString,
} from './utils/storage';
import { sound } from './utils/audio';
import { AppState } from './types';

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showLandingHelp, setShowLandingHelp] = useState<boolean>(false);

  // Main tab: 'sadhana' | 'wisdom'
  const [currentTab, setCurrentTab] = useState<'sadhana' | 'wisdom'>('sadhana');

  // App navigation state: 'contemplation' | 'chanting' | 'ashirwad' | 'streak' | 'vow' | 'settings' | 'new_vow' | 'help'
  const [activeView, setActiveView] = useState<
    'contemplation' | 'chanting' | 'ashirwad' | 'streak' | 'vow' | 'settings' | 'new_vow' | 'help'
  >('contemplation');

  // Load state on mount
  useEffect(() => {
    const loaded = loadAppState();
    setState(loaded);
    setIsLoaded(true);

    if (loaded.sankalp && loaded.sadhana) {
      setShowLanding(false);
      const today = getTodayDateString();
      const isTodayCompleted = loaded.sadhana.completedDays.some(
        (d) => d.date === today && d.dayNumber === loaded.sadhana?.currentDay
      );
      if (isTodayCompleted) {
        setActiveView('streak');
      } else {
        setActiveView('contemplation');
      }
    } else {
      setShowLanding(!loaded.hasSeenLanding);
    }
  }, []);

  // Sync ambient sound if enabled
  useEffect(() => {
    if (isLoaded) {
      sound.toggleAmbientHum(state.ambientHum);
    }
  }, [state.ambientHum, isLoaded]);

  // Handle Wizard completion
  const handleWizardComplete = (data: {
    what: string;
    why: string;
    how: string;
    chantsPerDay: number;
    totalDaysTarget: number;
    wakeTime: string;
    sleepTime: string;
    notificationsEnabled: boolean;
  }) => {
    const newState = resetWithNewGoal(
      state,
      data.what,
      data.why,
      data.how,
      data.chantsPerDay,
      data.totalDaysTarget,
      data.wakeTime,
      data.sleepTime,
      data.notificationsEnabled
    );
    setState(newState);
    setShowLanding(false);
    setCurrentTab('sadhana');
    setActiveView('contemplation');
  };

  // Handle single chant completion - variable reward Ashirwad on blessed days, else direct to streak
  const handleChantCompleted = useCallback(() => {
    if (!state.sadhana) return;

    const { updatedState, dayJustCompleted, isDarshanBlessed } = recordChantProgress(state);
    setState(updatedState);

    if (dayJustCompleted) {
      if (isDarshanBlessed) {
        setActiveView('ashirwad');
      } else {
        setActiveView('streak');
      }
    }
  }, [state]);

  // Handle Why/How and Sadhana specs update (preserves streak)
  const handleUpdateSankalpAndSadhana = (data: {
    why: string;
    how: string;
    chantsPerDay: number;
    totalDaysTarget: number;
    wakeTime: string;
    sleepTime: string;
    note?: string;
  }) => {
    const updated = updateSankalpAndSadhana(state, {
      newWhy: data.why,
      newHow: data.how,
      newChantsPerDay: data.chantsPerDay,
      newTotalDaysTarget: data.totalDaysTarget,
      newWakeTime: data.wakeTime,
      newSleepTime: data.sleepTime,
      note: data.note,
    });
    setState(updated);
  };

  // Rephrasing or clarifying goal without breaking streak
  const handleRefineGoalWithoutReset = (
    newWhat: string,
    newWhy: string,
    newHow: string,
    note?: string
  ) => {
    const updated = refineGoalWithoutReset(state, newWhat, newWhy, newHow, note);
    setState(updated);
  };

  // Fundamentally new goal (resets streak)
  const handleResetWithNewGoal = (
    newWhat: string,
    newWhy: string,
    newHow: string,
    chantsPerDay?: number,
    totalDaysTarget?: number,
    wakeTime?: string,
    sleepTime?: string
  ) => {
    if (!state.sadhana) return;
    const updated = resetWithNewGoal(
      state,
      newWhat,
      newWhy,
      newHow,
      chantsPerDay ?? state.sadhana.chantsPerDay,
      totalDaysTarget ?? state.sadhana.totalDaysTarget,
      wakeTime ?? state.sadhana.wakeTime,
      sleepTime ?? state.sadhana.sleepTime
    );
    setState(updated);
    setActiveView('contemplation');
  };

  // Full reset
  const handleResetAll = () => {
    const clean = clearAllData();
    setState(clean);
    setShowLanding(true);
    setShowLandingHelp(false);
    setActiveView('contemplation');
  };

  if (!isLoaded) {
    return (
      <div className="h-dvh bg-black flex items-center justify-center text-[#ffd400] text-xl font-bold">
        ॐ
      </div>
    );
  }

  const hasSankalp = Boolean(state.sankalp && state.sadhana);
  const today = getTodayDateString();
  const isTodayCompleted = Boolean(
    state.sadhana?.completedDays.some(
      (d) => d.date === today && d.dayNumber === state.sadhana?.currentDay
    )
  );

  return (
    <div className="h-dvh max-h-dvh overflow-hidden bg-black text-[#e7e9ea] flex flex-col font-sans selection:bg-[#ffd400]/20 selection:text-[#ffd400]">
      {/* Top Bar - Only shown on primary dashboard views */}
      {hasSankalp &&
        !showLanding &&
        activeView !== 'vow' &&
        activeView !== 'chanting' &&
        activeView !== 'ashirwad' &&
        activeView !== 'settings' &&
        activeView !== 'new_vow' &&
        activeView !== 'help' && (
          <Header
            soundEnabled={state.soundEnabled}
            onGoHome={() => {
              setCurrentTab('sadhana');
              setActiveView(isTodayCompleted ? 'streak' : 'contemplation');
            }}
            onOpenSettings={() => setActiveView('settings')}
            onOpenHelp={() => setActiveView('help')}
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            hasSankalp={hasSankalp}
          />
        )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {!hasSankalp ? (
          showLanding ? (
            showLandingHelp ? (
              <HelpScreen
                onBack={() => setShowLandingHelp(false)}
                soundEnabled={state.soundEnabled}
              />
            ) : (
              <LandingPage
                onBeginJourney={() => {
                  setShowLanding(false);
                  const updated = { ...state, hasSeenLanding: true };
                  setState(updated);
                  saveAppState(updated);
                }}
                onOpenHelp={() => setShowLandingHelp(true)}
                hasExistingSankalp={false}
                soundEnabled={state.soundEnabled}
              />
            )
          ) : (
            <SankalpWizard
              onComplete={handleWizardComplete}
              onCancel={() => setShowLanding(true)}
              soundEnabled={state.soundEnabled}
            />
          )
        ) : activeView === 'help' ? (
          <HelpScreen
            onBack={() => setActiveView(isTodayCompleted ? 'streak' : 'contemplation')}
            soundEnabled={state.soundEnabled}
          />
        ) : activeView === 'new_vow' ? (
          <SankalpWizard
            onComplete={handleWizardComplete}
            onCancel={() => setActiveView(isTodayCompleted ? 'streak' : 'contemplation')}
            soundEnabled={state.soundEnabled}
          />
        ) : activeView === 'settings' ? (
          <SettingsScreen
            onBack={() => setActiveView(isTodayCompleted ? 'streak' : 'contemplation')}
            soundEnabled={state.soundEnabled}
            onToggleSound={() => {
              const next = !state.soundEnabled;
              const updated = { ...state, soundEnabled: next };
              setState(updated);
              saveAppState(updated);
            }}
            ambientHum={state.ambientHum}
            onToggleAmbient={() => {
              const next = !state.ambientHum;
              const updated = { ...state, ambientHum: next };
              setState(updated);
              saveAppState(updated);
            }}
            scriptPreference={state.scriptPreference}
            onChangeScriptPref={(pref) => {
              const updated = { ...state, scriptPreference: pref };
              setState(updated);
              saveAppState(updated);
            }}
            onResetAll={handleResetAll}
            onNewSankalp={() => setActiveView('new_vow')}
            pastSankalps={state.pastSankalps || []}
          />
        ) : currentTab === 'wisdom' ? (
          <WisdomTab soundEnabled={state.soundEnabled} />
        ) : (
          <>
            {activeView === 'contemplation' && state.sankalp && state.sadhana && (
              <ContemplationScreen
                sankalp={state.sankalp}
                sadhana={state.sadhana}
                onBeginChanting={() => setActiveView('chanting')}
                onOpenSankalp={() => setActiveView('vow')}
                soundEnabled={state.soundEnabled}
              />
            )}

            {activeView === 'chanting' && state.sadhana && (
              <ChantingSession
                currentChant={state.sadhana.todayChantsDone + 1}
                totalChantsForDay={state.sadhana.chantsPerDay}
                dayNumber={state.sadhana.currentDay}
                soundEnabled={state.soundEnabled}
                initialScriptPref={state.scriptPreference}
                onToggleSound={() => {
                  const next = !state.soundEnabled;
                  const updated = { ...state, soundEnabled: next };
                  setState(updated);
                  saveAppState(updated);
                }}
                onChantCompleted={handleChantCompleted}
                onExitSession={() => setActiveView('contemplation')}
              />
            )}

            {activeView === 'ashirwad' && state.sadhana && (
              <AshirwadScreen
                dayNumber={state.sadhana.currentDay}
                streak={state.sadhana.streak}
                onContinue={() => setActiveView('streak')}
                soundEnabled={state.soundEnabled}
              />
            )}

            {activeView === 'streak' && state.sankalp && state.sadhana && (
              <StreakCard
                sankalp={state.sankalp}
                sadhana={state.sadhana}
                onOpenSankalp={() => setActiveView('vow')}
                onOpenAshirwad={
                  state.sadhana.completedDays.find(
                    (d) => d.date === today && d.dayNumber === state.sadhana?.currentDay
                  )?.blessedDarshan
                    ? () => setActiveView('ashirwad')
                    : undefined
                }
                soundEnabled={state.soundEnabled}
              />
            )}

            {activeView === 'vow' && state.sankalp && state.sadhana && (
              <SankalpFullPage
                sankalp={state.sankalp}
                sadhana={state.sadhana}
                onBack={() =>
                  setActiveView(isTodayCompleted ? 'streak' : 'contemplation')
                }
                onUpdateSankalpAndSadhana={handleUpdateSankalpAndSadhana}
                onRefineGoalWithoutReset={handleRefineGoalWithoutReset}
                onResetWithNewGoal={handleResetWithNewGoal}
                soundEnabled={state.soundEnabled}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
