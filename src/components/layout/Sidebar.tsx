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
  Truck,
  ClipboardList,
  ShoppingCart,
  UserCircle,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

const companyName = import.meta.env.VITE_APP_COMPANY_NAME || "QT Sai Gon";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Công trình",
    items: [
      { to: "/cong-trinh", icon: Building2, label: "Công trình" },
      { to: "/tai-lieu", icon: FileText, label: "Tài liệu" },
    ],
  },
  {
    label: "Tài chính",
    items: [
      { to: "/tai-chinh", icon: Wallet, label: "Tài chính" },
      { to: "/bao-cao", icon: BarChart3, label: "Báo cáo" },
    ],
  },
  {
    label: "Vật tư",
    items: [
      { to: "/vat-tu", icon: Package, label: "Danh mục vật tư" },
      { to: "/yeu-cau-vat-tu", icon: ClipboardList, label: "Yêu cầu vật tư" },
      { to: "/don-mua-vat-tu", icon: ShoppingCart, label: "Đơn mua vật tư" },
      { to: "/nha-cung-cap", icon: Truck, label: "Nhà cung cấp" },
    ],
  },
  {
    label: "Nhân sự",
    items: [
      { to: "/nhan-su", icon: Users, label: "Nhân viên" },
      { to: "/cham-cong", icon: ClipboardList, label: "Chấm công" },
    ],
  },
  {
    label: "Danh mục",
    items: [{ to: "/khach-hang", icon: UserCircle, label: "Khách hàng" }],
  },
  {
    label: "Hệ thống",
    items: [{ to: "/cau-hinh", icon: Settings, label: "Cấu hình" }],
  },
];

const ROLE_LABELS: Record<string, string> = {
  owner: "Chủ doanh nghiệp",
  accountant: "Kế toán",
  project_manager: "Quản lý dự án",
  site_supervisor: "Chỉ huy công trường",
  hr: "Nhân sự",
  viewer: "Xem",
};

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>{companyName}</h1>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {/* Dashboard — standalone, no group */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            ["sidebar-link", isActive ? "sidebar-link-active" : "sidebar-link-idle"].join(" ")
          }
        >
          <LayoutDashboard size={18} aria-hidden="true" />
          <span>Tổng quan</span>
        </NavLink>

        {NAV_GROUPS.map((group) => (
          <section className="sidebar-group" key={group.label}>
            <h2 className="sidebar-group-label">{group.label}</h2>
            <ul>
              {group.items.map(({ to, icon: Icon, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      ["sidebar-link", isActive ? "sidebar-link-active" : "sidebar-link-idle"].join(" ")
                    }
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={toggle}
          className="sidebar-theme-btn"
          aria-label={theme === "dark" ? "Chuyển chế độ sáng" : "Chuyển chế độ tối"}
        >
          {theme === "dark" ? (
            <Sun size={14} aria-hidden="true" />
          ) : (
            <Moon size={14} aria-hidden="true" />
          )}
          <span>{theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}</span>
        </button>

        {profile && (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              <User size={15} aria-hidden="true" />
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{profile.full_name}</p>
              <p className="sidebar-user-role">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="sidebar-logout-btn"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
