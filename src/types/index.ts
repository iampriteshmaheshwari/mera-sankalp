/**
 * Data structures for Sankalp, Sadhana, and Daily Rhythm
 */

export interface SankalpVersion {
  id: string;
  what: string;
  why: string;
  how: string;
  chantsPerDay?: number;
  totalDaysTarget?: number;
  wakeTime?: string;
  sleepTime?: string;
  timestamp: string;
  changeType:
    | 'created'
    | 'goal_refined'
    | 'goal_restarted'
    | 'why_how_modified'
    | 'sadhana_modified';
  note?: string;
}

export interface Sankalp {
  id: string;
  what: string; // The Goal / Lakshya
  why: string; // The Deep Purpose / Hetu
  how: string; // The Daily Action Plan / Karma
  createdAt: string;
  updatedAt: string;
  versionCount: number;
  versions: SankalpVersion[];
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  chantsTarget: number;
  chantsCompleted: number;
  completedAt: string;
  blessedDarshan: boolean; // whether Hanuman ji's aura appeared on this day
  reflectionNote?: string;
}

export interface Sadhana {
  chantsPerDay: number; // e.g. 1, 3, 7, 11
  totalDaysTarget: number; // e.g. 21, 40, 108
  startDate: string;
  currentDay: number; // e.g. 1
  streak: number; // current continuous days
  highestStreak: number;
  completedDays: DayRecord[];
  todayChantsDone: number; // completed today
  lastActiveDate: string; // YYYY-MM-DD
  wakeTime?: string; // e.g. "06:30"
  sleepTime?: string; // e.g. "22:30"
  notificationsEnabled?: boolean;
}

export interface AppState {
  sankalp: Sankalp | null;
  sadhana: Sadhana | null;
  pastSankalps?: Sankalp[];
  scriptPreference: 'both' | 'hindi' | 'english';
  soundEnabled: boolean;
  bellVolume: number;
  ambientHum: boolean;
  hasSeenLanding?: boolean;
}
