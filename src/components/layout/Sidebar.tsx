import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Package,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const companyName = import.meta.env.VITE_APP_COMPANY_NAME || "QT Sai Gon";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/cong-trinh", icon: Building2, label: "Công trình" },
  { to: "/tai-chinh", icon: Wallet, label: "Tài chính" },
  { to: "/vat-tu", icon: Package, label: "Vật tư" },
  { to: "/nhan-su", icon: Users, label: "Nhân sự" },
  { to: "/tai-lieu", icon: FileText, label: "Tài liệu" },
  { to: "/cau-hinh", icon: Settings, label: "Cấu hình" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p>
          Construction ops
        </p>
        <h1>{companyName}</h1>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <ul>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "sidebar-link",
                    isActive ? "sidebar-link-active" : "sidebar-link-idle",
                  ].join(" ")
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p>QT Sai Gon Works v0.1</p>
      </div>
    </aside>
  );
}
