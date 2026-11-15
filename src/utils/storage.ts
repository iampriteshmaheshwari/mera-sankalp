import { AppState, Sankalp, Sadhana, DayRecord, SankalpVersion } from '../types';

const STORAGE_KEY = 'sankalp_hanuman_app_v1';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const defaultState: AppState = {
  sankalp: null,
  sadhana: null,
  pastSankalps: [],
  scriptPreference: 'both',
  soundEnabled: true,
  bellVolume: 0.6,
  ambientHum: false,
  hasSeenLanding: false,
};

export const loadAppState = (): AppState => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;

    // Check day rollover if sadhana exists
    if (parsed.sadhana) {
      const today = getTodayDateString();
      if (parsed.sadhana.lastActiveDate !== today) {
        const lastDayRecord =
          parsed.sadhana.completedDays[parsed.sadhana.completedDays.length - 1];
        const wasYesterdayDone =
          lastDayRecord &&
          lastDayRecord.date === parsed.sadhana.lastActiveDate &&
          lastDayRecord.chantsCompleted >= parsed.sadhana.chantsPerDay;

        if (wasYesterdayDone) {
          const daysCompletedCount = parsed.sadhana.completedDays.length;
          parsed.sadhana.currentDay = Math.min(
            parsed.sadhana.totalDaysTarget,
            daysCompletedCount + 1
          );
        }

        parsed.sadhana.todayChantsDone = 0;
        parsed.sadhana.lastActiveDate = today;
      }
    }

    return parsed;
  } catch {
    return defaultState;
  }
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

/**
 * Variable reward generator:
 * Day 1: Always true (infinite sun radiance aura guaranteed).
 * Milestones (7, 11, 21, 40, 108): Always true.
 * Other days: ~35% variable reward chance.
 */
export const shouldShowDarshan = (dayNumber: number): boolean => {
  if (dayNumber === 1) return true;
  if ([7, 11, 21, 40, 108].includes(dayNumber)) return true;
  return Math.random() < 0.35;
};

/**
 * Marks today's chant completed.
 */
export const recordChantProgress = (
  state: AppState
): {
  updatedState: AppState;
  dayJustCompleted: boolean;
  isDarshanBlessed: boolean;
} => {
  if (!state.sadhana) {
    return { updatedState: state, dayJustCompleted: false, isDarshanBlessed: false };
  }

  const today = getTodayDateString();
  const sadhana = { ...state.sadhana };
  const currentChants = sadhana.todayChantsDone + 1;
  sadhana.todayChantsDone = currentChants;
  sadhana.lastActiveDate = today;

  let dayJustCompleted = false;
  let isDarshanBlessed = false;

  if (currentChants >= sadhana.chantsPerDay) {
    const existingIndex = sadhana.completedDays.findIndex(
      (d) => d.date === today && d.dayNumber === sadhana.currentDay
    );

    isDarshanBlessed = shouldShowDarshan(sadhana.currentDay);

    const record: DayRecord = {
      date: today,
      dayNumber: sadhana.currentDay,
      chantsTarget: sadhana.chantsPerDay,
      chantsCompleted: currentChants,
      completedAt: new Date().toISOString(),
      blessedDarshan: isDarshanBlessed,
    };

    if (existingIndex >= 0) {
      sadhana.completedDays[existingIndex] = record;
    } else {
      sadhana.completedDays.push(record);
      sadhana.streak = sadhana.streak + 1;
      if (sadhana.streak > sadhana.highestStreak) {
        sadhana.highestStreak = sadhana.streak;
      }
      dayJustCompleted = true;
    }
  }

  const newState = { ...state, sadhana };
  saveAppState(newState);

  return {
    updatedState: newState,
    dayJustCompleted,
    isDarshanBlessed,
  };
};

/**
 * Rephrasing or refining goal text / spelling without restarting streak!
 * Goal setting is an iterative process requiring multiple attempts to gain clarity.
 */
export const refineGoalWithoutReset = (
  state: AppState,
  newWhat: string,
  newWhy: string,
  newHow: string,
  note: string = 'Updated goal phrasing'
): AppState => {
  if (!state.sankalp || !state.sadhana) return state;

  const current = state.sankalp;
  const now = new Date().toISOString();

  const newVersion: SankalpVersion = {
    id: `v-${Date.now()}`,
    what: newWhat,
    why: newWhy,
    how: newHow,
    chantsPerDay: state.sadhana.chantsPerDay,
    totalDaysTarget: state.sadhana.totalDaysTarget,
    wakeTime: state.sadhana.wakeTime,
    sleepTime: state.sadhana.sleepTime,
    timestamp: now,
    changeType: 'goal_refined',
    note,
  };

  const updatedSankalp: Sankalp = {
    ...current,
    what: newWhat,
    why: newWhy,
    how: newHow,
    updatedAt: now,
    versionCount: current.versionCount + 1,
    versions: [newVersion, ...current.versions],
  };

  const newState: AppState = {
    ...state,
    sankalp: updatedSankalp,
  };

  saveAppState(newState);
  return newState;
};

/**
 * Updates Why, How, and/or Sadhana specs (chantsPerDay, totalDaysTarget, wakeTime, sleepTime) without breaking streak.
 */
export const updateSankalpAndSadhana = (
  state: AppState,
  params: {
    newWhy?: string;
    newHow?: string;
    newChantsPerDay?: number;
    newTotalDaysTarget?: number;
    newWakeTime?: string;
    newSleepTime?: string;
    newNotificationsEnabled?: boolean;
    note?: string;
  }
): AppState => {
  if (!state.sankalp || !state.sadhana) return state;

  const currentSankalp = state.sankalp;
  const currentSadhana = state.sadhana;
  const now = new Date().toISOString();

  const newWhy = params.newWhy !== undefined ? params.newWhy : currentSankalp.why;
  const newHow = params.newHow !== undefined ? params.newHow : currentSankalp.how;
  const note = params.note || 'Updated details';

  const isWhyHowChanged =
    newWhy.trim() !== currentSankalp.why.trim() || newHow.trim() !== currentSankalp.how.trim();
  const isSadhanaChanged =
    (params.newChantsPerDay !== undefined &&
      params.newChantsPerDay !== currentSadhana.chantsPerDay) ||
    (params.newTotalDaysTarget !== undefined &&
      params.newTotalDaysTarget !== currentSadhana.totalDaysTarget) ||
    (params.newWakeTime !== undefined && params.newWakeTime !== currentSadhana.wakeTime) ||
    (params.newSleepTime !== undefined && params.newSleepTime !== currentSadhana.sleepTime);

  let updatedSankalp = currentSankalp;
  if (isWhyHowChanged || isSadhanaChanged) {
    const newVersion: SankalpVersion = {
      id: `v-${Date.now()}`,
      what: currentSankalp.what,
      why: newWhy,
      how: newHow,
      chantsPerDay: params.newChantsPerDay ?? currentSadhana.chantsPerDay,
      totalDaysTarget: params.newTotalDaysTarget ?? currentSadhana.totalDaysTarget,
      wakeTime: params.newWakeTime ?? currentSadhana.wakeTime,
      sleepTime: params.newSleepTime ?? currentSadhana.sleepTime,
      timestamp: now,
      changeType: isWhyHowChanged ? 'why_how_modified' : 'sadhana_modified',
      note,
    };
    updatedSankalp = {
      ...currentSankalp,
      why: newWhy,
      how: newHow,
      updatedAt: now,
      versionCount: currentSankalp.versionCount + 1,
      versions: [newVersion, ...currentSankalp.versions],
    };
  }

  const updatedSadhana: Sadhana = {
    ...currentSadhana,
    chantsPerDay: params.newChantsPerDay ?? currentSadhana.chantsPerDay,
    totalDaysTarget: params.newTotalDaysTarget ?? currentSadhana.totalDaysTarget,
    wakeTime: params.newWakeTime ?? currentSadhana.wakeTime,
    sleepTime: params.newSleepTime ?? currentSadhana.sleepTime,
    notificationsEnabled:
      params.newNotificationsEnabled ?? currentSadhana.notificationsEnabled,
  };

  const newState: AppState = {
    ...state,
    sankalp: updatedSankalp,
    sadhana: updatedSadhana,
  };

  saveAppState(newState);
  return newState;
};

/**
 * Initiates a completely NEW Sankalp and RESETS the streak to 0.
 */
export const resetWithNewGoal = (
  state: AppState,
  newWhat: string,
  newWhy: string,
  newHow: string,
  chantsPerDay: number,
  totalDaysTarget: number,
  wakeTime?: string,
  sleepTime?: string,
  notificationsEnabled?: boolean
): AppState => {
  const now = new Date().toISOString();
  const today = getTodayDateString();

  const newVersion: SankalpVersion = {
    id: `v-${Date.now()}`,
    what: newWhat,
    why: newWhy,
    how: newHow,
    chantsPerDay,
    totalDaysTarget,
    wakeTime,
    sleepTime,
    timestamp: now,
    changeType: 'created',
    note: state.sankalp
      ? 'Started a new Sankalp'
      : 'First Sankalp started',
  };

  const newSankalp: Sankalp = {
    id: `sankalp-${Date.now()}`,
    what: newWhat,
    why: newWhy,
    how: newHow,
    createdAt: now,
    updatedAt: now,
    versionCount: 1,
    versions: [newVersion],
  };

  const newSadhana: Sadhana = {
    chantsPerDay,
    totalDaysTarget,
    startDate: today,
    currentDay: 1,
    streak: 0,
    highestStreak: state.sadhana?.highestStreak || 0,
    completedDays: [],
    todayChantsDone: 0,
    lastActiveDate: today,
    wakeTime: wakeTime || '06:30',
    sleepTime: sleepTime || '22:30',
    notificationsEnabled: notificationsEnabled ?? true,
  };

  const past = state.sankalp
    ? [state.sankalp, ...(state.pastSankalps || [])]
    : state.pastSankalps || [];

  const newState: AppState = {
    ...state,
    sankalp: newSankalp,
    sadhana: newSadhana,
    pastSankalps: past,
    hasSeenLanding: true,
  };

  saveAppState(newState);
  return newState;
};

/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
};

/**
 * Clear all local data
 */
export const clearAllData = (): AppState => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
  return { ...defaultState };
};
