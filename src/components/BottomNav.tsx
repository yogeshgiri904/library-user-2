import { Award, Home, IdCard, QrCode, Trophy, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/heatmap', label: 'Track', icon: Trophy },
  { to: '/scan', label: 'Scan', icon: QrCode, center: true },
  { to: '/badges', label: 'Rewards', icon: Award },
  { to: '/profile', label: 'Profile', icon: User }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-3 pb-3 sm:max-w-2xl">
      <div className="relative grid grid-cols-5 items-center rounded-[28px] border border-white/70 bg-white/90 p-2 shadow-[0_18px_50px_rgba(15,23,42,.18)] backdrop-blur-xl">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx('group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-black transition', item.center ? '-mt-8' : '', isActive ? 'text-ink' : 'text-slate-400')}>
              {({ isActive }) => (
                <>
                  <span className={clsx('grid size-9 place-items-center rounded-2xl transition', item.center && 'size-16 rounded-[26px] bg-gradient-to-br from-amber-300 to-orange-500 text-ink shadow-glow', !item.center && isActive && 'bg-slate-100')}>
                    <Icon size={item.center ? 28 : 20} />
                  </span>
                  {!item.center && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
