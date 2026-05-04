import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";
import ClientsPage from "./pages/ClientsPage";
import ProjectsPage from "./pages/ProjectsPage";
import EmployeesPage from "./pages/EmployeesPage";
import SuppliersPage from "./pages/SuppliersPage";
import MaterialsPage from "./pages/MaterialsPage";
import MaterialRequestsPage from "./pages/MaterialRequestsPage";
import FinancePage from "./pages/FinancePage";
import AttendancePage from "./pages/AttendancePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="/khach-hang" element={<ClientsPage />} />
            <Route path="/cong-trinh" element={<ProjectsPage />} />
            <Route path="/nhan-su" element={<EmployeesPage />} />
            <Route path="/cham-cong" element={<AttendancePage />} />
            <Route path="/nha-cung-cap" element={<SuppliersPage />} />
            <Route path="/vat-tu" element={<MaterialsPage />} />
            <Route path="/yeu-cau-vat-tu" element={<MaterialRequestsPage />} />
            <Route path="/tai-chinh" element={<FinancePage />} />
            <Route
              path="/tai-lieu"
              element={<PlaceholderPage title="Tài liệu" />}
            />
            <Route
              path="/cau-hinh"
              element={<PlaceholderPage title="Cấu hình" />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
