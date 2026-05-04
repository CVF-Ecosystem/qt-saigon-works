import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  employee_code: string | null;
  phone: string | null;
  job_title: string | null;
  employment_type: string;
  base_daily_rate: number;
  active: boolean;
  created_at: string;
}

export type EmployeeInput = Omit<Employee, 'id' | 'company_id' | 'created_at'>;

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name');

      if (error) throw error;
      return data as Employee[];
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: EmployeeInput) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');
      if (!profile?.company_id) throw new Error('Không tìm thấy công ty hiện tại');

      const { data, error } = await supabase
        .from('employees')
        .insert([{ ...input, company_id: profile.company_id }])
        .select()
        .single();

      if (error) throw error;
      return data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: EmployeeInput }) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('employees')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { error } = await supabase.from('employees').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
