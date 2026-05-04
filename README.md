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

## Supabase

1. Tao project Supabase.
2. Copy `.env.example` thanh `.env.local`.
3. Dien `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY`.
4. Chay migration trong `supabase/migrations/0001_initial_schema.sql`.

Trong MVP, giao dien van co demo data de xem workflow ngay ca khi chua noi Supabase.
