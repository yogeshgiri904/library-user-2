import { format, isSameDay, parseISO } from 'date-fns';
import { IST_TIMEZONE } from '../lib/constants';

export function nowInIST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: IST_TIMEZONE }));
}

export function todayISTDate() {
  return format(nowInIST(), 'yyyy-MM-dd');
}

export function formatClock(value?: string | null) {
  if (!value) return '--:--';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE
  }).format(new Date(value));
}

export function formatDate(value?: string | null) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: IST_TIMEZONE }).format(new Date(value));
}

export function minutesToHuman(minutes = 0) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function isToday(value: string) {
  return isSameDay(parseISO(value), nowInIST());
}

export function getMonthKey(date: Date) {
  return format(date, 'yyyy-MM');
}
