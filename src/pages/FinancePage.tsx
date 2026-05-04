import { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import CostForm from '../components/finance/CostForm';
import PaymentForm from '../components/finance/PaymentForm';
import { useProjectFinance } from '../hooks/useProjectFinance';
import { useCosts, useCreateCost, useUpdateCost, useDeleteCost, type ProjectCost } from '../hooks/useCosts';
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment, type Payment } from '../hooks/usePayments';
import { formatVnd } from '../utils/format';

type Tab = 'overview' | 'costs' | 'payments';

const costStatusLabels: Record<string, string> = {
  draft: 'Nháp',
  review: 'Đang duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  paid: 'Đã TT',
  ordered: 'Đã đặt',
  delivered: 'Đã giao',
  closed: 'Đóng',
};

const costStatusTones: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  draft: 'neutral',
  review: 'warning',
  approved: 'info',
  rejected: 'danger',
  paid: 'success',
  ordered: 'info',
  delivered: 'success',
  closed: 'neutral',
};

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Chuyển khoản',
  cash: 'Tiền mặt',
  check: 'Séc',
  other: 'Khác',
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showCostForm, setShowCostForm] = useState(false);
  const [editingCost, setEditingCost] = useState<ProjectCost | undefined>();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>();

  const { data: financeSummaries, isLoading: financeLoading } = useProjectFinance();
  const { data: costs, isLoading: costsLoading } = useCosts();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const createCost = useCreateCost();
  const updateCost = useUpdateCost();
  const deleteCost = useDeleteCost();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  // --- Cost handlers ---
  function handleCreateCost(input: any) {
    createCost.mutate(input, { onSuccess: () => setShowCostForm(false) });
  }
  function handleUpdateCost(input: any) {
    if (!editingCost) return;
    updateCost.mutate({ id: editingCost.id, input }, { onSuccess: () => setEditingCost(undefined) });
  }
  function handleDeleteCost(id: string, desc: string) {
    if (!confirm(`Xóa chi phí "${desc}"?`)) return;
    deleteCost.mutate(id);
  }

  // --- Payment handlers ---
  function handleCreatePayment(input: any) {
    createPayment.mutate(input, { onSuccess: () => setShowPaymentForm(false) });
  }
  function handleUpdatePayment(input: any) {
    if (!editingPayment) return;
    updatePayment.mutate({ id: editingPayment.id, input }, { onSuccess: () => setEditingPayment(undefined) });
  }
  function handleDeletePayment(id: string, desc: string) {
    if (!confirm(`Xóa giao dịch "${desc}"?`)) return;
    deletePayment.mutate(id);
  }

  // --- Totals ---
  const totals = financeSummaries?.reduce(
    (acc, p) => ({
      contract_value: acc.contract_value + p.contract_value,
      total_costs: acc.total_costs + p.total_costs,
      total_revenue: acc.total_revenue + p.total_revenue,
      receivable: acc.receivable + p.receivable,
      margin: acc.margin + p.margin,
    }),
    { contract_value: 0, total_costs: 0, total_revenue: 0, receivable: 0, margin: 0 }
  );

  const overallMarginPct = totals && totals.contract_value > 0
    ? ((totals.margin / totals.contract_value) * 100).toFixed(1)
    : '0.0';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'costs', label: 'Chi phí' },
    { id: 'payments', label: 'Thu chi' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="TÀI CHÍNH"
          title="Tài chính"
          description="Theo dõi doanh thu, chi phí và lợi nhuận"
        />
        {activeTab === 'costs' && (
          <button
            onClick={() => setShowCostForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Thêm chi phí</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        )}
        {activeTab === 'payments' && (
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Thêm giao dịch</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        )}
      </div>

      {/* Summary Cards - always visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tổng giá trị HĐ"
          value={formatVnd(totals?.contract_value || 0)}
          icon={DollarSign}
          tone="info"
        />
        <MetricCard
          label="Đã thu"
          value={formatVnd(totals?.total_revenue || 0)}
          icon={TrendingUp}
          tone="positive"
        />
        <MetricCard
          label="Phải thu"
          value={formatVnd(totals?.receivable || 0)}
          icon={AlertCircle}
          tone={totals && totals.receivable > 0 ? 'warning' : 'default'}
        />
        <MetricCard
          label="Lợi nhuận dự kiến"
          value={formatVnd(totals?.margin || 0)}
          icon={totals && totals.margin >= 0 ? TrendingUp : TrendingDown}
          tone={totals && totals.margin >= 0 ? 'positive' : 'warning'}
          trend={`Biên LN: ${overallMarginPct}%`}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex gap-1" aria-label="Finance tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white border border-b-0 border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab: Tổng quan */}
      {activeTab === 'overview' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          {financeLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Giá trị HĐ</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Chi phí</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Đã thu</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Phải thu</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lợi nhuận</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Biên LN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {financeSummaries?.map((project) => (
                      <tr key={project.project_id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-blue-400 mb-1">{project.project_code}</div>
                          <div className="font-medium text-white">{project.project_name}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-white">{formatVnd(project.contract_value)}</td>
                        <td className="px-6 py-4 text-right text-red-400">{formatVnd(project.total_costs)}</td>
                        <td className="px-6 py-4 text-right text-green-400">{formatVnd(project.total_revenue)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={project.receivable > 0 ? 'text-yellow-400' : 'text-slate-400'}>
                            {formatVnd(project.receivable)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={project.margin >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                            {formatVnd(project.margin)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge tone={project.margin_percent >= 15 ? 'success' : project.margin_percent >= 5 ? 'warning' : 'danger'}>
                            {project.margin_percent.toFixed(1)}%
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="lg:hidden divide-y divide-slate-700">
                {financeSummaries?.map((project) => (
                  <div key={project.project_id} className="p-4 space-y-3">
                    <div>
                      <div className="font-mono text-xs text-blue-400 mb-1">{project.project_code}</div>
                      <h3 className="font-semibold text-white">{project.project_name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><div className="text-slate-400">Giá trị HĐ</div><div className="font-medium text-white">{formatVnd(project.contract_value)}</div></div>
                      <div><div className="text-slate-400">Chi phí</div><div className="text-red-400">{formatVnd(project.total_costs)}</div></div>
                      <div><div className="text-slate-400">Đã thu</div><div className="text-green-400">{formatVnd(project.total_revenue)}</div></div>
                      <div><div className="text-slate-400">Phải thu</div><div className={project.receivable > 0 ? 'text-yellow-400' : 'text-slate-400'}>{formatVnd(project.receivable)}</div></div>
                    </div>
                    <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Lợi nhuận dự kiến</div>
                        <div className={`text-lg font-semibold ${project.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatVnd(project.margin)}
                        </div>
                      </div>
                      <StatusBadge tone={project.margin_percent >= 15 ? 'success' : project.margin_percent >= 5 ? 'warning' : 'danger'}>
                        {project.margin_percent.toFixed(1)}%
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>

              {financeSummaries?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">Chưa có dữ liệu tài chính</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Chi phí */}
      {activeTab === 'costs' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          {costsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ngày</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mô tả</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số tiền</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {costs?.map((cost) => (
                      <tr key={cost.id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{cost.cost_date}</td>
                        <td className="px-6 py-4">
                          {cost.project ? (
                            <div>
                              <div className="font-mono text-xs text-blue-400">{cost.project.code}</div>
                              <div className="text-sm text-slate-300">{cost.project.name}</div>
                            </div>
                          ) : <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{cost.description}</div>
                          {cost.vendor_name && <div className="text-sm text-slate-400">{cost.vendor_name}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {cost.category?.name || <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-red-400">{formatVnd(cost.amount)}</td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge tone={costStatusTones[cost.status] || 'neutral'}>
                            {costStatusLabels[cost.status] || cost.status}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingCost(cost)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCost(cost.id, cost.description)}
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

              {/* Mobile */}
              <div className="md:hidden space-y-0 divide-y divide-slate-700">
                {costs?.map((cost) => (
                  <div key={cost.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white">{cost.description}</div>
                        {cost.project && (
                          <div className="text-xs text-blue-400 mt-0.5">{cost.project.code} · {cost.project.name}</div>
                        )}
                        {cost.vendor_name && <div className="text-sm text-slate-400">{cost.vendor_name}</div>}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => setEditingCost(cost)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteCost(cost.id, cost.description)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-red-400">{formatVnd(cost.amount)}</div>
                        <div className="text-xs text-slate-500">{cost.cost_date} · {cost.category?.name || 'Chưa phân loại'}</div>
                      </div>
                      <StatusBadge tone={costStatusTones[cost.status] || 'neutral'}>
                        {costStatusLabels[cost.status] || cost.status}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>

              {costs?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">Chưa có chi phí nào</p>
                  <button onClick={() => setShowCostForm(true)} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
                    + Thêm chi phí đầu tiên
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Thu chi */}
      {activeTab === 'payments' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ngày</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Đối tác</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mô tả</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Số tiền</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Phương thức</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {payments?.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">{payment.payment_date}</td>
                        <td className="px-6 py-4">
                          <StatusBadge tone={payment.direction === 'in' ? 'success' : 'danger'}>
                            {payment.direction === 'in' ? 'Thu' : 'Chi'}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{payment.counterparty}</td>
                        <td className="px-6 py-4 font-medium text-white">{payment.description}</td>
                        <td className="px-6 py-4">
                          {payment.project ? (
                            <div className="font-mono text-xs text-blue-400">{payment.project.code}</div>
                          ) : <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-semibold ${payment.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                            {payment.direction === 'in' ? '+' : '-'}{formatVnd(payment.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-400">
                          {paymentMethodLabels[payment.method] || payment.method}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingPayment(payment)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id, payment.description)}
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

              {/* Mobile */}
              <div className="md:hidden divide-y divide-slate-700">
                {payments?.map((payment) => (
                  <div key={payment.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge tone={payment.direction === 'in' ? 'success' : 'danger'}>
                            {payment.direction === 'in' ? 'Thu' : 'Chi'}
                          </StatusBadge>
                          {payment.project && (
                            <span className="font-mono text-xs text-blue-400">{payment.project.code}</span>
                          )}
                        </div>
                        <div className="font-medium text-white">{payment.description}</div>
                        <div className="text-sm text-slate-400">{payment.counterparty}</div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => setEditingPayment(payment)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeletePayment(payment.id, payment.description)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-lg font-semibold ${payment.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                          {payment.direction === 'in' ? '+' : '-'}{formatVnd(payment.amount)}
                        </div>
                        <div className="text-xs text-slate-500">{payment.payment_date} · {paymentMethodLabels[payment.method] || payment.method}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {payments?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">Chưa có giao dịch nào</p>
                  <button onClick={() => setShowPaymentForm(true)} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
                    + Thêm giao dịch đầu tiên
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Cost Form Modal */}
      {(showCostForm || editingCost) && (
        <CostForm
          cost={editingCost}
          onSubmit={editingCost ? handleUpdateCost : handleCreateCost}
          onCancel={() => { setShowCostForm(false); setEditingCost(undefined); }}
          loading={createCost.isPending || updateCost.isPending}
        />
      )}

      {/* Payment Form Modal */}
      {(showPaymentForm || editingPayment) && (
        <PaymentForm
          payment={editingPayment}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          onCancel={() => { setShowPaymentForm(false); setEditingPayment(undefined); }}
          loading={createPayment.isPending || updatePayment.isPending}
        />
      )}
    </div>
  );
}
