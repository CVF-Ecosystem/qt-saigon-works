# QT Sai Gon Works - Agent Handoff

Cap nhat: 2026-05-04

## Trang thai hien tai

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
