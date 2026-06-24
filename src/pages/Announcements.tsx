import { useEffect, useState } from 'react';
import { Bell, CalendarDays, PartyPopper } from 'lucide-react';
import { GlassCard, Page, Pill, SectionTitle } from '../components/ui';
import { supabase } from '../lib/supabase';
import type { Announcement } from '../types';
import { formatDate } from '../utils/time';

const categoryIcon = { holiday: '🏖️', event: '🎯', mock_test: '📝', fee: '💳', notice: '📌' } as const;

export function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => {
    supabase.from('announcements').select('*').eq('is_published', true).order('priority', { ascending: false }).order('published_at', { ascending: false }).limit(20).then(({ data }) => setItems((data || []) as Announcement[]));
  }, []);

  return (
    <Page>
      <SectionTitle title="Announcements" subtitle="Holidays, events, mock tests, fees and notices" right={<Pill className="bg-slate-900 text-white"><Bell size={14} /> Live</Pill>} />
      <div className="space-y-4">
        {items.map(item => (
          <GlassCard key={item.id} className={item.priority >= 8 ? 'border-amber-200 bg-amber-50' : ''}>
            <div className="flex gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-[22px] bg-white text-2xl shadow-sm">{categoryIcon[item.category]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><Pill className="bg-slate-100 text-slate-600">{item.category.replace('_', ' ')}</Pill>{item.priority >= 8 && <Pill className="bg-amber-200 text-amber-800"><PartyPopper size={13} /> Important</Pill>}</div>
                <h3 className="mt-2 text-lg font-black text-ink">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{item.body}</p>
                <p className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-400"><CalendarDays size={14} /> {formatDate(item.published_at)}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </Page>
  );
}
