import {
  Banknote,
  Building2,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { attendance, costs, materialRequests, projects } from "../data";
import { DataPanel } from "../components/ui/DataPanel";
import { MetricCard } from "../components/ui/MetricCard";
import { PageHeader } from "../components/ui/PageHeader";
import { ResponsiveTable } from "../components/ui/ResponsiveTable";
import { StatusBadge } from "../components/ui/StatusBadge";
import { isSupabaseConfigured } from "../lib/supabase";
import { getRuntimeTarget } from "../lib/runtime";
import type { Project, ProjectStatus } from "../types";
import { formatCompactVnd } from "../utils/format";

const statusLabels: Record<ProjectStatus, string> = {
  preparing: "Chuẩn bị",
  active: "Đang thi công",
  paused: "Tạm dừng",
  handover: "Nghiệm thu",
  warranty: "Bảo hành",
  closed: "Đóng",
};

const costStatusLabels = {
  approved: "Đã duyệt",
  paid: "Đã thanh toán",
  pending: "Chờ xử lý",
};

const materialStatusLabels = {
  delivered: "Đã giao",
  draft: "Bản nháp",
  ordered: "Đã đặt",
  review: "Chờ duyệt",
};

function calcMargin(project: Project) {
  return project.contractValue - project.actualCost - project.payable;
}

export function DashboardPage() {
  const totals = projects.reduce(
    (acc, project) => {
      acc.contract += project.contractValue;
      acc.actual += project.actualCost;
      acc.collected += project.collected;
      acc.payable += project.payable;
      acc.margin += calcMargin(project);
      return acc;
    },
    { contract: 0, actual: 0, collected: 0, payable: 0, margin: 0 }
  );

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const pendingCosts = costs.filter((c) => c.status !== "paid");
  const runtimeTarget = getRuntimeTarget();

  return (
    <div className="page" id="dashboard">
      <PageHeader
        eyebrow="QT Sai Gon Works"
        title="Tổng quan vận hành"
        description="Theo dõi công trình, dòng tiền, vật tư và nhân sự trong một màn hình gọn cho đội văn phòng lẫn công trường."
        meta={
          <>
            <StatusBadge tone={isSupabaseConfigured ? "success" : "warning"}>
              {isSupabaseConfigured ? "Supabase đã cấu hình" : "Demo offline"}
            </StatusBadge>
            <StatusBadge tone="info">
              {runtimeTarget === "desktop" ? "Desktop Tauri" : "Web browser"}
            </StatusBadge>
          </>
        }
      />

      <section className="status-strip" aria-label="Việc cần xử lý">
        <div>
          <span>Công trình đang thi công</span>
          <strong>{activeProjects}</strong>
        </div>
        <div>
          <span>Khoản tài chính cần xử lý</span>
          <strong>{pendingCosts.length}</strong>
        </div>
        <div>
          <span>Yêu cầu vật tư mở</span>
          <strong>
            {materialRequests.filter((request) => request.status !== "delivered").length}
          </strong>
        </div>
      </section>

      <section className="metrics" aria-label="Company metrics">
        <MetricCard
          icon={Building2}
          label="Giá trị hợp đồng"
          value={formatCompactVnd(totals.contract)}
          trend={`${projects.length} công trình demo`}
        />
        <MetricCard
          icon={Banknote}
          label="Đã thu"
          value={formatCompactVnd(totals.collected)}
          trend="Theo dữ liệu mẫu hiện tại"
        />
        <MetricCard
          icon={ClipboardList}
          label="Chi phí ghi nhận"
          value={formatCompactVnd(totals.actual)}
          trend={`${pendingCosts.length} khoản chưa đóng`}
          tone="warning"
        />
        <MetricCard
          icon={TrendingUp}
          label="Lãi gộp ước tính"
          value={formatCompactVnd(totals.margin)}
          tone="positive"
          trend="Contract - actual - payable"
        />
      </section>

      <section className="section-grid" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Project management</p>
          <h2>Công trình</h2>
        </div>
        <ResponsiveTable ariaLabel="Danh sách công trình">
          <thead>
            <tr>
              <th>Công trình</th>
              <th>Trạng thái</th>
              <th>Tiến độ</th>
              <th>Hợp đồng</th>
              <th>Chi phí</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <span className="code">{project.code}</span>
                  <strong>{project.name}</strong>
                  <p>
                    {project.client} · Quản lý: {project.manager}
                  </p>
                </td>
                <td>{statusLabels[project.status]}</td>
                <td>
                  <div className="progress-block">
                    <span>{project.progress}%</span>
                    <div
                      className="progress-track"
                      aria-label={`${project.progress}%`}
                    >
                      <div style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="numeric">{formatCompactVnd(project.contractValue)}</td>
                <td className="numeric">{formatCompactVnd(project.actualCost)}</td>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      </section>

      <section className="split" id="finance">
        <DataPanel title="Tài chính và kế toán nhẹ" eyebrow="Accounting lite">
          <div className="table-list">
            {costs.map((cost) => (
              <div className="table-row" key={cost.id}>
                <div>
                  <span className="code">{cost.projectCode}</span>
                  <strong>{cost.description}</strong>
                  <p>
                    {cost.category} · {cost.owner}
                  </p>
                </div>
                <div className="right">
                  <strong>{formatCompactVnd(cost.amount)}</strong>
                  <StatusBadge
                    tone={cost.status === "paid" ? "success" : cost.status === "pending" ? "warning" : "info"}
                  >
                    {costStatusLabels[cost.status]}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Vật tư cần xử lý" eyebrow="Materials">
          <div className="table-list">
            {materialRequests.map((request) => (
              <div className="table-row" key={request.id}>
                <div>
                  <span className="code">{request.projectCode}</span>
                  <strong>{request.item}</strong>
                  <p>
                    {request.quantity} · {request.requestedBy}
                  </p>
                </div>
                <StatusBadge
                  tone={request.status === "delivered" ? "success" : request.status === "draft" ? "neutral" : "warning"}
                >
                  {materialStatusLabels[request.status]}
                </StatusBadge>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>

      <section className="split" id="hrm">
        <DataPanel title="Nhân sự công trường" eyebrow="HRM lite">
          <div className="table-list">
            {attendance.map((item) => (
              <div className="table-row" key={item.projectCode}>
                <div>
                  <span className="code">{item.projectCode}</span>
                  <strong>{item.workers} nhân sự</strong>
                  <p>
                    {item.workDays} công · {item.overtimeHours} giờ tăng ca
                  </p>
                </div>
                <div className="right">
                  <strong>{formatCompactVnd(item.payrollEstimate)}</strong>
                  <span>Lương ước tính</span>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Bước tiếp theo" eyebrow="Implementation">
          <ol className="next-list">
            <li>Nối Supabase Auth và bảng profiles.</li>
            <li>CRUD công trình, khách hàng, nhân viên, nhà cung cấp.</li>
            <li>Nhập chi phí và upload chứng từ theo công trình.</li>
            <li>Đóng gói desktop bằng Tauri sau khi luồng web ổn định.</li>
          </ol>
        </DataPanel>
      </section>
    </div>
  );
}
