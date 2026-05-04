import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { RequestStatus } from './useMaterialRequests';

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  material_id: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  material?: { name: string; unit: string };
}

export interface PurchaseOrder {
  id: string;
  company_id: string;
  project_id: string | null;
  supplier_id: string | null;
  po_number: string;
  order_date: string;
  status: RequestStatus;
  total_amount: number;
  created_at: string;
  project?: { code: string; name: string };
  supplier?: { name: string; phone: string | null };
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderInput {
  project_id?: string | null;
  supplier_id?: string | null;
  po_number: string;
  order_date: string;
  status?: RequestStatus;
  item: {
    id?: string;
    material_id?: string | null;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
  };
}

function calcTotal(input: PurchaseOrderInput) {
  return input.item.quantity * input.item.unit_price;
}

export function usePurchaseOrders(projectId?: string) {
  return useQuery({
    queryKey: ['purchase-orders', projectId],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('purchase_orders')
        .select(`
          *,
          project:projects(code, name),
          supplier:suppliers(name, phone),
          items:purchase_order_items(
            id,
            purchase_order_id,
            material_id,
            description,
            quantity,
            unit,
            unit_price,
            material:material_items(name, unit)
          )
        `)
        .order('order_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: PurchaseOrderInput) => {
      if (!supabase) throw new Error('Supabase not configured');
      if (!profile?.company_id) throw new Error('Không tìm thấy công ty hiện tại');

      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          company_id: profile.company_id,
          project_id: input.project_id || null,
          supplier_id: input.supplier_id || null,
          po_number: input.po_number,
          order_date: input.order_date,
          status: input.status || 'draft',
          total_amount: calcTotal(input),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('purchase_order_items')
        .insert({
          purchase_order_id: order.id,
          material_id: input.item.material_id || null,
          description: input.item.description,
          quantity: input.item.quantity,
          unit: input.item.unit,
          unit_price: input.item.unit_price,
        });

      if (itemError) throw itemError;
      return order as PurchaseOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: PurchaseOrderInput }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error: orderError } = await supabase
        .from('purchase_orders')
        .update({
          project_id: input.project_id || null,
          supplier_id: input.supplier_id || null,
          po_number: input.po_number,
          order_date: input.order_date,
          status: input.status || 'draft',
          total_amount: calcTotal(input),
        })
        .eq('id', id);

      if (orderError) throw orderError;

      if (input.item.id) {
        const { error: itemError } = await supabase
          .from('purchase_order_items')
          .update({
            material_id: input.item.material_id || null,
            description: input.item.description,
            quantity: input.item.quantity,
            unit: input.item.unit,
            unit_price: input.item.unit_price,
          })
          .eq('id', input.item.id);

        if (itemError) throw itemError;
      } else {
        const { error: itemError } = await supabase
          .from('purchase_order_items')
          .insert({
            purchase_order_id: id,
            material_id: input.item.material_id || null,
            description: input.item.description,
            quantity: input.item.quantity,
            unit: input.item.unit,
            unit_price: input.item.unit_price,
          });

        if (itemError) throw itemError;
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('purchase_orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as PurchaseOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}
