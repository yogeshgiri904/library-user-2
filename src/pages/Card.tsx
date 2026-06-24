import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { Download, Share2, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, GlassCard, Page, PrimaryButton, SecondaryButton, SectionTitle } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { LIBRARY_NAME, LIBRARY_PLACE } from '../lib/constants';
import { formatDate } from '../utils/time';

export function Card() {
  const { student, isActive } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (!student) return;
    QRCode.toDataURL(JSON.stringify({ type: 'student_card', library_id: student.library_id, library: 'bhaiyaji' }), { margin: 1, width: 220 }).then(setQr);
  }, [student]);

  if (!student) return null;

  const download = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement('a');
    link.download = `${student.library_id}-bhaiyaji-card.png`;
    link.href = dataUrl;
    link.click();
  };

  const share = async () => {
    if (!cardRef.current) return download();
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${student.library_id}-card.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'Bhaiya Ji Library Card', text: 'My digital membership card', files: [file] });
    } else {
      await navigator.share?.({ title: 'Bhaiya Ji Library Card', text: `${student.full_name} - ${student.library_id}` });
    }
  };

  return (
    <Page>
      <SectionTitle title="Digital Card" subtitle="Download or share your premium membership card" />
      <div ref={cardRef} className="overflow-hidden rounded-[36px] bg-premium-radial p-5 text-white shadow-[0_28px_90px_rgba(15,23,42,.30)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Membership Card</p>
            <h1 className="mt-1 text-2xl font-black">{LIBRARY_NAME}</h1>
            <p className="text-sm text-slate-300">{LIBRARY_PLACE}</p>
          </div>
          <ShieldCheck className="text-emerald-300" size={34} />
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Avatar src={student.photo_url} name={student.full_name} className="size-24 rounded-[32px]" />
          <div>
            <h2 className="text-3xl font-black leading-tight">{student.full_name}</h2>
            <p className="mt-1 text-sm font-bold text-amber-200">Library ID: {student.library_id}</p>
            <p className="text-sm text-slate-300">Seat {student.seat_no || 'NA'}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-xs text-slate-300">Joined</p><p className="font-black">{formatDate(student.join_date)}</p></div>
          <div className="rounded-3xl bg-white/10 p-4"><p className="text-xs text-slate-300">Renewal</p><p className="font-black">{formatDate(student.renewal_date)}</p></div>
        </div>
        <div className="mt-5 flex items-end justify-between gap-4 rounded-[30px] bg-white p-4 text-ink">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Status</p>
            <p className={isActive ? 'text-2xl font-black text-emerald-600' : 'text-2xl font-black text-red-600'}>{isActive ? 'ACTIVE' : 'EXPIRED'}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Powered by Medusa AI Technologies</p>
          </div>
          {qr && <img src={qr} alt="Membership QR" className="size-24 rounded-2xl" />}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <PrimaryButton onClick={download}><Download size={18} /> Download</PrimaryButton>
        <SecondaryButton onClick={share}><Share2 size={18} /> Share</SecondaryButton>
      </div>
      <GlassCard className="mt-5 text-sm font-semibold leading-6 text-slate-600">Show this digital card at reception for quick verification. QR is for identity verification, not attendance scan.</GlassCard>
    </Page>
  );
}
