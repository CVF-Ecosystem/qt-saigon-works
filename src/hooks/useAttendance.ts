import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface AttendanceEntry {
  id: string;
  company_id: string;
  project_id: string;
  employee_id: string;
  work_date: string;
  work_units: number;
  overtime_hours: number;
  allowance: number;
  note: string | null;
  created_by: string | null;
  created_at: string;
  // Joined
  project?: { code: string; name: string };
  employee?: { full_name: string; base_daily_rate: number; employee_code: string | null };
}

export interface AttendanceInput {
  project_id: string;
  employee_id: string;
  work_date: string;
  work_units: number;
  overtime_hours?: number;
  allowance?: number;
  note?: string | null;
}

export function useAttendance(filters?: { projectId?: string; employeeId?: string; month?: string }) {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('attendance_entries')
        .select(`
          *,
          project:projects(code, name),
          employee:employees(full_name, base_daily_rate, employee_code)
        `)
        .order('work_date', { ascending: false });

      if (filters?.projectId) query = query.eq('project_id', filters.projectId);
      if (filters?.employeeId) query = query.eq('employee_id', filters.employeeId);
      if (filters?.month) {
        // month format: YYYY-MM
        query = query
          .gte('work_date', `${filters.month}-01`)
          .lte('work_date', `${filters.month}-31`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceEntry[];
    },
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AttendanceInput) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase
        .from('attendance_entries')
        .insert({
          ...input,
          company_id: profile?.company_id,
          created_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<AttendanceInput> }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('attendance_entries')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('attendance_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// Calculate payroll estimate from attendance entries
export function calcPayroll(entries: AttendanceEntry[]) {
  return entries.reduce((acc, entry) => {
    const dailyRate = entry.employee?.base_daily_rate ?? 0;
    const basePay = dailyRate * entry.work_units;
    const overtimePay = (dailyRate / 8) * 1.5 * entry.overtime_hours;
    const allowance = entry.allowance;
    return acc + basePay + overtimePay + allowance;
  }, 0);
}
