import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { CHECKIN_QR, CHECKOUT_QR, LIBRARY_NAME, LIBRARY_PLACE } from '../lib/constants';
import { GlassCard, Page, PrimaryButton, SectionTitle } from '../components/ui';

export function AdminQRHelper() {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  useEffect(() => {
    QRCode.toDataURL(CHECKIN_QR, { width: 300, margin: 2 }).then(setCheckin);
    QRCode.toDataURL(CHECKOUT_QR, { width: 300, margin: 2 }).then(setCheckout);
  }, []);

  const print = () => window.print();
  const download = (src: string, name: string) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = name;
    a.click();
  };

  return (
    <Page className="print:max-w-full print:pb-0">
      <SectionTitle title="QR Generator Helper" subtitle="Print these two permanent QR codes for library gate" />
      <div className="grid gap-4 print:grid-cols-2 sm:grid-cols-2">
        <QRPoster title="CHECK IN" subtitle="Scan when entering library" qr={checkin} payload={CHECKIN_QR} onDownload={() => download(checkin, 'bhaiyaji-checkin-qr.png')} />
        <QRPoster title="CHECK OUT" subtitle="Scan when leaving library" qr={checkout} payload={CHECKOUT_QR} onDownload={() => download(checkout, 'bhaiyaji-checkout-qr.png')} />
      </div>
      <PrimaryButton onClick={print} className="mt-5 print:hidden"><Printer size={18} /> Print Posters</PrimaryButton>
      <GlassCard className="mt-5 text-sm font-semibold leading-6 text-slate-600 print:hidden">These QR codes are permanent. The app validates JSON payload, library slug, active membership, duplicate scans, checkout-without-checkin and 1-minute cooldown using Supabase RPC.</GlassCard>
    </Page>
  );
}

function QRPoster({ title, subtitle, qr, payload, onDownload }: { title: string; subtitle: string; qr: string; payload: string; onDownload: () => void }) {
  return (
    <GlassCard className="break-inside-avoid bg-white text-center print:shadow-none">
      <div className="rounded-[28px] bg-premium-radial p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">{LIBRARY_NAME}</p>
        <h2 className="mt-2 text-4xl font-black">{title}</h2>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
      {qr && <img src={qr} alt={title} className="mx-auto my-5 size-64 rounded-[28px] border-8 border-slate-100" />}
      <p className="font-black text-ink">Scan it to {title.toLowerCase()}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{LIBRARY_PLACE}</p>
      <code className="mt-4 block rounded-2xl bg-slate-100 p-3 text-xs text-slate-600">{payload}</code>
      <button onClick={onDownload} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white print:hidden"><Download size={16} /> Download</button>
    </GlassCard>
  );
}
