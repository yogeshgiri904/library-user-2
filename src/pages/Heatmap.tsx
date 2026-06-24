import { Flame, TrendingUp } from 'lucide-react';
import { HeatmapGrid } from '../components/HeatmapGrid';
import { Page, SectionTitle, StatCard } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { minutesToHuman } from '../utils/time';

export function Heatmap() {
  const { student } = useAuth();
  const { rows, stats } = useAttendance(student?.id);
  if (!student) return null;
  return (
    <Page>
      <SectionTitle title="Attendance Heatmap" subtitle="GitHub-style yearly study consistency" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatCard label="Monthly Hours" value={minutesToHuman(stats.monthMinutes)} hint={`${stats.monthDays} valid days`} icon={<TrendingUp size={18} />} />
        <StatCard label="Monthly Streak" value={`${student.monthly_streak} days`} hint="1h+ sessions" icon={<Flame className="animate-flame text-amber-500" size={18} />} />
      </div>
      <HeatmapGrid rows={rows} />
    </Page>
  );
}
