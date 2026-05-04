import { Building2, Banknote, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataPanel } from '../components/ui/DataPanel';
import { MetricCard } from '../components/ui/MetricCard';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { isSupabaseConfigured } from '../lib/supabase';
import { getRuntimeTarget } from '../lib/runtime';
import { useProjects } from '../hooks/useProjects';
import { useProjectFinance } from '../hooks/useProjectFinance';
import { useCosts } from '../hooks/useCosts';
import { formatCompactVnd } from '../utils/format';

const statusLabels: Record<string, string> = {
  preparing: 'Chuẩn bị',
  active: 'Đang thi công',
  paused: 'Tạm dừng',
  handover: 'Nghiệm thu',
  warranty: 'Bảo hành',
  closed: 'Đóng',
};

const statusTones: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  preparing: 'info',
  active: 'success',
  paused: 'warning',
  handover: 'info',
  warranty: 'neutral',
  closed: 'neutral',
};

const costStatusLabels: Record<string, string> = {
  draft: 'Nháp',
  review: 'Đang duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  paid: 'Đã TT',
};

const costStatusTones: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  draft: 'neutral',
  review: 'warning',
  approved: 'info',
  rejected: 'danger',
  paid: 'success',
};

export function DashboardPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: financeSummaries, isLoading: financeLoading } = useProjectFinance();
  const { data: costs, isLoading: costsLoading } = useCosts();

  const runtimeTarget = getRuntimeTarget();

  const activeProjects = projects?.filter((p) => p.status === 'active').length ?? 0;
  const pendingCosts = costs?.filter((c) => c.status !== 'paid' && c.status !== 'rejected') ?? [];

  const totals = financeSummaries?.reduce(
    (acc, p) => ({
      contract: acc.contract + p.contract_value,
      revenue: acc.revenue + p.total_revenue,
      costs: acc.costs + p.total_costs,
      receivable: acc.receivable + p.receivable,
      margin: acc.margin + p.margin,
    }),
    { contract: 0, revenue: 0, costs: 0, receivable: 0, margin: 0 }
  );

  const isLoading = projectsLoading || financeLoading || costsLoading;

  return (
    <div className="page" id="dashboard">
      <PageHeader
        eyebrow="QT Sai Gon Works"
        title="Tổng quan vận hành"
        description="Theo dõi công trình, dòng tiền, vật tư và nhân sự trong một màn hình."
        meta={
          <>
            <StatusBadge tone={isSupabaseConfigured ? 'success' : 'warning'}>
              {isSupabaseConfigured ? 'Supabase đã cấu hình' : 'Demo offline'}
            </StatusBadge>
            <StatusBadge tone="info">
              {runtimeTarget === 'desktop' ? 'Desktop Tauri' : 'Web browser'}
            </StatusBadge>
          </>
        }
      />

      {/* Status strip */}
      <section className="status-strip" aria-label="Việc cần xử lý">
        <div>
          <span>Công trình đang thi công</span>
          <strong>{isLoading ? '…' : activeProjects}</strong>
        </div>
        <div>
          <span>Chi phí chưa đóng</span>
          <strong>{isLoading ? '…' : pendingCosts.length}</strong>
        </div>
        <div>
          <span>Phải thu</span>
          <strong>{isLoading ? '…' : formatCompactVnd(totals?.receivable ?? 0)}</strong>
        </div>
      </section>

      {/* Metric cards */}
      <section className="metrics" aria-label="Chỉ số tổng công ty">
        <MetricCard
          icon={Building2}
          label="Giá trị hợp đồng"
          value={isLoading ? '…' : formatCompactVnd(totals?.contract ?? 0)}
          trend={`${projects?.length ?? 0} công trình`}
        />
        <MetricCard
          icon={Banknote}
          label="Đã thu"
          value={isLoading ? '…' : formatCompactVnd(totals?.revenue ?? 0)}
          tone="positive"
          trend={`Còn phải thu: ${formatCompactVnd(totals?.receivable ?? 0)}`}
        />
        <MetricCard
          icon={ClipboardList}
          label="Chi phí ghi nhận"
          value={isLoading ? '…' : formatCompactVnd(totals?.costs ?? 0)}
          tone="warning"
          trend={`${pendingCosts.length} khoản chưa đóng`}
        />
        <MetricCard
          icon={TrendingUp}
          label="Lãi gộp ước tính"
          value={isLoading ? '…' : formatCompactVnd(totals?.margin ?? 0)}
          tone={totals && totals.margin >= 0 ? 'positive' : 'warning'}
          trend="Giá trị HĐ − Chi phí"
        />
      </section>

      {/* Projects table */}
      <section className="section-grid" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Quản lý công trình</p>
          <h2>Công trình</h2>
        </div>

        {projectsLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects?.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
            <p className="text-slate-400 mb-3">Chưa có công trình nào</p>
            <Link to="/cong-trinh" className="text-blue-400 hover:text-blue-300 text-sm">
              + Thêm công trình đầu tiên
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Công trình</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tiến độ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Giá trị HĐ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Lợi nhuận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {projects?.slice(0, 5).map((project) => {
                    const finance = financeSummaries?.find((f) => f.project_id === project.id);
                    return (
                      <tr key={project.id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-blue-400 mb-1">{project.code}</div>
                          <div className="font-medium text-white">{project.name}</div>
                          {project.site_address && (
                            <div className="text-sm text-slate-400">{project.site_address}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge tone={statusTones[project.status] || 'neutral'}>
                            {statusLabels[project.status] || project.status}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4 text-right text-white">{project.progress_percent}%</td>
                        <td className="px-6 py-4 text-right font-medium text-white">
                          {formatCompactVnd(project.contract_value)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {finance ? (
                            <span className={finance.margin >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                              {formatCompactVnd(finance.margin)}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-700">
              {projects?.slice(0, 5).map((project) => {
                const finance = financeSummaries?.find((f) => f.project_id === project.id);
                return (
                  <div key={project.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-xs text-blue-400 mb-1">{project.code}</div>
                        <div className="font-semibold text-white">{project.name}</div>
                      </div>
                      <StatusBadge tone={statusTones[project.status] || 'neutral'}>
                        {statusLabels[project.status] || project.status}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Tiến độ: {project.progress_percent}%</span>
                      <span className="font-medium text-white">{formatCompactVnd(project.contract_value)}</span>
                    </div>
                    {finance && (
                      <div className={`text-sm font-semibold ${finance.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        LN: {formatCompactVnd(finance.margin)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {projects && projects.length > 5 && (
              <div className="px-6 py-3 border-t border-slate-700 text-center">
                <Link to="/cong-trinh" className="text-sm text-blue-400 hover:text-blue-300">
                  Xem tất cả {projects.length} công trình →
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Finance + Pending costs */}
      <section className="split" id="finance">
        <DataPanel title="Chi phí cần xử lý" eyebrow="Tài chính">
          {costsLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pendingCosts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm">Không có chi phí cần xử lý</p>
            </div>
          ) : (
            <div className="table-list">
              {pendingCosts.slice(0, 5).map((cost) => (
                <div className="table-row" key={cost.id}>
                  <div>
                    {cost.project && (
                      <span className="code">{cost.project.code}</span>
                    )}
                    <strong>{cost.description}</strong>
                    <p>{cost.vendor_name || cost.category?.name || '—'}</p>
                  </div>
                  <div className="right">
                    <strong>{formatCompactVnd(cost.amount)}</strong>
                    <StatusBadge tone={costStatusTones[cost.status] || 'neutral'}>
                      {costStatusLabels[cost.status] || cost.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 text-center">
            <Link to="/tai-chinh" className="text-sm text-blue-400 hover:text-blue-300">
              Xem tất cả →
            </Link>
          </div>
        </DataPanel>

        <DataPanel title="Tình hình phải thu" eyebrow="Công nợ">
          {financeLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="table-list">
              {financeSummaries?.filter((f) => f.receivable > 0).slice(0, 5).map((f) => (
                <div className="table-row" key={f.project_id}>
                  <div>
                    <span className="code">{f.project_code}</span>
                    <strong>{f.project_name}</strong>
                  </div>
                  <div className="right">
                    <strong className="text-yellow-400">{formatCompactVnd(f.receivable)}</strong>
                    <span className="text-slate-400 text-xs">Phải thu</span>
                  </div>
                </div>
              ))}
              {financeSummaries?.filter((f) => f.receivable > 0).length === 0 && (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm">Không có công nợ phải thu</p>
                </div>
              )}
            </div>
          )}
          <div className="mt-3 text-center">
            <Link to="/tai-chinh" className="text-sm text-blue-400 hover:text-blue-300">
              Xem chi tiết →
            </Link>
          </div>
        </DataPanel>
      </section>

      {/* Quick links */}
      <section className="split" id="quick-links">
        <DataPanel title="Truy cập nhanh" eyebrow="Navigation">
          <div className="table-list">
            {[
              { to: '/cong-trinh', label: 'Quản lý công trình', desc: 'Thêm, sửa, theo dõi tiến độ' },
              { to: '/tai-chinh', label: 'Tài chính', desc: 'Chi phí, thu chi, lợi nhuận' },
              { to: '/vat-tu', label: 'Vật tư', desc: 'Danh mục vật tư xây dựng' },
              { to: '/nhan-su', label: 'Nhân sự', desc: 'Hồ sơ nhân viên' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="table-row hover:bg-slate-700/30 transition rounded-lg px-2">
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.desc}</p>
                </div>
                <AlertCircle size={16} className="text-slate-500" />
              </Link>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Thông tin hệ thống" eyebrow="System">
          <div className="table-list">
            <div className="table-row">
              <div><strong>Supabase</strong><p>Backend database</p></div>
              <StatusBadge tone={isSupabaseConfigured ? 'success' : 'warning'}>
                {isSupabaseConfigured ? 'Đã kết nối' : 'Chưa cấu hình'}
              </StatusBadge>
            </div>
            <div className="table-row">
              <div><strong>Runtime</strong><p>Môi trường chạy</p></div>
              <StatusBadge tone="info">
                {runtimeTarget === 'desktop' ? 'Desktop' : 'Web'}
              </StatusBadge>
            </div>
            <div className="table-row">
              <div><strong>Phiên bản</strong><p>QT Sai Gon Works</p></div>
              <span className="text-slate-400 text-sm">v0.1.0</span>
            </div>
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
