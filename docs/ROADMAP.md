# QT Sai Gon Works - Implementation Roadmap

Cap nhat: 2026-05-05 (session 2 — Phase 2 + Phase 3 CLOSED)

## Nguyen tac ban giao cho Claude/agent

Truoc khi code, agent phai doc theo thu tu:

1. `AGENTS.md`
2. `.cvf/manifest.json`
3. `.cvf/policy.json`
4. `docs/AGENT_HANDOFF.md`
5. `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`
6. `docs/PRODUCT_SPEC.md`
7. `docs/ARCHITECTURE.md`
8. File nay

Mac dinh moi thay doi UI phai thiet ke mobile va desktop cung luc. Khong build desktop truoc roi sua mobile sau.

## Trang thai hien tai

Da co:

- React + Vite + TypeScript skeleton.
- Netlify config.
- Supabase client configured via local env.
- TanStack Query provider.
- Runtime helper de phan biet web vs Tauri desktop.
- Supabase migration MVP.
- Tauri desktop skeleton.
- Auth UI + protected app shell.
- Responsive desktop sidebar + mobile bottom nav.
- Playwright viewport smoke tests.
- Dashboard MVP.
- CRUD clients, projects, employees, suppliers, material catalog.
- P2.1 finance overview, costs, payments.
- P2.2 material requests + basic purchase orders with supplier link.
- P2.3 attendance + payroll estimate.
- UI/mobile/desktop standards.
- Agent handoff.

Da verify:

- `npm install`
- `npm run build`
- `npm run test:ui -- --reporter=line`
- Live Supabase UI smoke for attendance, core CRUD, and purchase order create/delete.

Da co them (session 2 — 2026-05-05):

- Sprint UI-1: design token unification, font-weight fix, WCAG contrast, sidebar IA regrouping, shared primitives (LoadingSpinner, EmptyState, labels.ts), Dashboard cleanup.
- P2.4 Documents: upload/download/delete via Supabase Storage, signed URL, document type labels.
- Phase 3 Reporting: /bao-cao voi 4 tab (Loi nhuan, Dong tien, Cong no, Nhan cong) + CSV export voi BOM UTF-8.
- Light/Dark mode: ThemeProvider, localStorage persistence, system preference fallback, Sun/Moon toggle trong sidebar.

Chua co:

- Phase 4 Production Hardening.
- Phase 5 Desktop Packaging.
- Phase 6 Accounting Expansion.
- Playwright tests update sau Sprint UI-1 changes (label `Chỉ số tổng công ty` may drift).
- Pagination / search / filter tren cac trang list lon.
- Mobile form polish cho Documents upload (file picker UX tren iOS/Android).
- FinancePage: con dung local statusLabels thay vi src/lib/labels.ts — can migrate.

## Phase 0 - Foundation Lock

Muc tieu: khoa nen tang de sau nay khong phai dap UI/architecture.

### P0.1 Responsive App Shell

Deliverables:

- Desktop layout: left sidebar hoac top app shell cho dashboard nghiep vu.
- Mobile layout: bottom nav hoac compact top nav.
- Content container dung chung.
- Reusable primitives:
  - `AppShell`
  - `PageHeader`
  - `MetricCard`
  - `DataPanel`
  - `ResponsiveTable`
  - `StatusBadge`
  - `MobileDetailSheet`
- CSS tokens va breakpoints tap trung.
- Runtime-sensitive behavior dung `src/lib/runtime.ts`, khong check `window.__TAURI__` rai rac trong components.

Acceptance:

- 375px, 390px, 768px, 1366px, 1440px khong bi layout vo.
- Mobile khong co horizontal scroll vo y.
- Touch targets >= 44px.
- `npm run build` pass.

### P0.2 Viewport Regression Smoke Test

Deliverables:

- Them Playwright.
- Them script `test:ui`.
- Screenshot smoke test cho:
  - 375 x 667
  - 390 x 844
  - 768 x 1024
  - 1366 x 768
  - 1440 x 900
- Test toi thieu dashboard render, nav dung, khong co horizontal overflow.

Acceptance:

- `npm run build` pass.
- `npm run test:ui` pass.
- Screenshot output nam trong `test-results/` hoac Playwright report.

### P0.3 Route Map

Deliverables:

- Them router noi bo hoac state route don gian cho MVP.
- Routes/views:
  - Dashboard
  - Cong trinh
  - Tai chinh
  - Vat tu
  - Nhan su
  - Tai lieu
  - Cau hinh

Acceptance:

- Desktop va mobile deu chuyen view duoc.
- Active nav ro rang.
- Refresh web khong mat route neu dung URL route.

## Phase 1 - Supabase Internal MVP

Muc tieu: chuyen demo app thanh app dung du lieu that.

### P1.1 Supabase Project Setup

Deliverables:

- Huong dan tao Supabase project.
- Chay migration `supabase/migrations/0001_initial_schema.sql`.
- Tao bucket `project-documents`.
- Tao `.env.local` tu `.env.example` tren may local, khong commit.
- Neu user da cung cap Supabase URL va anon key, agent duoc tao `.env.local` local-only voi:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_APP_COMPANY_NAME=QT Sai Gon`
- Dam bao `.env.local` nam trong `.gitignore`.
- Seed data toi thieu cho QT Sai Gon.
- Tao owner profile dau tien voi `company_id` cua QT Sai Gon.

Acceptance:

- App detect Supabase configured.
- Khong co key bi commit.
- Khong in raw key trong log, screenshot, docs, hoac handoff.
- RLS bat tren bang nghiep vu va loc theo `company_id`.

### P1.2 Auth And Profiles

Deliverables:

- Login/logout UI.
- Session persistence.
- Profile current user.
- Moi profile phai co `company_id`; `facility_id` chua tao rieng trong MVP.
- Role display.
- Owner bootstrap instruction.

Acceptance:

- User dang nhap vao dashboard.
- User chua dang nhap thay login.
- Supabase anon key chi nam trong env.
- User chi thay du lieu cung `company_id`.

### P1.3 Core CRUD

Thu tu build:

1. Clients
2. Projects
3. Employees
4. Suppliers
5. Material items
6. Cost categories

Acceptance:

- List/create/edit basic records.
- Form validation co message ro.
- Mobile form khong tran man hinh.
- Data ghi vao Supabase.
- Supabase reads/writes dung TanStack Query hooks/mutations, khong fetch rai rac trong UI components.

## Phase 2 - Daily Operations MVP

Muc tieu: ghi nhan nghiep vu hang ngay cua cong ty xay dung.

### P2.1 Project Finance

Deliverables:

- Project cost entry.
- Payment in/out.
- Budget vs actual per project.
- Receivable/payable summary.
- Project margin estimate.
- Tat ca format tien te dung utility chung `src/utils/format.ts`.

Acceptance:

- Chu doanh nghiep xem lai lo tung cong trinh trong 30 giay.
- So tien format VND nhat quan qua `formatVnd` hoac `formatCompactVnd`, khong viet formatter rieng trong tung component.
- Trang thai khong chi dua vao mau, phai co text.

### P2.2 Materials Workflow

Deliverables:

- Material request.
- Approval status basic: draft, review, approved/rejected, ordered, delivered.
- Purchase order basic.
- Supplier link.

Acceptance:

- Chi huy cong truong tao de nghi tren mobile.
- Quan ly du an/ke toan thay danh sach viec can xu ly.
- Desktop co table scan duoc; mobile co card/list de thao tac.

### P2.3 HRM Lite

Deliverables:

- Employee list.
- Attendance by project/day.
- Overtime and allowance.
- Monthly payroll estimate.

Acceptance:

- Cham cong tren mobile nhanh.
- Khong dung table qua day cho mobile neu danh sach card tot hon.
- Payroll estimate tinh duoc tu attendance.

### P2.4 Documents

Deliverables:

- Upload document to Supabase Storage.
- Link document to project.
- Document type: contract, invoice, handover, photo, payment dossier, other.

Acceptance:

- Upload thanh cong.
- Document list theo project.
- Khong expose storage path nhay cam neu chua co policy chat.

## Phase 3 - Reporting And Export

Muc tieu: dung duoc cho chu doanh nghiep va ke toan noi bo.

Deliverables:

- Project profit/loss report.
- Cashflow summary.
- Receivables/payables report.
- Labor cost report.
- CSV export cho cac report chinh.

Acceptance:

- Bao cao doc duoc tren desktop.
- Mobile xem summary duoc, export co the de desktop uu tien.
- So lieu report khop voi costs/payments/attendance.

## Phase 4 - Production Hardening

Muc tieu: chuan bi dung that trong cong ty.

Deliverables:

- RLS theo `company_id` va role day du hon MVP.
- Audit log cho thao tac quan trong.
- Backup/export data.
- Error boundary va empty/loading states day du.
- Netlify production deploy guide.
- Supabase backup checklist.

Acceptance:

- Khong user nao doc duoc data ngoai company.
- Loi network/Supabase co recovery path.
- Build web deploy len Netlify pass.

## Phase 5 - Desktop Packaging

Muc tieu: dong goi Windows app dung chung frontend.

Deliverables:

- Tauri window config final.
- App icon.
- Installer Windows.
- Desktop first-launch instruction.
- Auto-update plan neu can.

Acceptance:

- `npm run desktop:build` pass tren may co Rust/Tauri prerequisites.
- Desktop app ket noi Supabase bang env/build config hop le.
- Min window size khong lam vo layout.

## Phase 6 - Accounting Expansion

Chi lam sau khi daily operations on dinh.

Deliverables:

- Chart of accounts noi bo.
- Journal entry UI.
- Mapping cost/payment sang journal entry.
- Invoice registry.
- Export cho phan mem ke toan chinh.

Khong lam:

- Full TT200/TT133 accounting engine trong giai doan nay.
- Tax filing automation neu chua co quy trinh ke toan that.

## Definition Of Done Cho Moi Phase

- Code build pass: `npm run build`.
- Neu phase co UI: pass viewport checklist trong `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`.
- Neu phase co Supabase: khong commit secrets, RLS khong tat.
- Neu phase co Supabase data fetching: dung TanStack Query va invalidate query sau mutation.
- Neu phase co tien te: dung `src/utils/format.ts`, khong duplicate VND formatting.
- Update `docs/AGENT_HANDOFF.md`.
- Update README neu lenh chay/deploy thay doi.
- Khong mo rong scope sang full ERP khi chua co approval moi.

## Roadmap Ke Tiep Ngay Bay Gio

Nen giao Claude thuc hien theo thu tu:

1. P0.1 Responsive App Shell.
2. P0.2 Playwright viewport smoke test.
3. P0.3 Route Map.
4. P1.1 Supabase setup docs + seed.
5. P1.2 Auth and profiles.

Ly do: neu lam CRUD ngay tren layout demo hien tai, sau do se mat cong sua mobile/desktop va navigation. Shell + viewport test phai di truoc.
