import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type ProjectStatus = 'preparing' | 'active' | 'paused' | 'handover' | 'warranty' | 'closed';

export interface Project {
  id: string;
  company_id: string;
  client_id: string | null;
  code: string;
  name: string;
  site_address: string | null;
  manager_id: string | null;
  status: ProjectStatus;
  contract_value: number;
  estimated_cost: number;
  progress_percent: number;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'company_id' | 'created_at'>;

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProjectInput) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('projects')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ProjectInput }) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('projects')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
