import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Award, Bell, CreditCard, Flame, LogOut, MapPin, QrCode, Share2, ShieldCheck, Trophy } from 'lucide-react';
import { Avatar, GlassCard, Page, Pill, PrimaryButton, SectionTitle, StatCard } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { formatDate, minutesToHuman } from '../utils/time';
import { LIBRARY_NAME, LIBRARY_PLACE } from '../lib/constants';

export function Profile() {
  const { student, isActive, logout } = useAuth();
  const { stats } = useAttendance(student?.id);
  const { canInstall, installed, install } = usePwaInstall();
  if (!student) return null;
  return (
    <Page>
      <SectionTitle title="Profile" subtitle="Your study identity and account details" />
      <GlassCard className="bg-premium-radial text-white">
        <div className="flex items-center gap-4">
          <Avatar src={student.photo_url} name={student.full_name} className="size-24 rounded-[32px]" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-3xl font-black">{student.full_name}</h1>
            <p className="mt-1 text-sm font-bold text-amber-200">{student.library_id} • Seat {student.seat_no || 'NA'}</p>
            <Pill className={isActive ? 'mt-3 bg-emerald-400/20 text-emerald-200' : 'mt-3 bg-red-400/20 text-red-200'}><ShieldCheck size={14} /> {isActive ? 'Active Member' : 'Expired Member'}</Pill>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-xs text-slate-300">Join Date</p><p className="font-black">{formatDate(student.join_date)}</p></div>
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-xs text-slate-300">Renewal</p><p className="font-black">{formatDate(student.renewal_date)}</p></div>
        </div>
      </GlassCard>
      <div className="my-5 grid grid-cols-2 gap-3">
        <StatCard label="All Time" value={minutesToHuman(stats.allTimeMinutes)} hint={`${stats.allTimeDays} valid days`} icon={<Trophy size={18} />} />
        <StatCard label="Points" value={`${student.points}`} hint="Badges + scans" icon={<Award size={18} />} />
        <StatCard label="Streak" value={`${student.current_streak}`} hint={`Best ${student.longest_streak}`} icon={<Flame className="animate-flame text-amber-500" size={18} />} />
        <StatCard label="Month" value={minutesToHuman(stats.monthMinutes)} hint={`${student.monthly_streak} day streak`} icon={<CreditCard size={18} />} />
      </div>
      <div className="space-y-3">
        <Link to="/card"><ProfileLink icon={<CreditCard />} title="Digital Membership Card" text="Download or share as image" /></Link>
        <Link to="/announcements"><ProfileLink icon={<Bell />} title="Announcements" text="Holidays, tests, fee reminders" /></Link>
        <Link to="/success-wall"><ProfileLink icon={<Trophy />} title="Success Wall" text="Selected students and testimonials" /></Link>
        <Link to="/admin/qr-helper"><ProfileLink icon={<QrCode />} title="QR Generator Helper" text="Create permanent printed gate QR" /></Link>
        <ProfileLink icon={<MapPin />} title={LIBRARY_NAME} text={`${LIBRARY_PLACE} • Premium study space`} />
      </div>
      {(canInstall || !installed) && <PrimaryButton onClick={install} className="mt-5 bg-gradient-to-r from-amber-400 to-orange-500 text-ink">Install PWA on Phone</PrimaryButton>}
      <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-black text-red-600"><LogOut size={18} /> Logout</button>
    </Page>
  );
}

function ProfileLink({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-ink">{icon}</div>
        <div className="flex-1"><h3 className="font-black text-ink">{title}</h3><p className="text-sm font-semibold text-slate-500">{text}</p></div>
        <Share2 className="text-slate-300" size={18} />
      </div>
    </GlassCard>
  );
}
