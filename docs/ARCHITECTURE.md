# Architecture

## Tong quan

QT Sai Gon Works dung kien truc mot frontend chung cho web va desktop:

- React SPA: giao dien nghiep vu.
- Netlify: hosting frontend, CDN, redirect SPA.
- Supabase: Auth, Postgres, Storage, RLS.
- Tauri: dong goi desktop Windows tu cung code frontend.
- TanStack Query: data cache, loading/error state, refetch va offline-friendly behavior cho Supabase queries.

## Ly do chon cach nay

- Chi phi van hanh thap.
- Khong can quan ly server rieng luc dau.
- De phat trien nhanh va demo noi bo.
- Desktop khong tach logic rieng, tranh tao hai san pham khac nhau.
- Sau nay co the them Edge Functions khi can tac vu backend co logic rieng.

## Cau truc thu muc

```text
qt-saigon-works/
  docs/                     Spec, kien truc, roadmap
  src/                      React app
  src/lib/queryClient.ts    TanStack Query client
  src/lib/runtime.ts        Web/Desktop runtime helper
  src/lib/supabase.ts       Supabase client
  supabase/migrations/      Database schema
  src-tauri/                Desktop wrapper
  netlify.toml              Netlify build config
```

## Deployment

### Web

1. Push repo len Git.
2. Netlify build command: `npm run build`.
3. Publish directory: `dist`.
4. Set env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_COMPANY_NAME`

### Supabase

1. Tao project Supabase.
2. Chay migration `supabase/migrations/0001_initial_schema.sql`.
3. Bat Auth email/password.
4. Tao user dau tien.
5. Insert profile role `owner`.
6. Tao bucket Storage: `project-documents`.

### Desktop

1. Cai Rust va Tauri prerequisites.
2. Chay `npm run desktop:build`.
3. File cai dat nam trong `src-tauri/target/release/bundle`.

### Web/Desktop Runtime

Frontend dung chung code cho web va desktop. Khi can hanh vi khac nhau, code phai kiem tra runtime qua `src/lib/runtime.ts` thay vi rai logic `window.__TAURI__` trong tung component.

Use cases:

- Mo link/tai lieu: web co the dung browser tab, desktop co the dung Tauri opener/file dialog.
- Download/export file: desktop co the them save dialog sau nay.
- First-launch UX: desktop co the hien note ve Windows app, web hien note Netlify/browser.

Bien moi truong `VITE_*` duoc dong goi luc build. Khong dua secret vao frontend; chi dung Supabase anon key.

## State va Data Fetching

Dung TanStack Query lam lop state server-cache mac dinh:

- Supabase reads/writes di qua query/mutation hooks.
- Loading, empty, error state phai duoc render ro.
- Sau mutation, invalidate query lien quan.
- Khong fetch truc tiep trong component lon neu co the tach thanh hook.
- Local UI state nho co the dung React state; server data dung TanStack Query.

## Bao mat

- Frontend chi dung Supabase anon key.
- RLS bat tren cac bang nghiep vu.
- Khong commit service role key.
- Tai lieu luu Storage theo company/project.
- Schema MVP da co `company_id` tren cac bang chinh va `profiles.company_id` bat buoc.
- RLS phai loc theo `company_id` ngay tu dau. Cac bang con khong co `company_id` truc tiep phai di qua `projects`, `purchase_orders`, hoac `journal_entries`.
- `facility_id` khong dung rieng luc nay; `company_id` la boundary chinh. Neu sau nay QT Sai Gon co nhieu chi nhanh/cong ty con, them `facilities` sau khi co nhu cau that.

## Nguyen tac mo rong

- Moi module moi phai lien ket duoc voi `projects`.
- Ke toan chi mo rong theo accounting-lite truoc, khong dua full ERP vao MVP.
- Du lieu production khong phu thuoc demo data trong frontend.
- Tat ca workflow quan trong phai co export CSV/Excel o giai doan sau.
