import { useState, useRef, FormEvent } from 'react';
import { Plus, Download, Trash2, FileText, X } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { InlineLoading } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
  getSignedUrl,
  type DocumentType,
} from '../hooks/useDocuments';
import { useProjects } from '../hooks/useProjects';
import { documentTypeLabel, documentTypeTone, DOCUMENT_TYPE_LABELS } from '../lib/labels';

const ACCEPTED_MIME =
  'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export default function DocumentsPage() {
  const [filterProjectId, setFilterProjectId] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const { data: documents, isLoading } = useDocuments(filterProjectId || undefined);
  const { data: projects } = useProjects();
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();

  // Upload form state
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<DocumentType>('contract');
  const [formProjectId, setFormProjectId] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setFormTitle('');
    setFormType('contract');
    setFormProjectId('');
    setFormFile(null);
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleCloseUpload() {
    resetForm();
    setShowUpload(false);
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!formFile) {
      setUploadError('Vui lòng chọn file');
      return;
    }
    if (!formTitle.trim()) {
      setUploadError('Vui lòng nhập tên tài liệu');
      return;
    }
    setUploadError('');
    uploadDoc.mutate(
      {
        project_id: formProjectId || null,
        title: formTitle.trim(),
        document_type: formType,
        file: formFile,
      },
      {
        onSuccess: () => {
          handleCloseUpload();
        },
        onError: (err) => {
          setUploadError(err instanceof Error ? err.message : 'Upload thất bại');
        },
      }
    );
  }

  async function handleDownload(storagePath: string, title: string) {
    try {
      const url = await getSignedUrl(storagePath);
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = title;
      a.click();
    } catch {
      alert('Không thể tải file. Vui lòng thử lại.');
    }
  }

  function handleDelete(id: string, storagePath: string, title: string) {
    if (!confirm(`Xóa tài liệu "${title}"?`)) return;
    deleteDoc.mutate({ id, storagePath });
  }

  return (
    <div className="page" id="documents">
      <PageHeader
        eyebrow="Tài liệu công trình"
        title="Tài liệu"
        description="Quản lý hợp đồng, hóa đơn, biên bản nghiệm thu và hồ sơ theo từng công trình."
        meta={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowUpload(true)}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Tải lên</span>
          </button>
        }
      />

      {/* Filter bar */}
      <div className="filter-bar">
        <select
          value={filterProjectId}
          onChange={(e) => setFilterProjectId(e.target.value)}
          className="form-select"
          aria-label="Lọc theo công trình"
        >
          <option value="">Tất cả công trình</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} — {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Document list */}
      {isLoading ? (
        <InlineLoading />
      ) : !documents?.length ? (
        <EmptyState
          icon={FileText}
          title="Chưa có tài liệu"
          description="Tải lên hợp đồng, hóa đơn hoặc tài liệu nghiệm thu cho công trình."
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowUpload(true)}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Tải lên tài liệu đầu tiên</span>
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên tài liệu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ngày tải</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-slate-400 shrink-0" aria-hidden="true" />
                        <span className="font-medium text-white">{doc.title}</span>
                      </div>
                      {doc.uploader && (
                        <p className="text-xs text-slate-500 mt-0.5 pl-6">
                          {doc.uploader.full_name}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge tone={documentTypeTone(doc.document_type)}>
                        {documentTypeLabel(doc.document_type)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      {doc.project ? (
                        <div>
                          <span className="code">{doc.project.code}</span>
                          <p className="text-sm text-slate-300">{doc.project.name}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(doc.storage_path, doc.title)}
                          className="icon-btn"
                          aria-label={`Tải xuống ${doc.title}`}
                          title="Tải xuống"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.storage_path, doc.title)}
                          className="icon-btn icon-btn-danger"
                          aria-label={`Xóa ${doc.title}`}
                          title="Xóa"
                          disabled={deleteDoc.isPending}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{doc.title}</p>
                    {doc.project && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {doc.project.code} — {doc.project.name}
                      </p>
                    )}
                  </div>
                  <StatusBadge tone={documentTypeTone(doc.document_type)}>
                    {documentTypeLabel(doc.document_type)}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(doc.created_at)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.storage_path, doc.title)}
                      className="icon-btn"
                      aria-label={`Tải xuống ${doc.title}`}
                    >
                      <Download size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.storage_path, doc.title)}
                      className="icon-btn icon-btn-danger"
                      aria-label={`Xóa ${doc.title}`}
                      disabled={deleteDoc.isPending}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-dialog-title"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2 id="upload-dialog-title" className="modal-title">Tải lên tài liệu</h2>
              <button
                type="button"
                onClick={handleCloseUpload}
                className="icon-btn"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="modal-body space-y-4">
              <div className="form-field">
                <label htmlFor="doc-title" className="form-label">
                  Tên tài liệu <span aria-hidden="true">*</span>
                </label>
                <input
                  id="doc-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input"
                  placeholder="Hợp đồng thi công CT001..."
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="doc-type" className="form-label">
                  Loại tài liệu <span aria-hidden="true">*</span>
                </label>
                <select
                  id="doc-type"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as DocumentType)}
                  className="form-select"
                  required
                >
                  {(Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="doc-project" className="form-label">
                  Công trình
                </label>
                <select
                  id="doc-project"
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="form-select"
                >
                  <option value="">— Không gắn công trình —</option>
                  {projects?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="doc-file" className="form-label">
                  File <span aria-hidden="true">*</span>
                </label>
                <input
                  id="doc-file"
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED_MIME}
                  onChange={(e) => setFormFile(e.target.files?.[0] ?? null)}
                  className="form-input file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
                  required
                />
                {formFile && (
                  <p className="text-xs text-slate-400 mt-1">
                    {formFile.name} ({(formFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              {uploadError && (
                <p className="text-sm text-red-400" role="alert">
                  {uploadError}
                </p>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseUpload}
                  className="btn btn-secondary"
                  disabled={uploadDoc.isPending}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadDoc.isPending}
                >
                  {uploadDoc.isPending ? 'Đang tải lên…' : 'Tải lên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
