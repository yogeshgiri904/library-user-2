import { addDays, format, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { AttendanceRow } from '../types';
import { heatmapIntensity } from '../utils/stats';
import { formatClock, minutesToHuman } from '../utils/time';
import { GlassCard, Pill } from './ui';

const intensityClass = ['bg-slate-100', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-700'];

export function HeatmapGrid({ rows }: { rows: AttendanceRow[] }) {
  const [selected, setSelected] = useState<AttendanceRow | null>(null);
  const byDate = useMemo(() => new Map(rows.map(row => [row.study_date, row])), [rows]);
  const days = useMemo(() => {
    const start = subDays(new Date(), 364);
    return Array.from({ length: 365 }, (_, i) => addDays(start, i));
  }, []);
  const totalMinutes = rows.reduce((sum, row) => sum + (row.duration_minutes || 0), 0);
  const goodDays = rows.filter(row => (row.duration_minutes || 0) >= 60).length;

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-ink">365 Day Heatmap</h3>
          <p className="text-sm text-slate-500">Tap any block to see details</p>
        </div>
        <Pill className="bg-emerald-100 text-emerald-700">{goodDays} study days</Pill>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: 'max-content' }}>
          {days.map(day => {
            const key = format(day, 'yyyy-MM-dd');
            const row = byDate.get(key);
            const intensity = heatmapIntensity(row?.duration_minutes || 0);
            return (
              <button
                key={key}
                title={key}
                onClick={() => setSelected(row || { id: key, student_id: '', study_date: key, checkin_time: null, checkout_time: null, duration_minutes: 0, status: 'checked_out' })}
                className={clsx('size-3 rounded-[4px] transition hover:ring-2 hover:ring-amber-400', intensityClass[intensity])}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">Total</p><p className="font-black">{minutesToHuman(totalMinutes)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">Avg/day</p><p className="font-black">{minutesToHuman(Math.round(totalMinutes / 365))}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">Best</p><p className="font-black">{minutesToHuman(Math.max(0, ...rows.map(r => r.duration_minutes || 0)))}</p></div>
      </div>
      {selected && (
        <div className="mt-4 rounded-[24px] bg-ink p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-amber-300">{selected.study_date}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <div><p className="text-slate-400">In</p><p className="font-black">{formatClock(selected.checkin_time)}</p></div>
            <div><p className="text-slate-400">Out</p><p className="font-black">{formatClock(selected.checkout_time)}</p></div>
            <div><p className="text-slate-400">Study</p><p className="font-black">{minutesToHuman(selected.duration_minutes)}</p></div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
