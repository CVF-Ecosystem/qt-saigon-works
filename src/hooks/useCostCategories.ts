import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface CostCategory {
  id: string;
  company_id: string;
  name: string;
  accounting_hint: string | null;
}

export type CostCategoryInput = Omit<CostCategory, 'id' | 'company_id'>;

export function useCostCategories() {
  return useQuery({
    queryKey: ['cost-categories'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('cost_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as CostCategory[];
    },
  });
}

export function useCreateCostCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CostCategoryInput) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('cost_categories')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data as CostCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-categories'] });
    },
  });
}

export function useUpdateCostCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CostCategoryInput }) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('cost_categories')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as CostCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-categories'] });
    },
  });
}

export function useDeleteCostCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { error } = await supabase.from('cost_categories').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-categories'] });
    },
  });
}
