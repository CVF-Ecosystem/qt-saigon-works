import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import { formatVnd } from '../utils/format';

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa nhân viên "${name}"?`)) return;
    deleteEmployee.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="QUẢN LÝ NHÂN SỰ"
          title="Nhân viên"
          description="Danh sách nhân viên và công nhân"
        />
        <button
          onClick={() => alert('Chức năng thêm nhân viên đang phát triển')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Thêm nhân viên</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mã NV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Chức vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loại HĐ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Đơn giá/ngày</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {employees?.filter(e => e.active).map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-blue-400">{employee.employee_code || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{employee.full_name}</div>
                    {employee.phone && (
                      <div className="text-sm text-slate-400 mt-1">{employee.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{employee.job_title || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">
                      {employee.employment_type === 'full_time' ? 'Toàn thời gian' : 'Hợp đồng'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-white">{formatVnd(employee.base_daily_rate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => alert('Chức năng sửa đang phát triển')}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id, employee.full_name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees?.filter(e => e.active).length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chưa có nhân viên nào</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {employees?.filter(e => e.active).map((employee) => (
          <div key={employee.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-mono text-xs text-blue-400 mb-1">{employee.employee_code || 'Chưa có mã'}</div>
                <h3 className="font-semibold text-white">{employee.full_name}</h3>
                <p className="text-sm text-slate-400 mt-1">{employee.job_title || 'Chưa có chức vụ'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Chức năng sửa đang phát triển')}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(employee.id, employee.full_name)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <div className="text-sm text-slate-400">Đơn giá/ngày</div>
              <div className="text-lg font-semibold text-white">{formatVnd(employee.base_daily_rate)}</div>
            </div>
          </div>
        ))}

        {employees?.filter(e => e.active).length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">Chưa có nhân viên nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
