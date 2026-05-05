import { useState } from 'react';
import { Download, TrendingUp, ArrowLeftRight, CreditCard, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { InlineLoading } from '../components/ui/LoadingSpinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useProjectFinance } from '../hooks/useProjectFinance';
import { usePayments } from '../hooks/usePayments';
import { useCosts } from '../hooks/useCosts';
import { useAttendance, calcPayroll } from '../hooks/useAttendance';
import { formatVnd, formatCompactVnd } from '../utils/format';
import { exportCsv } from '../utils/exportCsv';

type Tab = 'pl' | 'cashflow' | 'receivables' | 'labor';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap',
        active
          ? 'bg-brand text-white'
          : 'text-muted hover:text-text hover:bg-surface-3',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ─── P&L Tab ────────────────────────────────────────────────────────────────

function PLReport() {
  const { data: summaries, isLoading } = useProjectFinance();

  function handleExport() {
    if (!summaries) return;
    exportCsv('bao-cao-loi-nhuan', summaries.map((s) => ({
      'Mã CT': s.project_code,
      'Tên công trình': s.project_name,
      'Giá trị HĐ': s.contract_value,
      'Chi phí': s.total_costs,
      'Đã thu': s.total_revenue,
      'Phải thu': s.receivable,
      'Lãi gộp': s.margin,
      'Tỷ suất (%)': s.margin_percent.toFixed(1),
    })));
  }

  if (isLoading) return <InlineLoading />;

  const totals = summaries?.reduce(
    (acc, s) => ({
      contract: acc.contract + s.contract_value,
      costs: acc.costs + s.total_costs,
      revenue: acc.revenue + s.total_revenue,
      receivable: acc.receivable + s.receivable,
      margin: acc.margin + s.margin,
    }),
    { contract: 0, costs: 0, revenue: 0, receivable: 0, margin: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={handleExport} className="btn btn-secondary" disabled={!summaries?.length}>
          <Download size={14} />
          <span>Xuất CSV</span>
        </button>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tổng giá trị HĐ', value: totals?.contract ?? 0, tone: 'neutral' as const },
          { label: 'Chi phí ghi nhận', value: totals?.costs ?? 0, tone: 'warning' as const },
          { label: 'Đã thu', value: totals?.revenue ?? 0, tone: 'success' as const },
          { label: 'Lãi gộp ước tính', value: totals?.margin ?? 0, tone: (totals?.margin ?? 0) >= 0 ? 'success' as const : 'danger' as const },
        ].map((m) => (
          <div key={m.label} className="bg-surface-2 border border-border rounded-xl p-4">
            <p className="text-xs text-subtle mb-1">{m.label}</p>
            <p className={`text-base font-semibold ${m.tone === 'success' ? 'text-green-400' : m.tone === 'warning' ? 'text-yellow-400' : m.tone === 'danger' ? 'text-red-400' : 'text-text'}`}>
              {formatCompactVnd(m.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Giá trị HĐ</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Chi phí</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Đã thu</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Phải thu</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lãi gộp</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tỷ suất</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {summaries?.map((s) => (
              <tr key={s.project_id} className="hover:bg-slate-700/30 transition">
                <td className="px-5 py-3">
                  <span className="code">{s.project_code}</span>
                  <p className="text-white">{s.project_name}</p>
                </td>
                <td className="px-5 py-3 text-right text-slate-300">{formatCompactVnd(s.contract_value)}</td>
                <td className="px-5 py-3 text-right text-yellow-400">{formatCompactVnd(s.total_costs)}</td>
                <td className="px-5 py-3 text-right text-green-400">{formatCompactVnd(s.total_revenue)}</td>
                <td className="px-5 py-3 text-right text-slate-300">{formatCompactVnd(s.receivable)}</td>
                <td className={`px-5 py-3 text-right font-semibold ${s.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCompactVnd(s.margin)}
                </td>
                <td className={`px-5 py-3 text-right ${s.margin_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {s.margin_percent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {summaries?.map((s) => (
          <div key={s.project_id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="code">{s.project_code}</span>
                <p className="font-medium text-white">{s.project_name}</p>
              </div>
              <span className={`text-sm font-semibold ${s.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {s.margin_percent.toFixed(1)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-slate-400">Giá trị HĐ</p><p className="text-slate-200">{formatCompactVnd(s.contract_value)}</p></div>
              <div><p className="text-slate-400">Chi phí</p><p className="text-yellow-400">{formatCompactVnd(s.total_costs)}</p></div>
              <div><p className="text-slate-400">Đã thu</p><p className="text-green-400">{formatCompactVnd(s.total_revenue)}</p></div>
              <div><p className="text-slate-400">Lãi gộp</p><p className={s.margin >= 0 ? 'text-green-400' : 'text-red-400'}>{formatCompactVnd(s.margin)}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Cashflow Tab ────────────────────────────────────────────────────────────

function CashflowReport() {
  const [month, setMonth] = useState('');
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: costs, isLoading: costsLoading } = useCosts();
  const isLoading = paymentsLoading || costsLoading;

  const filteredPayments = payments?.filter((p) =>
    month ? p.payment_date.startsWith(month) : true
  ) ?? [];

  const filteredCosts = costs?.filter((c) =>
    month ? c.cost_date.startsWith(month) : true
  ) ?? [];

  const totalIn = filteredPayments.filter((p) => p.direction === 'in').reduce((s, p) => s + p.amount, 0);
  const totalOut = filteredPayments.filter((p) => p.direction === 'out').reduce((s, p) => s + p.amount, 0);
  const totalCosts = filteredCosts.filter((c) => c.status !== 'rejected').reduce((s, c) => s + c.amount, 0);

  function handleExport() {
    const rows = [
      ...filteredPayments.map((p) => ({
        Ngày: p.payment_date,
        Loại: p.direction === 'in' ? 'Thu' : 'Chi',
        'Công trình': p.project?.code ?? '',
        'Đối tác': p.counterparty,
        'Mô tả': p.description,
        'Số tiền': p.amount,
        'Phương thức': p.method,
      })),
    ].sort((a, b) => a['Ngày'].localeCompare(b['Ngày']));
    exportCsv('bao-cao-dong-tien' + (month ? `-${month}` : ''), rows);
  }

  if (isLoading) return <InlineLoading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="form-input min-w-40"
            aria-label="Lọc theo tháng"
          />
          {month && (
            <button type="button" onClick={() => setMonth('')} className="text-xs text-subtle hover:text-text">
              Xem tất cả
            </button>
          )}
        </div>
        <button type="button" onClick={handleExport} className="btn btn-secondary">
          <Download size={14} />
          <span>Xuất CSV</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-2 border border-border rounded-xl p-4">
          <p className="text-xs text-subtle mb-1">Tổng thu</p>
          <p className="text-base font-semibold text-green-400">{formatCompactVnd(totalIn)}</p>
        </div>
        <div className="bg-surface-2 border border-border rounded-xl p-4">
          <p className="text-xs text-subtle mb-1">Tổng chi</p>
          <p className="text-base font-semibold text-red-400">{formatCompactVnd(totalOut)}</p>
        </div>
        <div className="bg-surface-2 border border-border rounded-xl p-4">
          <p className="text-xs text-subtle mb-1">Chi phí ghi nhận</p>
          <p className="text-base font-semibold text-yellow-400">{formatCompactVnd(totalCosts)}</p>
        </div>
      </div>

      {/* Payments table */}
      <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ngày</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mô tả</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/30 transition">
                <td className="px-5 py-3 text-slate-400">{p.payment_date}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={p.direction === 'in' ? 'success' : 'danger'}>
                    {p.direction === 'in' ? 'Thu' : 'Chi'}
                  </StatusBadge>
                </td>
                <td className="px-5 py-3">{p.project ? <span className="code">{p.project.code}</span> : <span className="text-slate-500">—</span>}</td>
                <td className="px-5 py-3 text-slate-300 max-w-xs truncate">{p.description}</td>
                <td className={`px-5 py-3 text-right font-medium ${p.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                  {p.direction === 'in' ? '+' : '−'}{formatCompactVnd(p.amount)}
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Không có giao dịch</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-2">
        {filteredPayments.map((p) => (
          <div key={p.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <StatusBadge tone={p.direction === 'in' ? 'success' : 'danger'}>{p.direction === 'in' ? 'Thu' : 'Chi'}</StatusBadge>
                {p.project && <span className="code text-xs">{p.project.code}</span>}
              </div>
              <p className="text-sm text-slate-300 truncate">{p.description}</p>
              <p className="text-xs text-slate-500">{p.payment_date}</p>
            </div>
            <p className={`text-sm font-semibold shrink-0 ${p.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
              {p.direction === 'in' ? '+' : '−'}{formatCompactVnd(p.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Receivables Tab ─────────────────────────────────────────────────────────

function ReceivablesReport() {
  const { data: summaries, isLoading } = useProjectFinance();

  const sorted = [...(summaries ?? [])].sort((a, b) => b.receivable - a.receivable);
  const totalReceivable = sorted.reduce((s, r) => s + r.receivable, 0);

  function handleExport() {
    exportCsv('bao-cao-cong-no', sorted.map((s) => ({
      'Mã CT': s.project_code,
      'Tên công trình': s.project_name,
      'Giá trị HĐ': s.contract_value,
      'Đã thu': s.total_revenue,
      'Phải thu': s.receivable,
      '% thu': s.contract_value > 0 ? ((s.total_revenue / s.contract_value) * 100).toFixed(1) : '0',
    })));
  }

  if (isLoading) return <InlineLoading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="bg-surface-2 border border-border rounded-xl px-5 py-3">
          <p className="text-xs text-subtle mb-0.5">Tổng phải thu</p>
          <p className="text-lg font-semibold text-yellow-400">{formatVnd(totalReceivable)}</p>
        </div>
        <button type="button" onClick={handleExport} className="btn btn-secondary">
          <Download size={14} />
          <span>Xuất CSV</span>
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Giá trị HĐ</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Đã thu</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Phải thu</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">% thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sorted.map((s) => {
              const pctCollected = s.contract_value > 0 ? (s.total_revenue / s.contract_value) * 100 : 0;
              return (
                <tr key={s.project_id} className="hover:bg-slate-700/30 transition">
                  <td className="px-5 py-3">
                    <span className="code">{s.project_code}</span>
                    <p className="text-white">{s.project_name}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-slate-300">{formatCompactVnd(s.contract_value)}</td>
                  <td className="px-5 py-3 text-right text-green-400">{formatCompactVnd(s.total_revenue)}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${s.receivable > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {formatCompactVnd(s.receivable)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(100, pctCollected)}%` }}
                        />
                      </div>
                      <span className="text-slate-300 text-xs w-10 text-right">{pctCollected.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {sorted.map((s) => {
          const pct = s.contract_value > 0 ? (s.total_revenue / s.contract_value) * 100 : 0;
          return (
            <div key={s.project_id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="code">{s.project_code}</span>
                  <p className="font-medium text-white">{s.project_name}</p>
                </div>
                <p className="text-yellow-400 font-semibold text-sm">{formatCompactVnd(s.receivable)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <span className="text-xs text-slate-400">{pct.toFixed(0)}% thu</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Labor Tab ───────────────────────────────────────────────────────────────

function LaborReport() {
  const [month, setMonth] = useState(currentMonth());
  const { data: entries, isLoading } = useAttendance({ month });

  // Group by employee
  const byEmployee = (entries ?? []).reduce<Record<string, {
    name: string;
    code: string | null;
    units: number;
    ot: number;
    allowance: number;
    pay: number;
    days: number;
  }>>((acc, e) => {
    const id = e.employee_id;
    if (!acc[id]) {
      acc[id] = {
        name: e.employee?.full_name ?? 'Không rõ',
        code: e.employee?.employee_code ?? null,
        units: 0, ot: 0, allowance: 0, pay: 0, days: 0,
      };
    }
    acc[id].units += e.work_units;
    acc[id].ot += e.overtime_hours;
    acc[id].allowance += e.allowance;
    acc[id].pay += calcPayroll([e]);
    acc[id].days += 1;
    return acc;
  }, {});

  const rows = Object.values(byEmployee).sort((a, b) => b.pay - a.pay);
  const totalPay = rows.reduce((s, r) => s + r.pay, 0);

  function handleExport() {
    exportCsv(`bao-cao-nhan-cong-${month}`, rows.map((r) => ({
      'Nhân viên': r.name,
      'Mã NV': r.code ?? '',
      'Số công': r.units,
      'OT (giờ)': r.ot,
      'Phụ cấp': r.allowance,
      'Lương ước tính': Math.round(r.pay),
    })));
  }

  if (isLoading) return <InlineLoading />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-input min-w-40"
          aria-label="Chọn tháng báo cáo nhân công"
        />
        <button type="button" onClick={handleExport} className="btn btn-secondary" disabled={!rows.length}>
          <Download size={14} />
          <span>Xuất CSV</span>
        </button>
      </div>

      <div className="bg-surface-2 border border-border rounded-xl px-5 py-3 inline-flex flex-col">
        <p className="text-xs text-subtle mb-0.5">Tổng lương ước tính tháng {month.slice(5)}/{month.slice(0, 4)}</p>
        <p className="text-lg font-semibold text-text">{formatVnd(totalPay)}</p>
      </div>

      <div className="hidden md:block overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nhân viên</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Ngày công</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số công</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">OT (giờ)</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Phụ cấp</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lương ước tính</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-700/30 transition">
                <td className="px-5 py-3">
                  {r.code && <span className="code">{r.code}</span>}
                  <p className="text-white">{r.name}</p>
                </td>
                <td className="px-5 py-3 text-right text-slate-300">{r.days}</td>
                <td className="px-5 py-3 text-right text-slate-300">{r.units}</td>
                <td className="px-5 py-3 text-right text-slate-300">{r.ot.toFixed(1)}</td>
                <td className="px-5 py-3 text-right text-slate-300">{formatCompactVnd(r.allowance)}</td>
                <td className="px-5 py-3 text-right font-semibold text-white">{formatVnd(Math.round(r.pay))}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">Không có dữ liệu chấm công</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex items-center justify-between gap-3">
            <div>
              {r.code && <span className="code text-xs">{r.code}</span>}
              <p className="font-medium text-white">{r.name}</p>
              <p className="text-xs text-slate-400">{r.days} ngày · {r.units} công · OT {r.ot.toFixed(1)}h</p>
            </div>
            <p className="text-white font-semibold text-sm shrink-0">{formatCompactVnd(r.pay)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'pl', label: 'Lợi nhuận', icon: TrendingUp },
  { id: 'cashflow', label: 'Dòng tiền', icon: ArrowLeftRight },
  { id: 'receivables', label: 'Công nợ', icon: CreditCard },
  { id: 'labor', label: 'Nhân công', icon: Users },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pl');

  return (
    <div className="page" id="reports">
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo & Xuất dữ liệu"
        description="Lợi nhuận, dòng tiền, công nợ và chi phí nhân công. Xuất CSV cho kế toán."
      />

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <TabButton key={id} active={activeTab === id} onClick={() => setActiveTab(id)}>
            <Icon size={14} aria-hidden="true" />
            {' '}{label}
          </TabButton>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'pl' && <PLReport />}
      {activeTab === 'cashflow' && <CashflowReport />}
      {activeTab === 'receivables' && <ReceivablesReport />}
      {activeTab === 'labor' && <LaborReport />}
    </div>
  );
}
