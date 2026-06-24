import { differenceInCalendarDays, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { todayISTDate } from './time';
import type { AttendanceRow } from '../types';

export interface StudyStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  allTimeMinutes: number;
  monthDays: number;
  allTimeDays: number;
}

export function calculateStats(rows: AttendanceRow[]): StudyStats {
  const today = todayISTDate();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const monthStart = startOfMonth(new Date());
  return rows.reduce<StudyStats>((acc, row) => {
    const minutes = row.duration_minutes || 0;
    const date = parseISO(row.study_date);
    if (row.study_date === today) acc.todayMinutes += minutes;
    if (date >= weekStart) acc.weekMinutes += minutes;
    if (date >= monthStart) {
      acc.monthMinutes += minutes;
      if (minutes >= 60) acc.monthDays += 1;
    }
    acc.allTimeMinutes += minutes;
    if (minutes >= 60) acc.allTimeDays += 1;
    return acc;
  }, { todayMinutes: 0, weekMinutes: 0, monthMinutes: 0, allTimeMinutes: 0, monthDays: 0, allTimeDays: 0 });
}

export function heatmapIntensity(minutes: number) {
  const hours = minutes / 60;
  if (hours <= 0) return 0;
  if (hours <= 2) return 1;
  if (hours <= 6) return 2;
  if (hours <= 10) return 3;
  return 4;
}

export function daysAgo(date: string) {
  return differenceInCalendarDays(new Date(), parseISO(date));
}
