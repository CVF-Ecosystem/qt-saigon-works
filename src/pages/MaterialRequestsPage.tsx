import { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import MaterialRequestForm from '../components/materials/MaterialRequestForm';
import {
  useMaterialRequests,
  useCreateMaterialRequest,
  useUpdateMaterialRequest,
  useDeleteMaterialRequest,
  type MaterialRequest,
  type RequestStatus,
} from '../hooks/useMaterialRequests';

const statusLabels: Record<RequestStatus, string> = {
  draft: 'Nháp',
  review: 'Đang duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  ordered: 'Đã đặt',
  delivered: 'Đã giao',
  paid: 'Đã TT',
  closed: 'Đóng',
};

const statusTones: Record<RequestStatus, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  draft: 'neutral',
  review: 'warning',
  approved: 'info',
  rejected: 'danger',
  ordered: 'info',
  delivered: 'success',
  paid: 'success',
  closed: 'neutral',
};

// Quick status actions for workflow
const nextStatusMap: Partial<Record<RequestStatus, { status: RequestStatus; label: string }>> = {
  draft: { status: 'review', label: 'Gửi duyệt' },
  review: { status: 'approved', label: 'Duyệt' },
  approved: { status: 'ordered', label: 'Đặt hàng' },
  ordered: { status: 'delivered', label: 'Xác nhận giao' },
};

export default function MaterialRequestsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaterialRequest | undefined>();
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');

  const { data: requests, isLoading } = useMaterialRequests();
  const createRequest = useCreateMaterialRequest();
  const updateRequest = useUpdateMaterialRequest();
  const deleteRequest = useDeleteMaterialRequest();

  function handleCreate(input: any) {
    createRequest.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleUpdate(input: any) {
    if (!editingRequest) return;
    updateRequest.mutate({ id: editingRequest.id, input }, { onSuccess: () => setEditingRequest(undefined) });
  }

  function handleDelete(id: string, desc: string) {
    if (!confirm(`Xóa yêu cầu "${desc}"?`)) return;
    deleteRequest.mutate(id);
  }

  function handleQuickStatus(request: MaterialRequest, newStatus: RequestStatus) {
    updateRequest.mutate({ id: request.id, input: { status: newStatus } });
  }

  function handleReject(request: MaterialRequest) {
    if (!confirm(`Từ chối yêu cầu "${request.description}"?`)) return;
    updateRequest.mutate({ id: request.id, input: { status: 'rejected' } });
  }

  const filtered = filterStatus === 'all'
    ? requests
    : requests?.filter((r) => r.status === filterStatus);

  // Count by status for filter badges
  const counts = requests?.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="VẬT TƯ"
          title="Yêu cầu vật tư"
          description="Quản lý đề nghị mua vật tư từ công trường"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tạo yêu cầu</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-sm rounded-lg transition ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Tất cả {requests?.length ? `(${requests.length})` : ''}
        </button>
        {(['draft', 'review', 'approved', 'ordered', 'delivered'] as RequestStatus[]).map((s) => (
          counts?.[s] ? (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {statusLabels[s]} ({counts[s]})
            </button>
          ) : null
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Vật tư</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cần trước</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered?.map((req) => {
                const nextAction = nextStatusMap[req.status];
                return (
                  <tr key={req.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      {req.project ? (
                        <div>
                          <div className="font-mono text-xs text-blue-400">{req.project.code}</div>
                          <div className="text-sm text-slate-300">{req.project.name}</div>
                        </div>
                      ) : <span className="text-slate-500">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{req.description}</div>
                      {req.requester && (
                        <div className="text-xs text-slate-400">Bởi: {req.requester.full_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-white">{req.quantity}</span>
                      <span className="text-slate-400 ml-1">{req.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {req.needed_date || <span className="text-slate-500">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge tone={statusTones[req.status]}>
                        {statusLabels[req.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {nextAction && (
                          <button
                            onClick={() => handleQuickStatus(req, nextAction.status)}
                            title={nextAction.label}
                            className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition"
                          >
                            {nextAction.label}
                          </button>
                        )}
                        {(req.status === 'review' || req.status === 'draft') && (
                          <button
                            onClick={() => handleReject(req)}
                            title="Từ chối"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingRequest(req)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id, req.description)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Không có yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered?.map((req) => {
          const nextAction = nextStatusMap[req.status];
          return (
            <div key={req.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {req.project && (
                    <div className="font-mono text-xs text-blue-400 mb-1">{req.project.code} · {req.project.name}</div>
                  )}
                  <h3 className="font-semibold text-white">{req.description}</h3>
                  {req.requester && (
                    <p className="text-xs text-slate-400 mt-0.5">Bởi: {req.requester.full_name}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => setEditingRequest(req)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(req.id, req.description)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-white">{req.quantity} {req.unit}</span>
                  {req.needed_date && (
                    <span className="text-slate-400 ml-2">· Cần: {req.needed_date}</span>
                  )}
                </div>
                <StatusBadge tone={statusTones[req.status]}>
                  {statusLabels[req.status]}
                </StatusBadge>
              </div>

              {/* Quick action buttons */}
              {(nextAction || req.status === 'review' || req.status === 'draft') && (
                <div className="flex gap-2 pt-2 border-t border-slate-700">
                  {nextAction && (
                    <button
                      onClick={() => handleQuickStatus(req, nextAction.status)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded-lg transition"
                    >
                      <CheckCircle size={14} />
                      {nextAction.label}
                    </button>
                  )}
                  {(req.status === 'review' || req.status === 'draft') && (
                    <button
                      onClick={() => handleReject(req)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition"
                    >
                      <XCircle size={14} />
                      Từ chối
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <Truck size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">Không có yêu cầu nào</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
              + Tạo yêu cầu đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingRequest) && (
        <MaterialRequestForm
          request={editingRequest}
          onSubmit={editingRequest ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingRequest(undefined); }}
          loading={createRequest.isPending || updateRequest.isPending}
        />
      )}
    </div>
  );
}
