import { useEffect, useMemo, useState } from 'react';
import { Crown, Medal, Sparkles, Trophy } from 'lucide-react';
import { Avatar, GlassCard, Page, Pill, SectionTitle } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { LeaderboardEntry } from '../types';
import { minutesToHuman } from '../utils/time';

type Range = 'daily' | 'weekly' | 'monthly' | 'all_time';
const tabs: { key: Range; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'all_time', label: 'All Time' }
];

export function Leaderboard() {
  const { student } = useAuth();
  const [range, setRange] = useState<Range>('monthly');
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.rpc('get_leaderboard', { p_range: range }).then(({ data, error }) => {
      if (!error) setRows((data || []) as LeaderboardEntry[]);
      setLoading(false);
    });
  }, [range]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3, 10);
  const myRow = useMemo(() => rows.find(row => row.student_id === student?.id), [rows, student?.id]);

  return (
    <Page>
      <SectionTitle title="Leaderboard" subtitle="Ranked by study hours, days, streaks, points & referrals" right={<Pill className="bg-amber-100 text-amber-700"><Trophy size={14} /> Monthly default</Pill>} />
      <div className="mb-5 grid grid-cols-4 gap-2 rounded-[24px] bg-white p-2 shadow-sm">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setRange(tab.key)} className={`rounded-2xl px-2 py-3 text-xs font-black transition ${range === tab.key ? 'bg-ink text-white shadow-soft' : 'text-slate-500'}`}>{tab.label}</button>
        ))}
      </div>

      <GlassCard className="bg-premium-radial text-white">
        <div className="flex items-end justify-center gap-3 pt-3">
          {[top3[1], top3[0], top3[2]].map((entry, index) => {
            const realRank = entry?.rank || (index === 1 ? 1 : index === 0 ? 2 : 3);
            const isWinner = realRank === 1;
            return (
              <div key={entry?.student_id || index} className={`flex flex-1 flex-col items-center rounded-[28px] bg-white/10 p-3 ${isWinner ? 'min-h-44' : 'min-h-36'}`}>
                <div className="relative">
                  <Avatar src={entry?.photo_url} name={entry?.full_name || 'Student'} className={isWinner ? 'size-20 rounded-[28px]' : 'size-16'} />
                  <span className="absolute -right-1 -top-2 grid size-8 place-items-center rounded-full bg-amber-300 text-sm font-black text-ink">{realRank}</span>
                </div>
                {isWinner && <Crown className="mt-2 text-amber-300" size={24} />}
                <p className="mt-2 line-clamp-1 text-center text-sm font-black">{entry?.full_name?.split(' ')[0] || '--'}</p>
                <p className="text-xs text-slate-300">{minutesToHuman(entry?.study_minutes || 0)}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="mt-5 space-y-3">
        {loading ? <p className="text-center text-sm font-semibold text-slate-500">Loading leaderboard...</p> : rest.map(entry => (
          <GlassCard key={entry.student_id} className={`p-4 ${entry.student_id === student?.id ? 'ring-2 ring-amber-300' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-sm font-black">#{entry.rank}</div>
              <Avatar src={entry.photo_url} name={entry.full_name} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-black text-ink">{entry.full_name}</h3>
                <p className="text-xs font-semibold text-slate-500">Seat {entry.seat_no || 'NA'} • {entry.attendance_days} days • {entry.current_streak} streak</p>
              </div>
              <div className="text-right"><p className="font-black text-ink">{minutesToHuman(entry.study_minutes)}</p><p className="text-xs font-bold text-slate-500">{entry.points} pts</p></div>
            </div>
          </GlassCard>
        ))}
      </div>

      {myRow && myRow.rank > 10 && (
        <GlassCard className="sticky bottom-24 mt-5 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <Medal className="text-amber-600" />
            <div className="flex-1"><p className="text-sm font-black text-ink">Your current rank: #{myRow.rank}</p><p className="text-xs font-semibold text-slate-500">Study {minutesToHuman(myRow.study_minutes)} to enter top 10.</p></div>
            <Sparkles className="text-amber-500" />
          </div>
        </GlassCard>
      )}
    </Page>
  );
}
