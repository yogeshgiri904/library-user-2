import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CalendarClock, Flame, IdCard, Medal, QrCode, Sparkles, Trophy } from 'lucide-react';
import { Avatar, GlassCard, Page, Pill, PrimaryButton, SectionTitle, StatCard } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { LIBRARY_NAME, QUOTES } from '../lib/constants';
import { formatClock, formatDate, minutesToHuman } from '../utils/time';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export function Home() {
  const { student, isActive } = useAuth();
  const { todayRow, stats } = useAttendance(student?.id);
  const [rank, setRank] = useState<number | null>(null);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => {
    if (!student) return;
    supabase.rpc('get_my_monthly_rank').then(({ data }) => setRank(typeof data === 'number' ? data : null));
  }, [student]);

  if (!student) return null;

  return (
    <Page>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[34px] bg-premium-radial p-5 text-white shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={student.photo_url} name={student.full_name} className="size-14 rounded-[22px]" />
            <div>
              <p className="text-sm text-slate-300">Namaste,</p>
              <h1 className="text-2xl font-black leading-tight">{student.full_name.split(' ')[0]}</h1>
            </div>
          </div>
          <Link to="/announcements" className="grid size-12 place-items-center rounded-2xl bg-white/10"><Bell size={20} /></Link>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Seat</p><p className="font-black">{student.seat_no || 'NA'}</p></div>
          <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Status</p><p className={isActive ? 'font-black text-emerald-300' : 'font-black text-red-300'}>{isActive ? 'Active' : 'Expired'}</p></div>
          <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Renewal</p><p className="font-black">{formatDate(student.renewal_date)}</p></div>
        </div>
        {!isActive && <p className="mt-4 rounded-2xl bg-red-500/15 p-3 text-sm font-bold text-red-100">Membership expired. App open rahega, but QR check-in/out locked hai.</p>}
      </motion.header>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <StatCard label="Today" value={minutesToHuman(stats.todayMinutes)} hint={todayRow?.status === 'checked_in' ? 'Currently studying' : 'Total study'} icon={<CalendarClock size={18} />} />
        <StatCard label="Streak" value={`${student.current_streak} days`} hint={`Best ${student.longest_streak}`} icon={<Flame className="animate-flame text-amber-500" size={18} />} />
        <StatCard label="Month" value={minutesToHuman(stats.monthMinutes)} hint={`${stats.monthDays} valid days`} icon={<Trophy size={18} />} />
        <StatCard label="Rank" value={rank ? `#${rank}` : '--'} hint="Monthly hours" icon={<Medal size={18} />} />
      </section>

      <GlassCard className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Today Attendance</p>
            <h2 className="text-2xl font-black text-ink">{todayRow?.status === 'checked_in' ? 'Checked in 🔥' : todayRow?.status === 'checked_out' ? 'Session complete' : 'Ready to scan'}</h2>
          </div>
          <Pill className={todayRow?.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>{todayRow?.status || 'not_started'}</Pill>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">Check-in</p><p className="font-black">{formatClock(todayRow?.checkin_time)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">Check-out</p><p className="font-black">{formatClock(todayRow?.checkout_time)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">Study</p><p className="font-black">{minutesToHuman(todayRow?.duration_minutes || 0)}</p></div>
        </div>
        <Link to="/scan"><PrimaryButton className="mt-4 bg-gradient-to-r from-amber-400 to-orange-500 text-ink"><QrCode size={19} /> Scan QR Now</PrimaryButton></Link>
      </GlassCard>

      <SectionTitle title="Quick Actions" subtitle="One tap student shortcuts" />
      <div className="grid grid-cols-3 gap-3">
        <Link to="/card"><GlassCard className="p-4 text-center"><IdCard className="mx-auto" /><p className="mt-2 text-xs font-black">Card</p></GlassCard></Link>
        <Link to="/leaderboard"><GlassCard className="p-4 text-center"><Trophy className="mx-auto" /><p className="mt-2 text-xs font-black">Leaderboard</p></GlassCard></Link>
        <Link to="/referral"><GlassCard className="p-4 text-center"><Sparkles className="mx-auto" /><p className="mt-2 text-xs font-black">Referral</p></GlassCard></Link>
      </div>

      <GlassCard className="mt-5 bg-gradient-to-br from-amber-50 to-white">
        <p className="text-xs font-black uppercase tracking-widest text-amber-600">Daily Motivation</p>
        <p className="mt-2 text-lg font-black leading-7 text-ink">“{quote}”</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">— {LIBRARY_NAME}</p>
      </GlassCard>
    </Page>
  );
}
