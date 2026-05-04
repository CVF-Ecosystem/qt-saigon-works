import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import type { MaterialRequest, MaterialRequestInput, RequestStatus } from '../../hooks/useMaterialRequests';
import { useProjects } from '../../hooks/useProjects';
import { useMaterials } from '../../hooks/useMaterials';

interface MaterialRequestFormProps {
  request?: MaterialRequest;
  onSubmit: (input: MaterialRequestInput) => void;
  onCancel: () => void;
  loading?: boolean;
  defaultProjectId?: string;
}

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'review', label: 'Đang duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'ordered', label: 'Đã đặt hàng' },
  { value: 'delivered', label: 'Đã giao' },
];

export default function MaterialRequestForm({
  request,
  onSubmit,
  onCancel,
  loading,
  defaultProjectId,
}: MaterialRequestFormProps) {
  const { data: projects } = useProjects();
  const { data: materials } = useMaterials();

  const [formData, setFormData] = useState<MaterialRequestInput & { status: RequestStatus }>({
    project_id: request?.project_id || defaultProjectId || '',
    material_id: request?.material_id || null,
    description: request?.description || '',
    quantity: request?.quantity || 1,
    unit: request?.unit || '',
    needed_date: request?.needed_date || '',
    status: request?.status || 'draft',
  });

  // Auto-fill unit when material is selected
  function handleMaterialChange(materialId: string) {
    const material = materials?.find((m) => m.id === materialId);
    setFormData({
      ...formData,
      material_id: materialId || null,
      unit: material?.unit || formData.unit,
      description: formData.description || material?.name || '',
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {request ? 'Sửa yêu cầu vật tư' : 'Tạo yêu cầu vật tư'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Công trình <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn công trình --</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Vật tư (từ danh mục)
              </label>
              <select
                value={formData.material_id || ''}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn hoặc nhập tay --</option>
                {materials?.filter((m) => m.active).map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mô tả / Tên vật tư <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Xi măng PCB40, cát vàng, sắt phi 10..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Số lượng <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="0.001"
                step="0.001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Đơn vị <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="bao, m3, kg..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cần trước ngày
              </label>
              <input
                type="date"
                value={formData.needed_date || ''}
                onChange={(e) => setFormData({ ...formData, needed_date: e.target.value || null })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as RequestStatus })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
              {loading ? 'Đang lưu...' : request ? 'Cập nhật' : 'Tạo yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
