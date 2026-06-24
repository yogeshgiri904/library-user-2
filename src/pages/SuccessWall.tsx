import { useEffect, useState } from 'react';
import { Heart, Quote, Trophy } from 'lucide-react';
import { GlassCard, Page, Pill, SectionTitle } from '../components/ui';
import { supabase } from '../lib/supabase';
import type { SuccessWallItem } from '../types';

export function SuccessWall() {
  const [items, setItems] = useState<SuccessWallItem[]>([]);
  useEffect(() => {
    supabase.from('success_wall').select('*').eq('is_published', true).order('year', { ascending: false }).limit(20).then(({ data }) => setItems((data || []) as SuccessWallItem[]));
  }, []);

  return (
    <Page>
      <SectionTitle title="Success Wall" subtitle="Proof that silent hours become loud results" right={<Pill className="bg-amber-100 text-amber-700"><Trophy size={14} /> Hall of Fame</Pill>} />
      <div className="space-y-5">
        {items.map(item => (
          <GlassCard key={item.id} className="overflow-hidden p-0">
            <img src={item.photo_url} alt={item.student_name} className="h-60 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3"><Pill className="bg-emerald-100 text-emerald-700">{item.exam_name} • {item.year}</Pill><span className="flex items-center gap-1 text-sm font-black text-red-500"><Heart size={16} fill="currentColor" /> {item.likes}</span></div>
              <h3 className="mt-3 text-2xl font-black text-ink">{item.student_name}</h3>
              <p className="mt-1 text-sm font-bold text-amber-600">{item.achievement}</p>
              <div className="mt-4 flex gap-3 rounded-[24px] bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600"><Quote className="shrink-0 text-slate-300" /> {item.testimonial}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </Page>
  );
}
