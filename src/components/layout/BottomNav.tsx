import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Package,
  Users,
  UserCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BottomNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const BOTTOM_ITEMS: BottomNavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/cong-trinh", icon: Building2, label: "Công trình" },
  { to: "/nhan-su", icon: Users, label: "Nhân sự" },
  { to: "/vat-tu", icon: Package, label: "Vật tư" },
  { to: "/tai-chinh", icon: Wallet, label: "Tài chính" },
];

export function BottomNav() {
  return (
    <nav
      className="bottom-nav"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul>
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "bottom-nav-link",
                  isActive ? "bottom-nav-link-active" : "bottom-nav-link-idle",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className={isActive ? "bottom-nav-icon-active" : "bottom-nav-icon-idle"}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
