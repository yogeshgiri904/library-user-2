import { FormEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenCheck, Eye, EyeOff, Flame, Lock, UserRound } from 'lucide-react';
import { LIBRARY_NAME, LIBRARY_PLACE } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { PrimaryButton } from '../components/ui';

export function Login() {
  const { login, session } = useAuth();
  const location = useLocation();
  const [libraryId, setLibraryId] = useState('BJLIB001');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to={(location.state as { from?: { pathname: string } })?.from?.pathname || '/'} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(libraryId, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-premium-radial px-5 py-8 text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-between">
        <section>
          <div className="flex items-center justify-between">
            <div className="grid size-14 place-items-center rounded-[22px] bg-white/10 shadow-glow backdrop-blur-xl"><BookOpenCheck className="text-amber-300" /></div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-200">PWA Ready</div>
          </div>
          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-4 py-2 text-sm font-black text-amber-200"><Flame className="animate-flame" size={18} /> Study streak starts here</div>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight">Bhaiya Ji<br />Student Hub</h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-slate-300">QR attendance, study hours, leaderboard, digital card, badges and referral rewards for serious library students.</p>
          </div>
        </section>

        <form onSubmit={submit} className="mt-8 rounded-[34px] border border-white/15 bg-white/10 p-4 shadow-[0_24px_80px_rgba(0,0,0,.28)] backdrop-blur-2xl">
          <div className="rounded-[28px] bg-white p-4 text-ink">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{LIBRARY_PLACE}</p>
              <h2 className="text-2xl font-black">Login to {LIBRARY_NAME}</h2>
            </div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Library ID</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
              <UserRound size={20} className="text-slate-500" />
              <input value={libraryId} onChange={e => setLibraryId(e.target.value.toUpperCase())} placeholder="BJLIB001" className="w-full bg-transparent font-black outline-none" />
            </div>
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
              <Lock size={20} className="text-slate-500" />
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full bg-transparent font-black outline-none" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {error && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
            <PrimaryButton type="submit" disabled={loading} className="mt-5 bg-gradient-to-r from-slate-950 to-slate-800">{loading ? 'Opening hub...' : 'Enter Student Hub'}</PrimaryButton>
            <p className="mt-4 text-center text-xs font-semibold text-slate-400">Demo after SQL seed: BJLIB001 / student123</p>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
