import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AttendanceRow } from '../types';
import { calculateStats } from '../utils/stats';
import { todayISTDate } from '../utils/time';

export function useAttendance(studentId?: string) {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('study_date', { ascending: false })
      .limit(370);
    if (queryError) setError(queryError.message);
    setRows((data || []) as AttendanceRow[]);
    setLoading(false);
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!studentId) return;
    const channel = supabase
      .channel(`attendance-${studentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${studentId}` }, () => load())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [studentId, load]);

  const todayRow = useMemo(() => rows.find(row => row.study_date === todayISTDate()) || null, [rows]);
  const stats = useMemo(() => calculateStats(rows), [rows]);

  return { rows, todayRow, stats, loading, error, reload: load };
}
