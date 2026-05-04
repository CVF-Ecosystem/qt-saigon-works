import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type RequestStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'ordered' | 'delivered' | 'paid' | 'closed';

export interface MaterialRequest {
  id: string;
  project_id: string;
  material_id: string | null;
  requested_by: string | null;
  description: string;
  quantity: number;
  unit: string;
  needed_date: string | null;
  status: RequestStatus;
  created_at: string;
  // Joined
  project?: { code: string; name: string };
  material?: { name: string; unit: string };
  requester?: { full_name: string };
}

export interface MaterialRequestInput {
  project_id: string;
  material_id?: string | null;
  description: string;
  quantity: number;
  unit: string;
  needed_date?: string | null;
  status?: RequestStatus;
}

export function useMaterialRequests(projectId?: string) {
  return useQuery({
    queryKey: ['material-requests', projectId],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('material_requests')
        .select(`
          *,
          project:projects(code, name),
          material:material_items(name, unit),
          requester:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MaterialRequest[];
    },
  });
}

export function useCreateMaterialRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MaterialRequestInput) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('material_requests')
        .insert({ ...input, requested_by: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
    },
  });
}

export function useUpdateMaterialRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<MaterialRequestInput> & { status?: RequestStatus } }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('material_requests')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
    },
  });
}

export function useDeleteMaterialRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('material_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-requests'] });
    },
  });
}
