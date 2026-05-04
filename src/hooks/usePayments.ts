import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export type PaymentDirection = 'in' | 'out';
export type PaymentStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'ordered' | 'delivered' | 'paid' | 'closed';

export interface Payment {
  id: string;
  company_id: string;
  project_id: string | null;
  payment_date: string;
  direction: PaymentDirection;
  counterparty: string;
  description: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  document_url: string | null;
  created_by: string | null;
  created_at: string;
  // Joined data
  project?: {
    code: string;
    name: string;
  };
}

export interface PaymentInput {
  project_id?: string | null;
  payment_date: string;
  direction: PaymentDirection;
  counterparty: string;
  description: string;
  amount: number;
  method?: string;
  status?: PaymentStatus;
  document_url?: string | null;
}

export function usePayments(projectId?: string) {
  return useQuery({
    queryKey: ['payments', projectId],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('payments')
        .select(`
          *,
          project:projects(code, name)
        `)
        .order('payment_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: PaymentInput) => {
      if (!supabase) throw new Error('Supabase not configured');
      if (!profile?.company_id) throw new Error('Không tìm thấy công ty hiện tại');

      const { data, error } = await supabase
        .from('payments')
        .insert({
          ...input,
          company_id: profile.company_id,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PaymentInput> }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('payments')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['project-finance'] });
    },
  });
}
