import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="app-layout">
      <div className="desktop-nav-shell">
        <Sidebar />
      </div>

      <main className="app-main" id="main-content">
        <Outlet />
      </main>

      <div className="mobile-nav-shell">
        <BottomNav />
      </div>
    </div>
  );
}
