import { useState } from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import AttendanceForm from '../components/employees/AttendanceForm';
import {
  useAttendance,
  useCreateAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
  calcPayroll,
  type AttendanceEntry,
  type AttendanceInput,
} from '../hooks/useAttendance';
import { formatVnd, formatCompactVnd } from '../utils/format';

// Get current month as YYYY-MM
function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return `Tháng ${m}/${y}`;
}

// Generate last 6 months for filter
function last6Months() {
  const months: string[] = [];
  const d = new Date();
  for (let i = 0; i < 6; i++) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    d.setMonth(d.getMonth() - 1);
  }
  return months;
}

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AttendanceEntry | undefined>();

  const { data: entries, isLoading } = useAttendance({ month: selectedMonth });
  const createAttendance = useCreateAttendance();
  const updateAttendance = useUpdateAttendance();
  const deleteAttendance = useDeleteAttendance();

  function handleCreate(input: AttendanceInput) {
    createAttendance.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleUpdate(input: AttendanceInput) {
    if (!editingEntry) return;
    updateAttendance.mutate({ id: editingEntry.id, input }, { onSuccess: () => setEditingEntry(undefined) });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa chấm công của "${name}"?`)) return;
    deleteAttendance.mutate(id);
  }

  // Payroll summary by employee
  const payrollByEmployee = entries?.reduce((acc, entry) => {
    const empId = entry.employee_id;
    const empName = entry.employee?.full_name || 'Không rõ';
    if (!acc[empId]) {
      acc[empId] = { name: empName, totalUnits: 0, totalOT: 0, totalPay: 0, entries: 0 };
    }
    acc[empId].totalUnits += entry.work_units;
    acc[empId].totalOT += entry.overtime_hours;
    acc[empId].totalPay += calcPayroll([entry]);
    acc[empId].entries += 1;
    return acc;
  }, {} as Record<string, { name: string; totalUnits: number; totalOT: number; totalPay: number; entries: number }>);

  const totalPayroll = entries ? calcPayroll(entries) : 0;
  const totalWorkUnits = entries?.reduce((s, e) => s + e.work_units, 0) ?? 0;

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
    <div className="page space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          eyebrow="NHÂN SỰ"
          title="Chấm công"
          description="Theo dõi công và tính lương ước tính"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex min-h-[44px] items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Chấm công</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Month filter */}
      <div className="flex flex-wrap gap-2">
        {last6Months().map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`min-h-[44px] px-3 py-1.5 text-sm rounded-lg transition ${
              selectedMonth === m
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="text-sm text-slate-400">Tổng công</div>
          <div className="text-2xl font-bold text-white mt-1">{totalWorkUnits}</div>
          <div className="text-xs text-slate-500 mt-1">{entries?.length ?? 0} lượt chấm</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="text-sm text-slate-400">Nhân viên</div>
          <div className="text-2xl font-bold text-white mt-1">
            {Object.keys(payrollByEmployee || {}).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">có công trong tháng</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="text-sm text-slate-400">Lương ước tính</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{formatCompactVnd(totalPayroll)}</div>
          <div className="text-xs text-slate-500 mt-1">{monthLabel(selectedMonth)}</div>
        </div>
      </div>

      {/* Payroll summary by employee */}
      {payrollByEmployee && Object.keys(payrollByEmployee).length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Bảng lương ước tính — {monthLabel(selectedMonth)}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nhân viên</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số công</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tăng ca (h)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lương ước tính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {Object.entries(payrollByEmployee).map(([empId, data]) => (
                  <tr key={empId} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <Users size={14} className="text-slate-400" />
                        </div>
                        <div className="font-medium text-white">{data.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white">{data.totalUnits}</td>
                    <td className="px-6 py-4 text-right text-white">{data.totalOT}</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-400">{formatVnd(data.totalPay)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-900/30 font-semibold">
                  <td className="px-6 py-3 text-slate-300">Tổng cộng</td>
                  <td className="px-6 py-3 text-right text-white">{totalWorkUnits}</td>
                  <td className="px-6 py-3 text-right text-white">
                    {entries?.reduce((s, e) => s + e.overtime_hours, 0) ?? 0}
                  </td>
                  <td className="px-6 py-3 text-right text-green-400">{formatVnd(totalPayroll)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance log */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Chi tiết chấm công</h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Công</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tăng ca</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Phụ cấp</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lương ngày</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {entries?.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{entry.work_date}</td>
                  <td className="px-6 py-4 font-medium text-white">{entry.employee?.full_name}</td>
                  <td className="px-6 py-4">
                    {entry.project ? (
                      <div>
                        <div className="font-mono text-xs text-blue-400">{entry.project.code}</div>
                        <div className="text-sm text-slate-300">{entry.project.name}</div>
                      </div>
                    ) : <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right text-white">{entry.work_units}</td>
                  <td className="px-6 py-4 text-right text-slate-300">{entry.overtime_hours}h</td>
                  <td className="px-6 py-4 text-right text-slate-300">{formatVnd(entry.allowance)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-400">
                    {formatVnd(calcPayroll([entry]))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                        aria-label={`Sửa chấm công của ${entry.employee?.full_name ?? 'nhân viên'}`}
                        type="button"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id, entry.employee?.full_name || '')}
                        className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                        aria-label={`Xóa chấm công của ${entry.employee?.full_name ?? 'nhân viên'}`}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-700">
          {entries?.map((entry) => (
            <div key={entry.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-white">{entry.employee?.full_name}</div>
                  {entry.project && (
                    <div className="text-xs text-blue-400">{entry.project.code} · {entry.project.name}</div>
                  )}
                  <div className="text-xs text-slate-400 mt-0.5">{entry.work_date}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                    aria-label={`Sửa chấm công của ${entry.employee?.full_name ?? 'nhân viên'}`}
                    type="button"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id, entry.employee?.full_name || '')}
                    className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                    aria-label={`Xóa chấm công của ${entry.employee?.full_name ?? 'nhân viên'}`}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-400">
                  {entry.work_units} công · {entry.overtime_hours}h TC · PC: {formatVnd(entry.allowance)}
                </div>
                <div className="font-semibold text-green-400">{formatVnd(calcPayroll([entry]))}</div>
              </div>
              {entry.note && <div className="text-xs text-slate-500">{entry.note}</div>}
            </div>
          ))}
        </div>

        {entries?.length === 0 && (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">Chưa có chấm công nào trong {monthLabel(selectedMonth)}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 min-h-[44px] px-3 text-blue-400 hover:text-blue-300 text-sm"
              type="button"
            >
              + Chấm công đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingEntry) && (
        <AttendanceForm
          entry={editingEntry}
          onSubmit={editingEntry ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingEntry(undefined); }}
          loading={createAttendance.isPending || updateAttendance.isPending}
        />
      )}
    </div>
  );
}
