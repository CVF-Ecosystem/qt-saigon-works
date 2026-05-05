import { Link, useLocation } from "react-router-dom";
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
  match: string[];
}

const BOTTOM_ITEMS: BottomNavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan", end: true, match: ["/"] },
  { to: "/cong-trinh", icon: Building2, label: "Công trình", match: ["/cong-trinh", "/tai-lieu"] },
  { to: "/nhan-su", icon: Users, label: "Nhân sự", match: ["/nhan-su", "/cham-cong"] },
  { to: "/vat-tu", icon: Package, label: "Vật tư", match: ["/vat-tu", "/yeu-cau-vat-tu", "/don-mua-vat-tu", "/nha-cung-cap"] },
  { to: "/tai-chinh", icon: Wallet, label: "Tài chính", match: ["/tai-chinh"] },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="bottom-nav"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul>
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label, match }) => {
          const isActive = match.some((path) =>
            path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
          );

          return (
            <li key={to}>
              <Link
                to={to}
                className={[
                  "bottom-nav-link",
                  isActive ? "bottom-nav-link-active" : "bottom-nav-link-idle",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={22}
                  aria-hidden="true"
                  className={isActive ? "bottom-nav-icon-active" : "bottom-nav-icon-idle"}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
