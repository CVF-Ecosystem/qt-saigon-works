import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { ThemeProvider } from "./lib/theme";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const MaterialsPage = lazy(() => import("./pages/MaterialsPage"));
const MaterialRequestsPage = lazy(() => import("./pages/MaterialRequestsPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/PurchaseOrdersPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[360px]">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Đang tải...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoading />}>
                  <AppLayout />
                </Suspense>
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
            <Route path="/don-mua-vat-tu" element={<PurchaseOrdersPage />} />
            <Route path="/tai-chinh" element={<FinancePage />} />
            <Route path="/tai-lieu" element={<DocumentsPage />} />
            <Route path="/bao-cao" element={<ReportsPage />} />
            <Route
              path="/cau-hinh"
              element={<PlaceholderPage title="Cấu hình" />}
            />
          </Route>
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
