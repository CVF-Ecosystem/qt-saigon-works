import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import type { RequestStatus } from '../../hooks/useMaterialRequests';
import type { PurchaseOrder, PurchaseOrderInput } from '../../hooks/usePurchaseOrders';
import { useMaterials } from '../../hooks/useMaterials';
import { useProjects } from '../../hooks/useProjects';
import { useSuppliers } from '../../hooks/useSuppliers';
import { formatVnd } from '../../utils/format';

interface PurchaseOrderFormProps {
  order?: PurchaseOrder;
  onSubmit: (input: PurchaseOrderInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'review', label: 'Đang duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'ordered', label: 'Đã đặt hàng' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'closed', label: 'Đóng' },
];

export default function PurchaseOrderForm({
  order,
  onSubmit,
  onCancel,
  loading,
}: PurchaseOrderFormProps) {
  const { data: projects } = useProjects();
  const { data: suppliers } = useSuppliers();
  const { data: materials } = useMaterials();
  const firstItem = order?.items?.[0];

  const [formData, setFormData] = useState<PurchaseOrderInput>({
    project_id: order?.project_id || null,
    supplier_id: order?.supplier_id || null,
    po_number: order?.po_number || `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    order_date: order?.order_date || new Date().toISOString().slice(0, 10),
    status: order?.status || 'draft',
    item: {
      id: firstItem?.id,
      material_id: firstItem?.material_id || null,
      description: firstItem?.description || '',
      quantity: firstItem?.quantity || 1,
      unit: firstItem?.unit || '',
      unit_price: firstItem?.unit_price || 0,
    },
  });

  function handleMaterialChange(materialId: string) {
    const material = materials?.find((item) => item.id === materialId);
    setFormData({
      ...formData,
      item: {
        ...formData.item,
        material_id: materialId || null,
        description: formData.item.description || material?.name || '',
        unit: material?.unit || formData.item.unit,
        unit_price: material?.reference_price || formData.item.unit_price,
      },
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(formData);
  }

  const total = formData.item.quantity * formData.item.unit_price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {order ? 'Sửa đơn mua vật tư' : 'Tạo đơn mua vật tư'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition" aria-label="Đóng">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Số PO <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.po_number}
                onChange={(event) => setFormData({ ...formData, po_number: event.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ngày đặt <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="date"
                value={formData.order_date}
                onChange={(event) => setFormData({ ...formData, order_date: event.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(event) => setFormData({ ...formData, status: event.target.value as RequestStatus })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Công trình</label>
              <select
                value={formData.project_id || ''}
                onChange={(event) => setFormData({ ...formData, project_id: event.target.value || null })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn công trình --</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nhà cung cấp <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.supplier_id || ''}
                onChange={(event) => setFormData({ ...formData, supplier_id: event.target.value || null })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers?.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 p-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Vật tư từ danh mục</label>
                <select
                  value={formData.item.material_id || ''}
                  onChange={(event) => handleMaterialChange(event.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn hoặc nhập tay --</option>
                  {materials?.filter((material) => material.active).map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name} ({material.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mô tả vật tư <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.item.description}
                  onChange={(event) => setFormData({
                    ...formData,
                    item: { ...formData.item, description: event.target.value },
                  })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Xi măng PCB40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Số lượng <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  min="0.001"
                  step="0.001"
                  type="number"
                  value={formData.item.quantity}
                  onChange={(event) => setFormData({
                    ...formData,
                    item: { ...formData.item, quantity: Number(event.target.value) },
                  })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Đơn vị <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.item.unit}
                  onChange={(event) => setFormData({
                    ...formData,
                    item: { ...formData.item, unit: event.target.value },
                  })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Đơn giá <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  min="0"
                  step="100"
                  type="number"
                  value={formData.item.unit_price}
                  onChange={(event) => setFormData({
                    ...formData,
                    item: { ...formData.item, unit_price: Number(event.target.value) },
                  })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Thành tiền</label>
                <div className="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-semibold">
                  {formatVnd(total)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {loading ? 'Đang lưu...' : order ? 'Cập nhật' : 'Tạo PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
