import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
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
    </BrowserRouter>
  );
}
