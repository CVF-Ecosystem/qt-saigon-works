import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export type DocumentType =
  | 'contract'
  | 'invoice'
  | 'handover'
  | 'photo'
  | 'payment_dossier'
  | 'other';

export interface ProjectDocument {
  id: string;
  company_id: string;
  project_id: string | null;
  title: string;
  document_type: DocumentType;
  storage_path: string;
  uploaded_by: string | null;
  created_at: string;
  project?: { code: string; name: string };
  uploader?: { full_name: string };
}

export interface DocumentUploadInput {
  project_id: string | null;
  title: string;
  document_type: DocumentType;
  file: File;
}

const BUCKET = 'project-documents';

export function useDocuments(projectId?: string) {
  return useQuery({
    queryKey: ['documents', projectId ?? null],
    queryFn: async () => {
      if (!supabase) throw new Error('Supabase not configured');

      let query = supabase
        .from('documents')
        .select(`
          *,
          project:projects(code, name),
          uploader:profiles!uploaded_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectDocument[];
    },
  });
}

export async function getSignedUrl(storagePath: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600);
  if (error || !data?.signedUrl) throw error ?? new Error('Không thể tạo link tải');
  return data.signedUrl;
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: DocumentUploadInput) => {
      if (!supabase) throw new Error('Supabase not configured');
      if (!profile?.company_id) throw new Error('Không tìm thấy thông tin công ty');

      const ext = input.file.name.split('.').pop() ?? 'bin';
      const docId = crypto.randomUUID();
      const projectSegment = input.project_id ?? 'general';
      const storagePath = `${profile.company_id}/${projectSegment}/${docId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, input.file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          company_id: profile.company_id,
          project_id: input.project_id,
          title: input.title,
          document_type: input.document_type,
          storage_path: storagePath,
          uploaded_by: profile.id,
        })
        .select()
        .single();

      if (insertError) {
        // Clean up orphaned file if DB insert fails
        await supabase.storage.from(BUCKET).remove([storagePath]);
        throw insertError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      if (!supabase) throw new Error('Supabase not configured');

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      await supabase.storage.from(BUCKET).remove([storagePath]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
