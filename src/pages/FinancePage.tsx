import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useProjectFinance } from '../hooks/useProjectFinance';
import { formatVnd } from '../utils/format';

export default function FinancePage() {
  const { data: financeSummaries, isLoading } = useProjectFinance();

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

  // Calculate totals across all projects
  const totals = financeSummaries?.reduce(
    (acc, project) => ({
      contract_value: acc.contract_value + project.contract_value,
      total_costs: acc.total_costs + project.total_costs,
      total_revenue: acc.total_revenue + project.total_revenue,
      total_expenses: acc.total_expenses + project.total_expenses,
      receivable: acc.receivable + project.receivable,
      payable: acc.payable + project.payable,
      margin: acc.margin + project.margin,
    }),
    {
      contract_value: 0,
      total_costs: 0,
      total_revenue: 0,
      total_expenses: 0,
      receivable: 0,
      payable: 0,
      margin: 0,
    }
  );

  const overallMarginPercent = totals && totals.contract_value > 0
    ? (totals.margin / totals.contract_value) * 100
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TÀI CHÍNH"
        title="Tổng quan tài chính"
        description="Theo dõi doanh thu, chi phí và lợi nhuận"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tổng giá trị HĐ"
          value={formatVnd(totals?.contract_value || 0)}
          icon={DollarSign}
          trend="neutral"
        />
        <MetricCard
          label="Đã thu"
          value={formatVnd(totals?.total_revenue || 0)}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          label="Phải thu"
          value={formatVnd(totals?.receivable || 0)}
          icon={AlertCircle}
          trend={totals && totals.receivable > 0 ? 'down' : 'neutral'}
        />
        <MetricCard
          label="Lợi nhuận dự kiến"
          value={formatVnd(totals?.margin || 0)}
          icon={TrendingUp}
          trend={totals && totals.margin > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Project Finance Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Tài chính theo công trình</h2>
        </div>

        {/* Desktop Table */}
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
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-white">{formatVnd(project.contract_value)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-red-400">{formatVnd(project.total_costs)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-green-400">{formatVnd(project.total_revenue)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={project.receivable > 0 ? 'text-yellow-400' : 'text-slate-400'}>
                      {formatVnd(project.receivable)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={project.margin >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {formatVnd(project.margin)}
                    </div>
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

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-slate-700">
          {financeSummaries?.map((project) => (
            <div key={project.project_id} className="p-4 space-y-3">
              <div>
                <div className="font-mono text-xs text-blue-400 mb-1">{project.project_code}</div>
                <h3 className="font-semibold text-white">{project.project_name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Giá trị HĐ</div>
                  <div className="font-medium text-white">{formatVnd(project.contract_value)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Chi phí</div>
                  <div className="text-red-400">{formatVnd(project.total_costs)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Đã thu</div>
                  <div className="text-green-400">{formatVnd(project.total_revenue)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Phải thu</div>
                  <div className={project.receivable > 0 ? 'text-yellow-400' : 'text-slate-400'}>
                    {formatVnd(project.receivable)}
                  </div>
                </div>
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
      </div>
    </div>
  );
}
