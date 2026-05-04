import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  UserCircle,
  Truck,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../lib/auth";

const companyName = import.meta.env.VITE_APP_COMPANY_NAME || "QT Sai Gon";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/khach-hang", icon: UserCircle, label: "Khách hàng" },
  { to: "/cong-trinh", icon: Building2, label: "Công trình" },
  { to: "/tai-chinh", icon: Wallet, label: "Tài chính" },
  { to: "/nhan-su", icon: Users, label: "Nhân sự" },
  { to: "/cham-cong", icon: ClipboardList, label: "Chấm công" },
  { to: "/nha-cung-cap", icon: Truck, label: "Nhà cung cấp" },
  { to: "/vat-tu", icon: Package, label: "Vật tư" },
  { to: "/yeu-cau-vat-tu", icon: ClipboardList, label: "Yêu cầu vật tư" },
  { to: "/tai-lieu", icon: FileText, label: "Tài liệu" },
  { to: "/cau-hinh", icon: Settings, label: "Cấu hình" },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();

  const roleLabels: Record<string, string> = {
    owner: 'Chủ doanh nghiệp',
    accountant: 'Kế toán',
    project_manager: 'Quản lý dự án',
    site_supervisor: 'Chỉ huy công trường',
    hr: 'Nhân sự',
    viewer: 'Xem',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p>Construction ops</p>
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
        {profile && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile.full_name}
                </p>
                <p className="text-xs text-slate-400">
                  {roleLabels[profile.role] || profile.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
        <p className="text-slate-500 text-xs">QT Sai Gon Works v0.1</p>
      </div>
    </aside>
  );
}
