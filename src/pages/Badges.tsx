import { useEffect, useState } from 'react';
import { Award, Flame, Lock } from 'lucide-react';
import { GlassCard, Page, Pill, SectionTitle } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { BadgeRow, StudentBadgeRow } from '../types';

export function Badges() {
  const { student } = useAuth();
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [earned, setEarned] = useState<StudentBadgeRow[]>([]);

  useEffect(() => {
    supabase.from('badges').select('*').order('required_streak_days').then(({ data }) => setBadges((data || []) as BadgeRow[]));
    if (student) {
      supabase.from('student_badges').select('*, badges(*)').eq('student_id', student.id).then(({ data }) => setEarned((data || []) as StudentBadgeRow[]));
    }
  }, [student]);

  const earnedCodes = new Set(earned.map(row => row.badges?.code));

  return (
    <Page>
      <SectionTitle title="Achievements" subtitle="Streak badges unlock at 7, 15, 30, 60, 90, 180, 365 days" right={<Pill className="bg-amber-100 text-amber-700"><Flame className="animate-flame" size={14} /> {student?.current_streak || 0}</Pill>} />
      <GlassCard className="mb-5 bg-gradient-to-br from-amber-50 to-white">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-[24px] bg-amber-200 text-3xl animate-flame">🔥</div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-amber-600">Current streak</p>
            <h2 className="text-3xl font-black text-ink">{student?.current_streak || 0} days</h2>
            <p className="text-sm font-semibold text-slate-500">Longest: {student?.longest_streak || 0} days</p>
          </div>
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map(badge => {
          const unlocked = earnedCodes.has(badge.code) || (student?.current_streak || 0) >= (badge.required_streak_days || 0);
          return (
            <GlassCard key={badge.id} className={`p-4 text-center ${unlocked ? 'bg-white' : 'opacity-70 grayscale'}`}>
              <div className={`mx-auto grid size-16 place-items-center rounded-[24px] text-3xl ${unlocked ? 'bg-amber-100' : 'bg-slate-100'}`}>{unlocked ? badge.icon : <Lock size={24} />}</div>
              <h3 className="mt-3 font-black text-ink">{badge.title}</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{badge.description}</p>
              <Pill className={unlocked ? 'mt-3 bg-emerald-100 text-emerald-700' : 'mt-3 bg-slate-100 text-slate-500'}>{unlocked ? <><Award size={13} /> Unlocked</> : `${badge.required_streak_days} days`}</Pill>
            </GlassCard>
          );
        })}
      </div>
    </Page>
  );
}
