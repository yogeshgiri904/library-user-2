import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Loader2, ScanLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PrimaryButton, SecondaryButton } from './ui';

const SCANNER_ID = 'bhaiyaji-qr-reader';

type Props = {
  disabled?: boolean;
  onResult: (raw: string) => Promise<void> | void;
};

export function QRScannerBox({ disabled, onResult }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = async () => {
    const scanner = scannerRef.current;
    if (scanner?.isScanning) await scanner.stop();
    setRunning(false);
  };

  const start = async () => {
    if (disabled || running) return;
    setError(null);
    setBusy(true);
    try {
      const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        async decodedText => {
          await stop();
          await onResult(decodedText);
        },
        () => undefined
      );
      setRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera permission failed.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => () => { void stop(); }, []);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-ink p-3 shadow-soft">
        <div id={SCANNER_ID} className="min-h-[290px] overflow-hidden rounded-[24px] bg-slate-950" />
        {!running && (
          <div className="absolute inset-3 grid place-items-center rounded-[24px] bg-[radial-gradient(circle,rgba(245,158,11,.18),transparent_42%),linear-gradient(135deg,#0f172a,#111827)] text-center text-white">
            <div>
              <div className="mx-auto grid size-20 place-items-center rounded-[28px] bg-white/10 text-amber-300 backdrop-blur">
                {busy ? <Loader2 className="animate-spin" size={34} /> : <Camera size={34} />}
              </div>
              <h3 className="mt-4 text-xl font-black">Scan Library QR</h3>
              <p className="mx-auto mt-1 max-w-[240px] text-sm text-slate-300">Point camera at permanent check-in or check-out QR near gate.</p>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="size-60 rounded-[28px] border-2 border-amber-300/80 shadow-[0_0_0_999px_rgba(0,0,0,.18)]" />
          {running && <ScanLine className="absolute animate-pulse text-amber-300" size={240} />}
        </div>
      </div>
      {error && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <PrimaryButton onClick={start} disabled={disabled || busy || running}>{busy ? 'Starting...' : 'Start Scan'}</PrimaryButton>
        <SecondaryButton onClick={stop} disabled={!running}>Stop</SecondaryButton>
      </div>
    </div>
  );
}
