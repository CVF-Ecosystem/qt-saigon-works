# QT Sai Gon Works - Agent Handoff

Cap nhat: 2026-05-05 (Phase 0 CLOSED, Phase 1 IN_PROGRESS)

## Phase 0 Closure — 2026-05-05

**Closed by:** Kiro (Claude Sonnet 4.5)
**Risk:** R1
**Status:** CLOSED

Phase 0 artifacts committed in `ac35f75`. Foundation locked:
- Responsive app shell with desktop sidebar + mobile bottom nav
- Reusable UI primitives (PageHeader, MetricCard, DataPanel, ResponsiveTable, StatusBadge, MobileDetailSheet)
- Playwright viewport tests: 25/25 PASSING across 5 breakpoints
- `npm run build` PASS
- No horizontal overflow, touch targets ≥44px verified

Phase 0 meets all acceptance criteria from `docs/ROADMAP.md`. Ready for P1.1 Supabase setup.

## Codex review pass — Phase 0 quality check

**Thuc hien boi:** Codex, 2026-05-04
**Risk:** R1
**Scope:** Kiem tra chat luong phan Claude da lam va tiep tuc Phase 0. Khong dung provider API, khong assert CVF governance behavior; Playwright chi la UI structure/viewport check.

### Ket luan chat luong phan Claude

- Di dung huong: da co React Router routes, desktop/mobile nav, Tailwind/PostCSS dependency, Playwright file va script `test:ui`.
- Chua closure-clean luc dau: `npm run test:ui` fail vi mobile projects dung WebKit chua cai browser va test spacing sai ky vong voi shell layout.
- Loi UI that: breakpoint utility `md:*` khong che/hien nav dung trong runtime, lam desktop sidebar va mobile bottom nav cung visible.
- Dashboard con thieu reusable primitive dung roadmap P0.1; `MetricCard` va `DataPanel` dang nam cuc bo trong page.
- Dashboard hero ban dau hoi nghieng ve marketing, chua dung chat operational app shell trong `DESIGN.md`.

### Da lam tiep

- Tao reusable primitives:
  - `src/components/ui/PageHeader.tsx`
  - `src/components/ui/MetricCard.tsx`
  - `src/components/ui/DataPanel.tsx`
  - `src/components/ui/ResponsiveTable.tsx`
  - `src/components/ui/StatusBadge.tsx`
  - `src/components/ui/MobileDetailSheet.tsx`
- Refactor `src/pages/DashboardPage.tsx` dung primitives, copy tieng Viet co dau, operational header, KPI strip, responsive table containment.
- Khoa app shell/nav bang CSS project-owned trong `src/styles.css` thay vi phu thuoc breakpoint utility cho behavior quan trong.
- Cap nhat `playwright.config.ts` de 5 viewport dung Chromium co san, tranh fail do WebKit chua install.
- Sua `tests/viewport-smoke.spec.ts` de kiem dung:
  - dashboard render
  - desktop sidebar/mobile bottom nav dung viewport
  - touch target >= 44px
  - khong horizontal overflow ngoai y
  - route navigation render dung heading
  - screenshot smoke output trong `test-results/screenshots/`

### Verification

Da chay:

```powershell
npm run build
npm run test:ui -- --reporter=line
```

Ket qua:

- `npm run build` PASS.
- `npm run test:ui -- --reporter=line` PASS: 25/25.
- Da kiem tra screenshot 390x844 va 1440x900 bang mat; nav hien dung theo viewport, khong thay horizontal overflow.

### Active risks / notes

- Tailwind van duoc cai, nhung behavior responsive quan trong cua shell/nav nen tiep tuc duoc bao ve bang CSS rieng cho toi khi xac minh ro Tailwind v4 setup.
- Phase 0 chua duoc tuyen bo CLOSED theo governance vi chua commit artifacts.
- P1 Supabase/Auth/CRUD chua bat dau; khong nen lam CRUD truoc khi review va commit Phase 0.

### Next governed move

Phase 0 CLOSED. Proceeding to P1.1 Supabase setup.

## Tranche P1.1 — Supabase Project Setup (IN_PROGRESS)

**Thuc hien boi:** Kiro (Claude Sonnet 4.5), 2026-05-05
**Risk:** R2 (external service, credentials, RLS policy)

### Scope

Per `docs/ROADMAP.md` P1.1:
- Huong dan tao Supabase project
- Chay migration `supabase/migrations/0001_initial_schema.sql`
- Tao bucket `project-documents`
- Tao `.env.local` tu `.env.example` (local-only, khong commit)
- Seed data toi thieu cho QT Sai Gon
- Tao owner profile dau tien voi `company_id`
- Dam bao RLS bat tren bang nghiep vu va loc theo `company_id`

### Da lam

- ✅ Tao `docs/SUPABASE_SETUP.md` - huong dan day du 10 buoc setup Supabase
- ✅ Tao `supabase/seed.sql` - seed data mau cho clients, projects, employees, suppliers, materials, costs, payments, attendance, material requests
- ✅ Verify `.env.example` co day du 3 bien can thiet
- ✅ Verify `.gitignore` da chua `.env.local` de tranh commit secrets
- ✅ Verify `src/lib/supabase.ts` da co `isSupabaseConfigured` check
- ✅ Review migration `0001_initial_schema.sql`:
  - RLS enabled tren tat ca 19 bang nghiep vu
  - Helper functions `current_company_id()` va `current_app_role()`
  - Policies loc theo `company_id` cho bang co `company_id` truc tiep
  - Policies loc qua `projects` cho bang con (phases, boq_items, costs, material_requests, etc.)
  - Policies loc qua `purchase_orders` cho `purchase_order_items`
  - Policies loc qua `journal_entries` cho `journal_lines`
  - Seed QT Sai Gon company (`00000000-0000-0000-0000-000000000001`)
  - Seed 5 cost categories mac dinh
- ✅ User cung cap Supabase credentials
- ✅ Tao `.env.local` voi credentials (local-only, da verify khong bi track boi git)
- ✅ Verify build pass voi Supabase configured
- ✅ User chay migration thanh cong
- ✅ User bat Email Auth provider
- ✅ User tao bucket `project-documents` va 3 storage policies (SELECT, INSERT, DELETE)
- ✅ User tao owner user (UID: `61627271-7cf7-4abf-a9b8-941d1709adbc`)
- ✅ User tao profile owner trong bang `profiles`
- ✅ User chay seed data thanh cong (3 clients, 3 projects, 6 employees, 3 suppliers, 8 materials, sample costs/payments/attendance)

### Chua lam

- Chua test login voi user owner
- Chua build Auth UI (P1.2)
- Chua build CRUD UI (P1.3)

### Active risks

- Supabase credentials phai duoc bao ve: khong commit, khong in raw key trong log/docs
- RLS phai bat ngay tu dau tren cac bang nghiep vu
- `.env.local` phai nam trong `.gitignore`

### Next governed move

**P1.1 COMPLETE!** Supabase setup xong.

Tiep theo: **P1.2 Auth UI** - Tao login/logout interface.

Agent se build:
1. Login form (email/password)
2. Logout button
3. Session persistence
4. Profile display
5. Protected routes (redirect neu chua login)
6. Auth context/hooks

Risk: R1 (UI only, khong thay doi backend)

## Tranche P0.1 — Responsive App Shell (CLOSED)

**Thuc hien boi:** Claude Sonnet 4.6, 2026-05-04
**Risk:** R1

### Da lam

- Cai Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`).
- Cai `react-router-dom` va `lucide-react`.
- Tao `postcss.config.js` va `tailwind.config.js` (v4, auto-detect content).
- Them `@import "tailwindcss"` vao dau `src/styles.css`.
- Tao `src/components/layout/Sidebar.tsx` — desktop left sidebar, hidden duoi md (768px).
- Tao `src/components/layout/BottomNav.tsx` — mobile bottom nav, 5 muc chinh, min-h-[56px].
- Tao `src/components/layout/AppLayout.tsx` — wrapper dung Outlet tu react-router-dom.
- Tao `src/pages/DashboardPage.tsx` — chuyen noi dung cu tu App.tsx.
- Tao `src/pages/PlaceholderPage.tsx` — stub cho cac route chua build.
- Viet lai `src/App.tsx` — BrowserRouter + 7 routes (/, /cong-trinh, /tai-chinh, /vat-tu, /nhan-su, /tai-lieu, /cau-hinh).
- `npm run build` PASS.

### Chua lam / Can verify

- Kiem tra viewport thu cong: 375px, 390px, 768px, 1366px, 1440px.
- Playwright screenshot smoke test (P0.2).
- Cac route stub chua co noi dung that (P0.3 se dien day).
- Mobile horizontal scroll chua co bai test tu dong.

### Active risks

- Tailwind v4 thay doi CSS reset (Preflight) co the anh huong den custom CSS cu trong styles.css — can kiem tra visual tren dev server.
- BrowserRouter co the gap van de deep link trong Tauri (Phase 5) — se giai quyet khi packaging desktop.

### Next governed move

- P0.2: Them Playwright viewport smoke test.
- P0.3: Dien noi dung cho cac route stub.

## Trang thai ban dau (bootstrap)

Project da duoc tao trong workspace:

`D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\qt-saigon-works`

CVF core da dong bo voi GitHub `origin/main`:

`dc841d333e27c54362fc8825f2b9cb0fdc4bb031`

CVF doctor gan nhat: `PASS 13/13`.

## San pham

Ten ung dung: QT Sai Gon Works.

Muc tieu: ung dung quan ly thi cong nho gon cho cong ty xay dung QT Sai Gon, dung truoc cac module:

- Cong trinh/project management.
- Chi phi, thu chi, cong no, accounting-lite.
- Vat tu va mua hang.
- Nhan su cong truong, cham cong, payroll-lite.
- Tai lieu cong trinh.

Khong dua full ERP vao MVP.

## Stack hien tai

- Frontend: React + Vite + TypeScript.
- Server-state/cache: TanStack Query.
- Web deploy target: Netlify.
- Backend target: Supabase.
- Desktop target: Tauri.
- Demo data hien nam trong `src/data.ts`.
- Supabase schema MVP nam trong `supabase/migrations/0001_initial_schema.sql`.
- Money formatting utility nam trong `src/utils/format.ts`; khong viet formatter VND rieng trong component.
- Runtime helper nam trong `src/lib/runtime.ts`; khong rai `window.__TAURI__` check trong component.
- Query client nam trong `src/lib/queryClient.ts`.

## File quan trong

- Product spec: `docs/PRODUCT_SPEC.md`
- Architecture: `docs/ARCHITECTURE.md`
- Roadmap: `docs/ROADMAP.md`
- UI/mobile/desktop standards: `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`
- App shell: `src/App.tsx`
- Styles: `src/styles.css`
- Supabase client: `src/lib/supabase.ts`
- Query client: `src/lib/queryClient.ts`
- Runtime helper: `src/lib/runtime.ts`
- Tauri config: `src-tauri/tauri.conf.json`
- Netlify config: `netlify.toml`

## UI/UX rule cho agent sau

Truoc khi tao hoac sua UI, agent phai doc:

1. CVF root design contract:
   `D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\.Controlled-Vibe-Framework-CVF\DESIGN.md`
2. Project UI standards:
   `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`
3. Product spec:
   `docs/PRODUCT_SPEC.md`

Mobile/desktop phai duoc thiet ke cung luc. Khong duoc build desktop truoc roi xem mobile la viec sua sau.

## Skill/reference da kiem tra

CVF active:

- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/product_ux/03_ux_heuristic_evaluation.skill.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/product_ux/04_accessibility_audit.skill.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/product_ux/cvf_web_ux_redesign_system.skill.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/product_ux/claude_design_handoff.skill.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/web_development/06_accessibility_audit.skill.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/app_development/06_desktop_app_spec.skill.md`

CVF archived/reference nhung huu ich:

- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/app_development/legacy/ui_ux_superseded_2026_04/frontend_responsive_design_standards.skill.legacy.md`
- `EXTENSIONS/CVF_v1.5.2_SKILL_LIBRARY_FOR_END_USERS/app_development/legacy/superseded_2026_04/ui_pre_delivery_checklist.skill.legacy.md`

Nguon tham khao tu project Nha tre Maika:

- `D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\Nha tre Maika\.claude\commands\mobile-audit.md`

## Verification gan nhat

Da chay:

```powershell
npm install
npm run build
```

Ket qua: build pass.

Dev server da tung chay tai:

`http://127.0.0.1:5179`

Lenh chay lai:

```powershell
cd "D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\qt-saigon-works"
npm run dev
```

## Viec chua lam

- Chua ket noi Supabase project that.
- Chua co auth UI.
- Chua co CRUD that cho cong trinh/chi phi/vat tu/nhan su.
- Chua co Playwright screenshot regression cho mobile/desktop.
- Chua dong goi desktop installer.
- Chua tao Git repo rieng cho app.
- Chua tao `.env.local`; khi co Supabase URL/anon key thi tao local-only va khong commit.
- Chua co Supabase query hooks; khi build CRUD, dung TanStack Query.

## Next governed move

De tiep tuc dung cach it phai dap di lam lai:

1. Thuc hien `docs/ROADMAP.md` Phase 0 truoc.
2. P0.1: Lap UI shell responsive chuan: navigation desktop, mobile bottom/tab nav, content container, table/card patterns.
3. P0.2: Them Playwright viewport screenshot smoke test cho 375, 390, 768, 1366, 1440.
4. P0.3: Tao route map/view structure cho Dashboard, Cong trinh, Tai chinh, Vat tu, Nhan su, Tai lieu, Cau hinh.
5. Sau khi Phase 0 pass moi build Supabase Auth/CRUD.
6. Khi them module moi, bat buoc gan module voi `projects` neu la nghiep vu cong trinh.

## Claude handoff instruction

Neu ban giao cho Claude, dua cac file sau lam context dau vao:

1. `AGENTS.md`
2. `docs/AGENT_HANDOFF.md`
3. `docs/ROADMAP.md`
4. `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`
5. `docs/PRODUCT_SPEC.md`
6. `docs/ARCHITECTURE.md`

Prompt nen giao ro:

```text
Implement Phase 0 only from docs/ROADMAP.md for QT Sai Gon Works.
Do not start Supabase CRUD yet.
Build a responsive app shell and route/view structure that works on mobile and desktop from the first pass.
Follow docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md.
Use src/utils/format.ts for all VND display; do not duplicate money formatters.
Use src/lib/runtime.ts for web/desktop branching; do not scatter window.__TAURI__ checks.
Use TanStack Query for Supabase server state once data fetching begins.
Add Playwright viewport smoke tests if dependencies can be installed.
Run npm run build and report remaining risks.
```

## Risk notes

- UI mock/demo data duoc phep cho layout.
- RLS boundary la `company_id`; khong quay lai policy `using (true)` cho du lieu nghiep vu.
- Moi claim ve CVF governance behavior van phai dung live evidence theo AGENTS.md.
- Khong commit Supabase service role key hoac `.env.local`.
