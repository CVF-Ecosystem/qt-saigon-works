import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export interface MaterialItem {
  id: string;
  company_id: string;
  name: string;
  unit: string;
  reference_price: number;
  active: boolean;
}

export type MaterialInput = Omit<MaterialItem, 'id' | 'company_id'>;

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('material_items')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as MaterialItem[];
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: MaterialInput) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');
      if (!profile?.company_id) throw new Error('Không tìm thấy công ty hiện tại');

      const { data, error } = await supabase
        .from('material_items')
        .insert([{ ...input, company_id: profile.company_id }])
        .select()
        .single();

      if (error) throw error;
      return data as MaterialItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: MaterialInput }) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { data, error } = await supabase
        .from('material_items')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as MaterialItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase chưa được cấu hình');

      const { error } = await supabase.from('material_items').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}
