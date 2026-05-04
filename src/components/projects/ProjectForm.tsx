import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Project, ProjectInput, ProjectStatus } from '../../hooks/useProjects';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (input: ProjectInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'preparing', label: 'Chuẩn bị' },
  { value: 'active', label: 'Đang thi công' },
  { value: 'paused', label: 'Tạm dừng' },
  { value: 'handover', label: 'Nghiệm thu' },
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'closed', label: 'Đóng' },
];

export default function ProjectForm({ project, onSubmit, onCancel, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectInput>({
    client_id: project?.client_id || null,
    code: project?.code || '',
    name: project?.name || '',
    site_address: project?.site_address || null,
    manager_id: project?.manager_id || null,
    status: project?.status || 'preparing',
    contract_value: project?.contract_value || 0,
    estimated_cost: project?.estimated_cost || 0,
    progress_percent: project?.progress_percent || 0,
    start_date: project?.start_date || null,
    target_date: project?.target_date || null,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {project ? 'Sửa công trình' : 'Thêm công trình mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mã công trình */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                Mã công trình <span className="text-red-400">*</span>
              </label>
              <input
                id="code"
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CT001"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tên công trình */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Tên công trình <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhà phố 3 tầng - Quận 1"
            />
          </div>

          {/* Địa chỉ công trường */}
          <div>
            <label htmlFor="site_address" className="block text-sm font-medium text-slate-300 mb-2">
              Địa chỉ công trường
            </label>
            <input
              id="site_address"
              type="text"
              value={formData.site_address || ''}
              onChange={(e) => setFormData({ ...formData, site_address: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Giá trị hợp đồng */}
            <div>
              <label htmlFor="contract_value" className="block text-sm font-medium text-slate-300 mb-2">
                Giá trị hợp đồng (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                id="contract_value"
                type="number"
                required
                min="0"
                step="1000"
                value={formData.contract_value}
                onChange={(e) => setFormData({ ...formData, contract_value: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2500000000"
              />
            </div>

            {/* Dự toán chi phí */}
            <div>
              <label htmlFor="estimated_cost" className="block text-sm font-medium text-slate-300 mb-2">
                Dự toán chi phí (VNĐ)
              </label>
              <input
                id="estimated_cost"
                type="number"
                min="0"
                step="1000"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2100000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tiến độ */}
            <div>
              <label htmlFor="progress_percent" className="block text-sm font-medium text-slate-300 mb-2">
                Tiến độ (%)
              </label>
              <input
                id="progress_percent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.progress_percent}
                onChange={(e) => setFormData({ ...formData, progress_percent: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="45"
              />
            </div>

            {/* Ngày bắt đầu */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-slate-300 mb-2">
                Ngày bắt đầu
              </label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value || null })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ngày dự kiến hoàn thành */}
            <div>
              <label htmlFor="target_date" className="block text-sm font-medium text-slate-300 mb-2">
                Ngày dự kiến HT
              </label>
              <input
                id="target_date"
                type="date"
                value={formData.target_date || ''}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value || null })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
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
              {loading ? 'Đang lưu...' : project ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
