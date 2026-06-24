import confetti from 'canvas-confetti';
import { useState } from 'react';
import { AlertTriangle, BadgeCheck, Clock, LockKeyhole } from 'lucide-react';
import { QRScannerBox } from '../components/QRScannerBox';
import { GlassCard, Page, Pill, SectionTitle } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import { supabase } from '../lib/supabase';
import { parseScanPayload } from '../utils/scan';
import { formatClock, minutesToHuman } from '../utils/time';

export function Scan() {
  const { student, isActive, refreshStudent } = useAuth();
  const { todayRow, reload } = useAttendance(student?.id);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (raw: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = parseScanPayload(raw);
      const { data, error } = await supabase.rpc('process_qr_scan', { p_payload: payload });
      if (error) throw error;
      setMessage({ type: 'success', text: String(data || 'Attendance updated successfully.') });
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.78 } });
      await reload();
      await refreshStudent();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Scan failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <SectionTitle title="QR Attendance" subtitle="Secure 1-minute cooldown scan flow" right={<Pill className="bg-slate-900 text-white">Asia/Kolkata</Pill>} />
      {!isActive && (
        <GlassCard className="mb-4 border-red-100 bg-red-50">
          <div className="flex gap-3">
            <LockKeyhole className="text-red-500" />
            <div>
              <h3 className="font-black text-red-700">Scan locked</h3>
              <p className="text-sm font-semibold leading-6 text-red-600">Expired members can open the app, but cannot check in/out. Renew your membership with admin.</p>
            </div>
          </div>
        </GlassCard>
      )}
      <QRScannerBox disabled={!isActive || loading} onResult={handleScan} />
      {message && (
        <div className={`mt-4 rounded-[24px] p-4 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <GlassCard className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Current Status</p>
            <h2 className="text-2xl font-black text-ink">{todayRow?.status || 'not_started'}</h2>
          </div>
          {todayRow?.status === 'checked_in' ? <BadgeCheck className="text-emerald-500" /> : <Clock className="text-amber-500" />}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">In</p><p className="font-black">{formatClock(todayRow?.checkin_time)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">Out</p><p className="font-black">{formatClock(todayRow?.checkout_time)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-3"><p className="text-slate-500">Study</p><p className="font-black">{minutesToHuman(todayRow?.duration_minutes || 0)}</p></div>
        </div>
        <div className="mt-4 flex gap-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
          <AlertTriangle className="shrink-0" size={18} />
          <p>Below 1 hour session is saved as a visit only. Streak and badges count only after 1 hour.</p>
        </div>
      </GlassCard>
    </Page>
  );
}
