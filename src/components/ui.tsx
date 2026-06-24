import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={clsx('mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-4 text-slate-900 sm:max-w-5xl sm:px-8', className)}>{children}</main>;
}

export function GlassCard({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.section
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={clsx('rounded-[28px] border border-white/70 bg-card-glow p-5 shadow-soft backdrop-blur-xl', onClick && 'cursor-pointer active:scale-[0.99]', className)}
    >
      {children}
    </motion.section>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold', className)}>{children}</span>;
}

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon?: ReactNode }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        {icon && <div className="grid size-9 place-items-center rounded-2xl bg-slate-100 text-ink">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-black text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p>}
    </GlassCard>
  );
}

export function Avatar({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  const initials = name.split(' ').slice(0, 2).map(v => v[0]).join('').toUpperCase();
  return (
    <div className={clsx('grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-base font-black text-ink shadow-lg', className)}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <GlassCard className="text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-[24px] bg-amber-100 text-3xl">📚</div>
      <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </GlassCard>
  );
}

export function PrimaryButton({ children, className, disabled, onClick, type = 'button' }: { children: ReactNode; className?: string; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={clsx('inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white shadow-soft transition disabled:cursor-not-allowed disabled:bg-slate-300', className)}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({ children, className, onClick, disabled }: { children: ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={clsx('inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm disabled:opacity-50', className)}
    >
      {children}
    </motion.button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-3xl bg-slate-200', className)} />;
}
