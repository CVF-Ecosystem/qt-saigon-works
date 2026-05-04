import { useState } from 'react';
import { CheckCircle, Edit2, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { MaterialsNav } from '../components/materials/MaterialsNav';
import PurchaseOrderForm from '../components/materials/PurchaseOrderForm';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { RequestStatus } from '../hooks/useMaterialRequests';
import {
  useCreatePurchaseOrder,
  useDeletePurchaseOrder,
  usePurchaseOrders,
  useUpdatePurchaseOrder,
  useUpdatePurchaseOrderStatus,
  type PurchaseOrder,
  type PurchaseOrderInput,
} from '../hooks/usePurchaseOrders';
import { formatVnd } from '../utils/format';

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

const nextStatusMap: Partial<Record<RequestStatus, { status: RequestStatus; label: string }>> = {
  draft: { status: 'review', label: 'Gửi duyệt' },
  review: { status: 'approved', label: 'Duyệt' },
  approved: { status: 'ordered', label: 'Đặt hàng' },
  ordered: { status: 'delivered', label: 'Đã giao' },
  delivered: { status: 'paid', label: 'Đã thanh toán' },
};

export default function PurchaseOrdersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | undefined>();
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');

  const { data: orders, isLoading } = usePurchaseOrders();
  const createOrder = useCreatePurchaseOrder();
  const updateOrder = useUpdatePurchaseOrder();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const deleteOrder = useDeletePurchaseOrder();

  function handleCreate(input: PurchaseOrderInput) {
    createOrder.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleUpdate(input: PurchaseOrderInput) {
    if (!editingOrder) return;
    updateOrder.mutate({ id: editingOrder.id, input }, { onSuccess: () => setEditingOrder(undefined) });
  }

  function handleDelete(id: string, poNumber: string) {
    if (!confirm(`Xóa đơn mua "${poNumber}"?`)) return;
    deleteOrder.mutate(id);
  }

  const filtered = filterStatus === 'all'
    ? orders
    : orders?.filter((order) => order.status === filterStatus);

  const counts = orders?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
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
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="VẬT TƯ"
          title="Đơn mua vật tư"
          description="Theo dõi PO, nhà cung cấp và trạng thái giao hàng"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tạo PO</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      <MaterialsNav />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-sm rounded-lg transition ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          Tất cả {orders?.length ? `(${orders.length})` : ''}
        </button>
        {(['draft', 'review', 'approved', 'ordered', 'delivered', 'paid'] as RequestStatus[]).map((status) => (
          counts?.[status] ? (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {statusLabels[status]} ({counts[status]})
            </button>
          ) : null
        ))}
      </div>

      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">PO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nhà cung cấp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Vật tư</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tổng tiền</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered?.map((order) => {
                const firstItem = order.items?.[0];
                const nextAction = nextStatusMap[order.status];

                return (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-blue-400">{order.po_number}</div>
                      <div className="text-xs text-slate-400">{order.order_date}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{order.supplier?.name || '—'}</td>
                    <td className="px-6 py-4">
                      {order.project ? (
                        <div>
                          <div className="font-mono text-xs text-blue-400">{order.project.code}</div>
                          <div className="text-sm text-slate-300">{order.project.name}</div>
                        </div>
                      ) : <span className="text-slate-500">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{firstItem?.description || '—'}</div>
                      {firstItem && (
                        <div className="text-xs text-slate-400">
                          {firstItem.quantity} {firstItem.unit} x {formatVnd(firstItem.unit_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-white">
                      {formatVnd(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge tone={statusTones[order.status]}>
                        {statusLabels[order.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {nextAction && (
                          <button
                            onClick={() => updateStatus.mutate({ id: order.id, status: nextAction.status })}
                            className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition"
                          >
                            {nextAction.label}
                          </button>
                        )}
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                          aria-label="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id, order.po_number)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                          aria-label="Xóa"
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
            <p className="text-slate-400">Không có đơn mua nào</p>
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {filtered?.map((order) => {
          const firstItem = order.items?.[0];
          const nextAction = nextStatusMap[order.status];

          return (
            <div key={order.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-blue-400">{order.po_number}</div>
                  <h3 className="font-semibold text-white truncate">{order.supplier?.name || 'Chưa có NCC'}</h3>
                  {order.project && (
                    <p className="text-xs text-slate-400 mt-1">{order.project.code} · {order.project.name}</p>
                  )}
                </div>
                <StatusBadge tone={statusTones[order.status]}>
                  {statusLabels[order.status]}
                </StatusBadge>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <div className="text-sm text-slate-300">{firstItem?.description || '—'}</div>
                {firstItem && (
                  <div className="text-xs text-slate-400">
                    {firstItem.quantity} {firstItem.unit} x {formatVnd(firstItem.unit_price)}
                  </div>
                )}
                <div className="text-lg font-semibold text-white mt-1">{formatVnd(order.total_amount)}</div>
              </div>

              <div className="flex gap-2">
                {nextAction && (
                  <button
                    onClick={() => updateStatus.mutate({ id: order.id, status: nextAction.status })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded-lg transition"
                  >
                    <CheckCircle size={14} />
                    {nextAction.label}
                  </button>
                )}
                <button
                  onClick={() => setEditingOrder(order)}
                  className="min-h-11 px-3 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                  aria-label="Sửa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(order.id, order.po_number)}
                  className="min-h-11 px-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                  aria-label="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <ShoppingCart size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">Không có đơn mua nào</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
              + Tạo PO đầu tiên
            </button>
          </div>
        )}
      </div>

      {(showForm || editingOrder) && (
        <PurchaseOrderForm
          order={editingOrder}
          onSubmit={editingOrder ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingOrder(undefined); }}
          loading={createOrder.isPending || updateOrder.isPending}
        />
      )}
    </div>
  );
}
