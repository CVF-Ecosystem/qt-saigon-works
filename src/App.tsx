import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { AppLayout } from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";
import ClientsPage from "./pages/ClientsPage";

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
            <Route
              path="/cong-trinh"
              element={<PlaceholderPage title="Công trình" />}
            />
            <Route
              path="/tai-chinh"
              element={<PlaceholderPage title="Tài chính" />}
            />
            <Route
              path="/vat-tu"
              element={<PlaceholderPage title="Vật tư" />}
            />
            <Route
              path="/nhan-su"
              element={<PlaceholderPage title="Nhân sự" />}
            />
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
