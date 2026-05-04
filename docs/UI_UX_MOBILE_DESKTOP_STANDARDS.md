# QT Sai Gon Works - UI/UX Mobile/Desktop Standards

Ngay tao: 2026-05-04

## Muc tieu

Moi man hinh cua QT Sai Gon Works phai duoc thiet ke cho mobile va desktop ngay tu dau. Khong chap nhan cach lam "desktop truoc, mobile tinh sau" vi ung dung co nhom nguoi dung ngoai cong truong.

## Nguon chuan

1. CVF canonical design system:
   `D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\.Controlled-Vibe-Framework-CVF\DESIGN.md`
2. CVF active Product UX skills:
   - `product_ux/01_user_persona_development.skill.md`
   - `product_ux/02_user_flow_analysis.skill.md`
   - `product_ux/03_ux_heuristic_evaluation.skill.md`
   - `product_ux/04_accessibility_audit.skill.md`
   - `product_ux/05_onboarding_experience_review.skill.md`
   - `product_ux/06_ux_writing.skill.md`
   - `product_ux/cvf_web_ux_redesign_system.skill.md`
   - `product_ux/claude_design_handoff.skill.md`
3. CVF delivery/check reference:
   - `app_development/legacy/superseded_2026_04/ui_pre_delivery_checklist.skill.legacy.md`
   - `web_development/06_accessibility_audit.skill.md`
4. Responsive reference archived in CVF:
   - `app_development/legacy/ui_ux_superseded_2026_04/frontend_responsive_design_standards.skill.legacy.md`
5. Project reference from Nha tre Maika:
   - `D:\UNG DUNG AI\TOOL AI 2026\CVF-Workspace\Nha tre Maika\.claude\commands\mobile-audit.md`

## Man hinh muc tieu

Phai test toi thieu cac viewport:

| Nhom | Viewport | Muc dich |
| --- | --- | --- |
| Small phone | 375 x 667 | iPhone SE, thiet bi cong truong nho |
| Modern phone | 390 x 844 | Android/iPhone pho bien |
| Tablet | 768 x 1024 | iPad/tablet cong truong |
| Laptop | 1366 x 768 | van phong pho bien |
| Desktop | 1440 x 900 | man hinh quan ly |

## Nguyen tac layout

- Mobile la single-column mac dinh.
- Desktop duoc phep dense hon, nhung khong lam mobile bi gay.
- Khong de horizontal scroll tren mobile, tru truong hop table duoc boc trong vung scroll ro rang.
- Touch target toi thieu 44px x 44px.
- Khong dat width cung ma khong co `minmax`, `max-width`, `overflow-x`, hoac breakpoint collapse.
- Form, filter bar, action bar phai wrap/stack o mobile.
- Modal phai co `width: min(..., calc(100vw - 24px))`, `max-height: 90vh`, `overflow-y: auto`.
- Layout master-detail tren desktop phai thanh list/detail tren mobile, co nut quay lai.
- Fixed bottom/FAB phai ton trong safe area va khong che nut/phieu o cuoi trang.

## Pattern bat buoc

### Filter/action bar

Desktop co the dung row. Mobile phai stack:

```css
.mobile-stack {
  display: flex;
  gap: 12px;
}

@media (max-width: 900px) {
  .mobile-stack {
    align-items: stretch;
    flex-direction: column;
  }
}
```

### Table nhieu cot

Neu table nhieu hon 4 cot, mobile phai co scroll container:

```css
.mobile-scroll-table {
  overflow-x: auto;
  overflow-y: hidden;
}

.mobile-scroll-table table {
  min-width: 760px;
}
```

Khong dung `overflow: hidden` tren wrapper table vi co the chan scroll ngang.

### Grid card

Dung grid co collapse tu nhien:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
```

### Modal

```tsx
style={{
  width: "min(720px, calc(100vw - 24px))",
  maxHeight: "90vh",
  overflowY: "auto"
}}
```

## Module-specific UX

### Dashboard

- Mobile: KPI quan trong truoc, sau do danh sach viec can xu ly.
- Desktop: KPI + bang cong trinh + canh bao tai chinh.
- Khong tao hero marketing trong app van hanh.

### Cong trinh

- Desktop: list + detail hoac table + side panel.
- Mobile: list cong trinh truoc; bam vao cong trinh moi vao detail.
- Tien do, cong no, chi phi phai nhin duoc trong 1 man hinh dau.

### Tai chinh/Accounting lite

- So tien phai can phai va dung font/format de scan.
- Mobile table phai chuyen thanh cards hoac scroll table co containment.
- Trang thai thanh toan khong chi dua vao mau; phai co text label.

### Vat tu

- De nghi vat tu tren mobile phai thao tac nhanh: ten vat tu, so luong, cong trinh, ngay can.
- Nut tao moi, duyet, tu choi phai du 44px.

### HRM/cham cong

- Mobile la luong chinh cho chi huy cong truong.
- Cham cong phai toi uu cho nhap lap lai: chon ngay, chon cong trinh, danh dau nhan su.
- Khong dung bang qua day neu co the dung danh sach nhan su theo card.

## Gate truoc khi bao hoan thanh UI

Moi thay doi UI lon phai kiem tra:

- `npm run build` pass.
- 375px: khong co horizontal scroll vo y.
- 390px: filter/action bar khong tran ngang.
- 768px: layout tablet khong bi khoang trong vo ly.
- 1366px/1440px: desktop scan duoc bang, KPI, action.
- Button/action chinh >= 44px tren mobile.
- Modal khong vuot man hinh doc.
- Text khong bi cat, de len nhau, hoac che control.
- Focus keyboard nhin thay.
- Mau trang thai co text kem theo.

Voi thay doi UI co rui ro cao, agent nen dung Playwright screenshot/canvas evidence cho cac viewport tren truoc khi ket luan.
