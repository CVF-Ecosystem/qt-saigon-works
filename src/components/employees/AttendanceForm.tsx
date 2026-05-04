import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import type { AttendanceEntry, AttendanceInput } from '../../hooks/useAttendance';
import { useProjects } from '../../hooks/useProjects';
import { useEmployees } from '../../hooks/useEmployees';
import { formatVnd } from '../../utils/format';

interface AttendanceFormProps {
  entry?: AttendanceEntry;
  onSubmit: (input: AttendanceInput) => void;
  onCancel: () => void;
  loading?: boolean;
  defaultProjectId?: string;
  defaultEmployeeId?: string;
}

export default function AttendanceForm({
  entry,
  onSubmit,
  onCancel,
  loading,
  defaultProjectId,
  defaultEmployeeId,
}: AttendanceFormProps) {
  const { data: projects } = useProjects();
  const { data: employees } = useEmployees();

  const [formData, setFormData] = useState<AttendanceInput>({
    project_id: entry?.project_id || defaultProjectId || '',
    employee_id: entry?.employee_id || defaultEmployeeId || '',
    work_date: entry?.work_date || new Date().toISOString().split('T')[0],
    work_units: entry?.work_units ?? 1,
    overtime_hours: entry?.overtime_hours ?? 0,
    allowance: entry?.allowance ?? 0,
    note: entry?.note || '',
  });

  // Show estimated pay
  const selectedEmployee = employees?.find((e) => e.id === formData.employee_id);
  const estimatedPay = selectedEmployee
    ? selectedEmployee.base_daily_rate * formData.work_units +
      (selectedEmployee.base_daily_rate / 8) * 1.5 * (formData.overtime_hours || 0) +
      (formData.allowance || 0)
    : 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {entry ? 'Sửa chấm công' : 'Chấm công'}
          </h2>
          <button
            aria-label="Đóng"
            onClick={onCancel}
            className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-white transition"
            type="button"
          >
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
                {projects?.filter((p) => p.status === 'active' || p.status === 'preparing').map((p) => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nhân viên <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees?.filter((e) => e.active).map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ngày làm việc <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.work_date}
              onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Số công <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="2"
                step="0.5"
                value={formData.work_units}
                onChange={(e) => setFormData({ ...formData, work_units: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">0.5 = nửa công, 1 = 1 công</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Giờ tăng ca
              </label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={formData.overtime_hours}
                onChange={(e) => setFormData({ ...formData, overtime_hours: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phụ cấp (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Estimated pay preview */}
          {selectedEmployee && estimatedPay > 0 && (
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
              <div className="text-sm text-blue-400">Lương ước tính ngày này</div>
              <div className="text-xl font-semibold text-white mt-1">
                {formatVnd(estimatedPay)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Đơn giá: {formatVnd(selectedEmployee.base_daily_rate)}/công
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ghi chú
            </label>
            <input
              type="text"
              value={formData.note || ''}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ghi chú thêm..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {loading ? 'Đang lưu...' : entry ? 'Cập nhật' : 'Chấm công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
