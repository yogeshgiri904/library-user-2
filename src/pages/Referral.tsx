import { useEffect, useMemo, useState } from 'react';
import { Copy, Gift, Share2, Trophy, Users } from 'lucide-react';
import { Avatar, GlassCard, Page, Pill, PrimaryButton, SectionTitle, StatCard } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Referral } from '../types';

interface ReferralLeader { student_id: string; full_name: string; photo_url: string | null; referrals: number; rank: number }

export function Referral() {
  const { student } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [leaders, setLeaders] = useState<ReferralLeader[]>([]);

  useEffect(() => {
    if (!student) return;
    supabase.from('referrals').select('*').eq('referrer_student_id', student.id).order('created_at', { ascending: false }).then(({ data }) => setReferrals((data || []) as Referral[]));
    supabase.rpc('get_referral_leaderboard').then(({ data }) => setLeaders((data || []) as ReferralLeader[]));
  }, [student]);

  const totals = useMemo(() => ({
    count: referrals.length,
    pending: referrals.filter(r => r.reward_status === 'pending').reduce((s, r) => s + Number(r.reward_amount || 0), 0),
    earned: referrals.filter(r => r.reward_status === 'earned').reduce((s, r) => s + Number(r.reward_amount || 0), 0)
  }), [referrals]);

  if (!student) return null;
  const whatsappText = `Join Bhaiya Ji Library using my referral code: ${student.referral_code || 'YOGESH12'}`;
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Page>
      <SectionTitle title="Referral Program" subtitle="Bring serious students, earn rewards" right={<Pill className="bg-emerald-100 text-emerald-700"><Gift size={14} /> ₹0 tools</Pill>} />
      <GlassCard className="bg-premium-radial text-white">
        <p className="text-xs font-black uppercase tracking-widest text-amber-200">Your referral code</p>
        <div className="mt-3 flex items-center justify-between rounded-[26px] bg-white/10 p-4">
          <h1 className="text-4xl font-black tracking-widest">{student.referral_code || 'YOGESH12'}</h1>
          <button onClick={() => navigator.clipboard.writeText(student.referral_code || 'YOGESH12')} className="grid size-12 place-items-center rounded-2xl bg-white text-ink"><Copy size={20} /></button>
        </div>
        <PrimaryButton onClick={share} className="mt-4 bg-gradient-to-r from-emerald-300 to-green-500 text-ink"><Share2 size={18} /> Share on WhatsApp</PrimaryButton>
      </GlassCard>
      <div className="my-5 grid grid-cols-3 gap-3">
        <StatCard label="Total" value={`${totals.count}`} icon={<Users size={17} />} />
        <StatCard label="Pending" value={`₹${totals.pending}`} icon={<Gift size={17} />} />
        <StatCard label="Earned" value={`₹${totals.earned}`} icon={<Trophy size={17} />} />
      </div>
      <SectionTitle title="Referral Leaders" subtitle="Top promoters this month" />
      <div className="space-y-3">
        {leaders.slice(0, 8).map(entry => (
          <GlassCard key={entry.student_id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-sm font-black text-amber-700">#{entry.rank}</div>
              <Avatar src={entry.photo_url} name={entry.full_name} />
              <div className="flex-1"><h3 className="font-black text-ink">{entry.full_name}</h3><p className="text-xs font-semibold text-slate-500">{entry.referrals} referrals</p></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </Page>
  );
}
