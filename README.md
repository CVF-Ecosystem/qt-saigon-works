# QT Sai Gon Works

Ung dung quan ly thi cong nho gon cho QT Sai Gon.

Muc tieu cua ban dau tien la thay the viec theo doi bang Excel roi mo rong dan thanh he thong quan tri noi bo:

- Quan ly cong trinh, hop dong, tien do va ho so.
- Theo doi du toan, chi phi thuc te, tam ung, thanh toan va lai lo theo cong trinh.
- Quan ly vat tu, de nghi mua hang va nha cung cap.
- Quan ly nhan su cong truong, cham cong va bang luong co ban.
- Ke toan nhe cho thu chi, cong no va but toan noi bo.

## Kien truc

- Web frontend: React + Vite, deploy len Netlify.
- Backend: Supabase Auth, Postgres, Storage va RLS.
- Desktop: Tauri dung chung web frontend, dong goi thanh app Windows khi can.

## UI/UX mobile va desktop

Moi UI moi phai doc va tuan thu:

- `docs/UI_UX_MOBILE_DESKTOP_STANDARDS.md`
- `docs/AGENT_HANDOFF.md`

Nguyen tac mac dinh: mobile va desktop duoc thiet ke cung luc, khong build desktop truoc roi sua mobile sau.

## Lenh chay

```powershell
npm install
npm run dev
```

Mo `http://127.0.0.1:5179`.

Build web:

```powershell
npm run build
```

Desktop development:

```powershell
npm run desktop:dev
```

Desktop build can Rust toolchain va Tauri prerequisites:

```powershell
npm run desktop:build
```

## Supabase Setup

**Chi tiet day du:** Xem `docs/SUPABASE_SETUP.md` (huong dan 10 buoc).

**Tom tat nhanh:**

1. Tao project Supabase tai https://supabase.com
2. Lay Project URL va anon key tu Settings > API
3. Copy `.env.example` thanh `.env.local` va dien credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_APP_COMPANY_NAME=QT Sai Gon
   ```
4. Chay migration trong Supabase SQL Editor:
   - Copy noi dung `supabase/migrations/0001_initial_schema.sql`
   - Paste vao SQL Editor va Run
5. Bat Auth Email provider (Settings > Authentication > Providers)
6. Tao bucket Storage: `project-documents` (xem huong dan storage policies trong `docs/SUPABASE_SETUP.md`)
7. Tao user owner dau tien (Authentication > Users > Add user)
8. Tao profile owner trong bang `profiles` (xem huong dan trong `docs/SUPABASE_SETUP.md`)
9. (Tuy chon) Chay seed data: `supabase/seed.sql` de co data mau

**Luu y bao mat:**
- `.env.local` da nam trong `.gitignore` - KHONG commit file nay
- Chi dung anon key cho frontend, KHONG dung service_role key
- RLS da duoc bat tren tat ca cac bang nghiep vu

Trong MVP, giao dien van co demo data de xem workflow ngay ca khi chua noi Supabase.
