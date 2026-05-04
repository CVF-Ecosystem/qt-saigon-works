import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type CostStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'ordered' | 'delivered' | 'paid' | 'closed';

export interface ProjectCost {
  id: string;
  project_id: string;
  category_id: string | null;
  cost_date: string;
  description: string;
  amount: number;
  vendor_name: string | null;
  employee_id: string | null;
  status: CostStatus;
  document_url: string | null;
  created_by: string | null;
  created_at: string;
  // Joined data
  project?: {
    code: string;
    name: string;
  };
  category?: {
    name: string;
  };
  employee?: {
    full_name: string;
  };
}

export interface CostInput {
  project_id: string;
  category_id: string | null;
  cost_date: string;
  description: string;
  amount: number;
  vendor_name?: string | null;
  employee_id?: string | null;
  status?: CostStatus;
  document_url?: string | null;
}

export function useCosts(projectId?: string) {
  return useQuery({
    queryKey: ['costs', projectId],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('project_costs')
        .select(`
          *,
          project:projects(code, name),
          category:cost_categories(name),
          employee:employees(full_name)
        `)
        .order('cost_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectCost[];
    },
  });
}

export function useCreateCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CostInput) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase
        .from('project_costs')
        .insert({
          ...input,
          created_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costs'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}

export function useUpdateCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CostInput> }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('project_costs')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costs'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}

export function useDeleteCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('project_costs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costs'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}
