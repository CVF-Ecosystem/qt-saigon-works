import { attendance, costs, materialRequests, projects } from "./data";
import { getRuntimeTarget } from "./lib/runtime";
import { isSupabaseConfigured } from "./lib/supabase";
import type { Project, ProjectStatus } from "./types";
import { formatCompactVnd } from "./utils/format";

const companyName = import.meta.env.VITE_APP_COMPANY_NAME || "QT Sai Gon";

const statusLabels: Record<ProjectStatus, string> = {
  preparing: "Chuan bi",
  active: "Dang thi cong",
  paused: "Tam dung",
  handover: "Nghiem thu",
  warranty: "Bao hanh",
  closed: "Dong"
};

function calcMargin(project: Project) {
  return project.contractValue - project.actualCost - project.payable;
}

function App() {
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

  const activeProjects = projects.filter((project) => project.status === "active").length;
  const pendingCosts = costs.filter((cost) => cost.status !== "paid");
  const runtimeTarget = getRuntimeTarget();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Construction operations</p>
          <h1>{companyName} Works</h1>
        </div>
        <nav aria-label="Main navigation">
          <a href="#dashboard">Tong quan</a>
          <a href="#projects">Cong trinh</a>
          <a href="#finance">Tai chinh</a>
          <a href="#hrm">Nhan su</a>
        </nav>
      </header>

      <section className="hero" id="dashboard">
        <div className="hero-copy">
          <p className="eyebrow">MVP cho cong ty xay dung nho</p>
          <h2>Quan ly cong trinh, chi phi, vat tu va nhan su trong mot ung dung gon.</h2>
          <p>
            Ban demo dang dung du lieu mau. Khi ket noi Supabase, cac module nay se chuyen
            sang du lieu that ma khong doi luong su dung.
          </p>
        </div>
        <div className="health-card">
          <span className={isSupabaseConfigured ? "status good" : "status warn"}>
            {isSupabaseConfigured ? "Supabase da cau hinh" : "Dang chay demo offline"}
          </span>
          <span className="status neutral">{runtimeTarget === "desktop" ? "Desktop Tauri" : "Web browser"}</span>
          <strong>{activeProjects} cong trinh dang thi cong</strong>
          <p>{pendingCosts.length} khoan can xu ly trong tai chinh va mua hang.</p>
        </div>
      </section>

      <section className="metrics" aria-label="Company metrics">
        <Metric label="Gia tri hop dong" value={formatCompactVnd(totals.contract)} />
        <Metric label="Da thu" value={formatCompactVnd(totals.collected)} />
        <Metric label="Chi phi ghi nhan" value={formatCompactVnd(totals.actual)} />
        <Metric label="Lai gop uoc tinh" value={formatCompactVnd(totals.margin)} tone="positive" />
      </section>

      <section className="section-grid" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Project management</p>
          <h2>Cong trinh</h2>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-row" key={project.id}>
              <div>
                <span className="code">{project.code}</span>
                <h3>{project.name}</h3>
                <p>{project.client} · Quan ly: {project.manager}</p>
              </div>
              <div className="progress-block">
                <span>{statusLabels[project.status]}</span>
                <div className="progress-track" aria-label={`${project.progress}%`}>
                  <div style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="money-block">
                <strong>{formatCompactVnd(project.contractValue)}</strong>
                <span>Actual {formatCompactVnd(project.actualCost)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split" id="finance">
        <Panel title="Tai chinh va ke toan nhe" eyebrow="Accounting lite">
          <div className="table-list">
            {costs.map((cost) => (
              <div className="table-row" key={cost.id}>
                <div>
                  <span className="code">{cost.projectCode}</span>
                  <strong>{cost.description}</strong>
                  <p>{cost.category} · {cost.owner}</p>
                </div>
                <div className="right">
                  <strong>{formatCompactVnd(cost.amount)}</strong>
                  <span className={`pill ${cost.status}`}>{cost.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Vat tu can xu ly" eyebrow="Materials">
          <div className="table-list">
            {materialRequests.map((request) => (
              <div className="table-row" key={request.id}>
                <div>
                  <span className="code">{request.projectCode}</span>
                  <strong>{request.item}</strong>
                  <p>{request.quantity} · {request.requestedBy}</p>
                </div>
                <span className={`pill ${request.status}`}>{request.status}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="split" id="hrm">
        <Panel title="Nhan su cong truong" eyebrow="HRM lite">
          <div className="table-list">
            {attendance.map((item) => (
              <div className="table-row" key={item.projectCode}>
                <div>
                  <span className="code">{item.projectCode}</span>
                  <strong>{item.workers} nhan su</strong>
                  <p>{item.workDays} cong · {item.overtimeHours} gio tang ca</p>
                </div>
                <div className="right">
                  <strong>{formatCompactVnd(item.payrollEstimate)}</strong>
                  <span>Luong uoc tinh</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Buoc tiep theo" eyebrow="Implementation">
          <ol className="next-list">
            <li>Noi Supabase Auth va bang `profiles`.</li>
            <li>CRUD cong trinh, khach hang, nhan vien, nha cung cap.</li>
            <li>Nhap chi phi va upload chung tu theo cong trinh.</li>
            <li>Dong goi desktop bang Tauri sau khi luong web on dinh.</li>
          </ol>
        </Panel>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "positive";
}) {
  return (
    <article className={`metric ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Panel({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default App;
