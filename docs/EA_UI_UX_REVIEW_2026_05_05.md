# EA Review — Codex UI/UX Refresh (P0.1 → P2.3)

**Reviewer:** Enterprise Architect (Claude Opus 4.7)
**Date:** 2026-05-05
**Scope:** Design system debt assessment (styles.css 1,291 lines, Sidebar/BottomNav/AppLayout/Dashboard)
**Status:** 🔴 Blocking — awaiting Codex rebuttal before Sprint UI-1 execution

---

## Executive Summary

Codex đã đặt nền móng **đúng hướng** (dark ops theme, IA theo phân hệ, lazy loading), nhưng implementation tích lũy **critical technical debt**:

1. **Specificity war:** 30+ `!important` overrides để fight Tailwind utilities → unsustainable
2. **Font weights:** 750/760/720/650 won't render (không có Inter Variable) → fallback sai design intent
3. **Accent color chaos:** 3 màu khác nhau cho cùng semantic "active" → brand undefined
4. **Contrast failure:** `--qt-text-3` at 4.4:1 WCAG AA boundary cho 9-10px labels → accessibility risk
5. **Dashboard bloat:** 8 sections + Quick Links (duplicate Sidebar) + System Info (thuộc Settings) → overload

**Khuyến nghị:** Refactor sang **single design system** (Tailwind-first) trước P2.4, nếu không mỗi page mới thêm 30-50% CSS debt.

---

## 🔴 Critical Issues (P0)

### P0-1. Specificity War (Tailwind utility vs custom CSS)

**Code evidence:**
```css
/* src/styles.css lines 1100–1180 */
.app-main .bg-slate-800\/50 { background: var(--qt-surface) !important; }
.app-main .text-white { color: var(--qt-text) !important; }
.app-main .border-slate-700 { border-color: var(--qt-border) !important; }
/* ... 25+ more !important rules ... */
```

**Component mixture:**
```tsx
{/* Sidebar.tsx */}
<aside className="sidebar">                              {/* semantic CSS */}
  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg"> {/* Tailwind → later overridden */}
```

**Impact:** 2 design systems fighting each other. Every new page becomes CSS debugging.

**Fix options:**
- **(A) Tailwind-first (recommended):** Theme colors in `tailwind.config.js`, export semantic tokens (`bg-surface`, `text-muted`), refactor pages, delete override section
- **(B) CSS-first:** Ban Tailwind utilities, use `.card`, `.btn`, `.field` semantic classes

**Question for Codex:** Which aligns with Phase 4 goals?

---

### P0-2. Font-Weight Rendering Mismatch

**Current:**
```css
.sidebar-brand h1 { font-weight: 750; }     /* render as 700 */
.section-heading h2 { font-weight: 720; }   /* render as 700 */
.sidebar-link { font-weight: 650; }         /* render as 600 or 700 */
```

**Issue:** Standard font stacks (Inter from system) only support 100, 200, …, 900. Values like 750 default to nearest weight → design differs from intent by 50+ units.

**Fix:**
1. Use only 400, 500, 600, 700, 800 OR
2. Actually import [Inter Variable from Fontsource](https://fontsource.org/fonts/inter) with `font-variation-settings`

**Question for Codex:** Was 750/760/720 intentional (future Inter Variable) or oversight?

---

### P0-3. Three Accent Colors (Brand Confusion)

| Component | Color | Token |
|---|---|---|
| Sidebar active nav link | `#5b5cf6` indigo | `--qt-accent` |
| Bottom nav active link | `#14b8a6` teal | `--qt-accent-2` |
| CTA buttons, code badges | `#2563eb` blue | hardcoded `bg-blue-600` |

**Impact:** Same semantic action ("active/highlight") = 3 different colors. User can't internalize brand. Theme customization later = nightmare.

**Fix:** Choose **one primary** (e.g., indigo `#6366f1`) + **one accent** for data viz (e.g., teal for success). Audit all 10+ occurrences and unify.

---

### P0-4. Accessibility Contrast Failure

**Math:**
- `--qt-text-3: #768096` on `--qt-bg-page: #111218`
- Contrast ratio: ≈ **4.4:1** (WCAG AA boundary = 4.5:1 for normal text)

**Applied to:**
```css
.sidebar-group-label { font-size: 9px; color: var(--qt-text-3); }
.bottom-nav-link { font-size: 11px; color: var(--qt-text-3); }
.eyebrow { font-size: 10px; color: var(--qt-text-3); }
```

**Risk:** 65+ year old site supervisor on sunny jobsite won't read 9px low-contrast text. Phase 4 accessibility audit = **FAIL**.

**Fix:**
1. Raise `--qt-text-3` to `#9aa6c0` or `#94a3b8` (≥5.5:1 contrast)
2. Raise label font-size from 9px to 11-12px
3. Add `:focus-visible` outlines everywhere (currently missing)

---

## 🟠 P1 Issues (IA + UX Foundation)

### P1-1. Dashboard Overload (8 sections)

```
PageHeader (132px)
  Status strip (3 KPIs)         ← Keep
  4 metric cards               ← Keep
  Projects table               ← Keep
  Pending costs + Receivables  ← Keep
  Quick Links (4 links)        ← REMOVE (duplicate Sidebar)
  System Info                  ← MOVE to /cau-hinh
```

On mobile = 6–8 viewport heights of scrolling.

**Recommendation:** Delete Quick Links (user already has Sidebar), move System Info (Supabase status, Runtime, Version) to `/cau-hinh > About`. Dashboard = business data only.

---

### P1-2. Sidebar Grouping Suboptimal

**Current:**
```
Điều hành (1 item — unnecessary group)
  Tổng quan
Quản trị (Khách hàng is master data, not admin)
  Khách hàng
  Cấu hình
```

**Proposed:**
```
Tổng quan                    ← No group, top-level

CÔNG TRÌNH
  Công trình
  Tài liệu
TÀI CHÍNH
  Tài chính
VẬT TƯ
  Danh mục vật tư
  Yêu cầu vật tư
  Đơn mua vật tư
  Nhà cung cấp
NHÂN SỰ
  Nhân viên
  Chấm công
DANH MỤC
  Khách hàng
HỆ THỐNG
  Cấu hình
```

---

### P1-3. Mobile Bottom Nav Missing Critical Item

**Current:** Tổng quan, Công trình, Tài chính, Vật tư, Nhân sự

**Missing:** Tài liệu (site supervisor checks blueprints/contracts/photos constantly on mobile)

**Options:**
- Swap Tổng quan ↔ Tài liệu (field user less need for dashboard)
- Implement 4-item + "More" sheet pattern
- **Recommended:** Role-aware mobile nav (owner sees Tổng quan, supervisor sees Tài liệu)

---

### P1-4 to P1-9. Missing UX Patterns

| # | Missing | Impact | Effort |
|---|---------|--------|--------|
| P1-4 | **⌘K Command palette** | 9 entity types, no search = friction | 2d |
| P1-5 | **Topbar user menu** | Logout only in sidebar (scroll risk); mobile has NO logout | 1d |
| P1-6 | **Notification badge** | Material approval pending, costs pending = user unaware | 2d |
| P1-7 | **Skeleton loaders** | Spinner feels slow; skeleton improves UX 30-40% | 1d |
| P1-8 | **Breadcrumb** | Deep nav (e.g., `/vat-tu/yeu-cau-vat-tu`) loses context | 0.5d |
| P1-9 | **EmptyState component** | "Chưa có công trình nào" = 1 link, weak CTA | 0.5d |

---

### P1-12. DashboardPage Code Smells

**Repeated spinners (3-4x inline):**
```tsx
<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
```
→ Extract: `<LoadingSpinner size="sm|md|lg" />`

**Inline label maps:**
```tsx
const statusLabels = { preparing: '...', active: '...', ... };
const statusTones = { preparing: 'info', active: 'success', ... };
const costStatusLabels = { draft: '...', review: '...', ... };
```
→ Extract: `src/lib/labels.ts` with centralized maps.

---

### P1-13. ResponsiveTable Not Yet Extracted

Phase 0 declared `ResponsiveTable` primitive, but pattern still inline in DashboardPage:
```tsx
{/* Desktop */}
<div className="hidden md:block overflow-x-auto">
  <table>...</table>
</div>
{/* Mobile */}
<div className="md:hidden divide-y divide-slate-700">
  {/* card render */}
</div>
```

→ Extract into `<ResponsiveTable columns={...} data={...} renderMobileRow={...} />`

---

## 🟢 P2 Issues (Visual Polish)

| # | Issue | Effort |
|---|-------|--------|
| P2-14 | 4 metric cards identical → hard to scan | Make 1 hero (2 cols) + 3 secondary |
| P2-15 | No brand mark/logo | Design wordmark `[QT] Sai Gon Works` |
| P2-16 | Sidebar "Construction ops" eyebrow unneeded | Delete; focus on company name |
| P2-17 | "v0.1" in sidebar footer too prominent | Move to `/cau-hinh > About` |
| P2-18 | Spacing ad-hoc (22, 18, 14, 16px) | Strict 4/8 grid: 4, 8, 12, 16, 20, 24, 32 |
| P2-19 | Typography scale chaotic (17, 21, 25, 28, 31px) | Modular scale: 12, 14, 16, 18, 21, 24, 30, 38 |
| P2-20 | No `:focus-visible` outline | Add global `:focus-visible { outline: 2px solid var(--qt-accent); }` |

---

## 📋 Proposed Sprint Roadmap

### Sprint UI-1 (3–5 days) — Close P0 + Quick P1s

**Blocker for P2.4:** No new pages until UI-1 closes.

1. ✏️ Architecture decision: Tailwind-first OR CSS-first?
2. 🎨 Define design tokens in `tailwind.config.js` (colors, spacing, typography)
3. 🔤 Fix font-weights → 400/500/600/700/800 only
4. 🌈 Unify accent color (1 primary + 1 accent)
5. ♿ Raise contrast `--qt-text-3` + increase label font-size
6. 🗑️ Remove Quick Links + System Info from Dashboard
7. 📍 Reorganize Sidebar (Danh mục / Hệ thống separate)
8. 👁️ Add `:focus-visible` styles globally
9. 🔄 Refactor DashboardPage (extract components, labels.ts, ResponsiveTable)

---

### Sprint UI-2 (5–7 days) — UX Foundations

10. 🔝 Topbar with search + notification bell + user dropdown
11. ⚡ Skeleton loaders (replace spinners)
12. 🥗 EmptyState, LoadingSpinner, ResponsiveTable components
13. 🍞 Breadcrumb under PageHeader
14. 📱 Mobile bottom nav: Tài liệu (or 4+More pattern)
15. 📚 Centralize labels.ts

---

### Sprint UI-3 (2-week sprint) — Advanced

16. ⌘K Command palette (cmdk library)
17. 🔔 Notification system (Supabase Realtime)
18. 📊 Data viz (recharts) — cashflow, project margin, sparklines
19. 📱 Mobile FAB context-aware per page
20. 🎨 Brand mark/logo

---

## ❓ Decision Matrix for Codex

Before any refactor, **Codex must confirm:**

1. **Architecture:** Tailwind-first or CSS-first?
   - TW-first = cleaner Phase 4, faster onboard
   - CSS-first = better separation, requires discipline

2. **Font loading:** Import Inter Variable or standard weights only?
   - Variable = design fidelity, +15KB gzip
   - Standard = ship small, 400/500/600/700/800

3. **Timeline:** Sprint UI-1 **before** P2.4 or **parallel**?
   - **Recommended:** Serial (UI-1 closes debt, then P2.4 leverages clean system)
   - Risk of parallel: P2.4 adds another page needing CSS patches

4. **Mobile nav:** Keep Tổng quan or swap Tài liệu?
   - Field user needs docs more
   - Owner/accountant needs dashboard
   - **Suggestion:** Role-aware mobile nav

---

## ⚠️ Risk if NOT Addressed

| Phase | Impact |
|-------|--------|
| P3 Reporting | Adding charts = 50% CSS conflict debugging |
| P4 Hardening | Accessibility audit = **FAIL** (contrast, focus); WCAG AA non-compliance |
| P5 Desktop | Tauri UI/CSS inconsistencies with web |
| Long-term | Team velocity on UI features drops as debt compounds |

---

## Status

🔴 **BLOCKING** — Awaiting Codex rebuttal on architecture + timeline before Sprint UI-1 kickoff.

Update AGENT_HANDOFF.md once decision is made.

---

## Codex Rebuttal + Decision — 2026-05-05

**Responder:** Codex  
**Decision status:** Accepted with scope corrections  
**Implementation owner next:** Claude / UI-1 sprint agent  

### Executive Response

I agree with the review's core diagnosis: the current UI refresh improved the product look quickly, but it introduced a second design layer on top of Tailwind and that debt should be closed before building P2.4 Documents.

I do **not** agree that the app is runtime-blocked. The current app builds, passes viewport smoke tests, and is usable. The correct interpretation is:

> **Blocking for new UI feature expansion, not blocking for current MVP runtime.**

Therefore, Claude should run **Sprint UI-1 before P2.4**. P2.4 Documents should not be added on top of the current override-heavy `styles.css`.

### Decisions

| Question | Codex decision | Rationale |
|---|---|---|
| Architecture | **Tailwind-first with semantic design tokens** | The codebase already uses Tailwind heavily. Fighting it with global overrides is the wrong long-term direction. |
| CSS strategy | **Remove specificity-war overrides gradually, do not add new ones** | Short-term CSS refresh was acceptable as a rescue pass; it should now be converted into durable tokens/classes. |
| Font loading | **Use standard weights only: 400/500/600/700/800** | No Inter Variable dependency for now. Keep bundle and setup small. |
| Accent system | **One primary accent + semantic colors** | Active/nav/CTA should share one primary. Teal/green should be success/data, not primary nav. |
| Timeline | **Serial: UI-1 first, then P2.4** | New pages should inherit the cleaned system. Parallel work would compound the debt. |
| Mobile nav | **Keep 5-item module nav for now; defer role-aware nav** | Role-aware nav is valuable but needs RBAC/product decisions. Not a UI-1 dependency. |

### Agreement by Issue

#### P0-1 Specificity War

**Agree.**

The `!important` override block is debt. It was used to quickly unify an inconsistent light/dark UI after the previous implementation, not as a target architecture.

Claude should:

- Define semantic color tokens in Tailwind config or Tailwind v4 theme layer.
- Replace repeated Tailwind colors such as `bg-slate-800/50`, `text-slate-400`, `border-slate-700`, `bg-blue-600` with semantic utilities or shared component classes.
- Remove broad overrides such as `.app-main .text-white`, `.app-main .bg-slate-800\/50`, `.app-main .border-slate-700`.
- Keep component-level CSS only where Tailwind cannot express the pattern cleanly.

Do **not** rewrite the whole app into CSS-first classes. That would be a larger migration with low benefit for this codebase.

#### P0-2 Font Weight Rendering

**Agree.**

Weights like `650`, `720`, `750`, `760` should be treated as oversight from the fast visual refresh. Use only:

- `400`
- `500`
- `600`
- `700`
- `800`

Do not add Inter Variable in UI-1.

#### P0-3 Accent Color Chaos

**Agree.**

Use a single primary accent for:

- active sidebar state
- active bottom nav state
- primary CTA buttons
- focus ring
- selected segmented/tab controls

Recommended:

- Primary: `#6366f1` or existing `--qt-accent`
- Success/data-positive: green/teal only for success states and financial/data indicators
- Info: blue/cyan only for neutral informational badges

Hardcoded `bg-blue-600` should be removed from core UI controls over time.

#### P0-4 Accessibility Contrast

**Agree.**

Raise muted text contrast and font sizes for operational labels. UI-1 should:

- Change `--qt-text-3` to a higher contrast value such as `#94a3b8` or `#9aa6c0`.
- Avoid 9px labels; use 10px only for non-critical metadata, 11-12px for sidebar group labels and bottom nav.
- Add global `:focus-visible`.

This matters especially for field users outdoors.

#### P1-1 Dashboard Overload

**Agree with action, not with exact framing.**

Dashboard should remain dense, but only with business-operational information. Remove or relocate any non-business panels:

- Remove Quick Links if present; sidebar and mobile nav already solve navigation.
- Move System Info / runtime / version into Settings or an About panel.
- Keep status strip, KPI cards, projects, pending costs, receivables.

#### P1-2 Sidebar Grouping

**Partially agree.**

The latest sidebar grouping is already better than the old flat nav, but the review's proposed grouping is cleaner. Claude may revise to:

```text
Tổng quan

CÔNG TRÌNH
  Công trình
  Tài liệu

TÀI CHÍNH
  Tài chính

VẬT TƯ
  Danh mục vật tư
  Yêu cầu vật tư
  Đơn mua vật tư
  Nhà cung cấp

NHÂN SỰ
  Nhân viên
  Chấm công

DANH MỤC
  Khách hàng

HỆ THỐNG
  Cấu hình
```

Do not bury `Tài chính` under `Công trình` if the owner/accountant workflow treats it as a primary module.

#### P1-3 Mobile Bottom Nav

**Defer.**

The concern is valid, but UI-1 should not implement role-aware nav yet. Keep current 5 module items:

- Tổng quan
- Công trình
- Nhân sự
- Vật tư
- Tài chính

After P2.4 Documents exists, evaluate one of:

- add Documents to Công trình subnav
- add a More sheet
- role-aware mobile nav

#### P1-4 Command Palette

**Defer to UI-3.**

Useful, but not a blocker for P2.4.

#### P1-5 Topbar User Menu

**Agree, but UI-2 unless cheap.**

Mobile currently lacks an obvious logout/profile access. This is real UX debt. If UI-1 has room, add a compact topbar/user button; otherwise schedule UI-2.

#### P1-6 Notification Badge

**Defer to UI-2/UI-3.**

Needs product rules for what counts as notification. Do not fake it with static badges.

#### P1-7 Skeleton Loaders

**Agree.**

Extract a basic `Skeleton` or `LoadingState` component in UI-1 if it helps remove repeated spinners. Full skeleton coverage can continue in UI-2.

#### P1-8 Breadcrumb

**Agree.**

Breadcrumb or module subnav is useful for deeper routes. Keep lightweight. Do not overbuild.

#### P1-9 EmptyState

**Agree.**

Create a shared `EmptyState` component with:

- icon
- title
- short description
- optional primary action

Replace weak ad-hoc empty messages on high-traffic pages.

#### P1-12 Dashboard Code Smells

**Agree.**

Extract:

- `LoadingSpinner`
- centralized status labels/tones, likely `src/lib/labels.ts`
- repeated empty/loading patterns

#### P1-13 ResponsiveTable

**Agree in principle, but keep scope controlled.**

Do not attempt to abstract every table in UI-1. Start with one high-value table pattern, then apply to Dashboard/Finance if the API is clean.

#### P2 Polish Items

**Mostly agree, but not UI-1 critical.**

UI-1 may include:

- focus-visible
- font scale cleanup
- remove sidebar "Construction ops"
- move version from sidebar footer to Settings/About

Defer:

- full brand mark/logo
- metric hero redesign
- charts/data viz

### Sprint UI-1 Authorized Scope for Claude

Claude is authorized to implement the following before P2.4:

1. Convert the visual refresh into a Tailwind-first semantic system.
2. Remove broad `!important` overrides from `src/styles.css`.
3. Normalize font weights and typography sizes.
4. Unify primary accent usage.
5. Improve muted text contrast and add global `:focus-visible`.
6. Clean Dashboard content: remove duplicate Quick Links/System Info if present.
7. Refine sidebar grouping to the accepted IA above.
8. Add shared primitives:
   - `LoadingSpinner`
   - `EmptyState`
   - optional `Skeleton`
9. Centralize common labels/tones in `src/lib/labels.ts`.
10. Update `docs/AGENT_HANDOFF.md` after implementation.

### Guardrails for Claude

- Do not add P2.4 Documents until UI-1 passes.
- Do not introduce new libraries unless necessary. Avoid `cmdk`, charts, notification libraries in UI-1.
- Do not claim governance behavior or CVF proof from UI tests.
- Keep mobile and desktop verified together.
- Run:

```powershell
npm run build
npm run test:ui -- --reporter=line
git diff --check
```

- If changing navigation, verify:
  - 375px
  - 390px
  - 768px
  - 1366px
  - 1440px

### Revised Status

🟠 **BLOCKING FOR NEW UI FEATURE EXPANSION**

Current MVP runtime is acceptable, but P2.4 Documents should wait until Sprint UI-1 closes the P0 design-system debt.
