# QT Sai Gon Works - Supabase Setup Guide

Ngay tao: 2026-05-05

## Muc tieu

Huong dan tao Supabase project va cau hinh cho QT Sai Gon Works MVP.

## Buoc 1: Tao Supabase Project

1. Truy cap https://supabase.com
2. Dang nhap hoac tao tai khoan moi
3. Click "New Project"
4. Dien thong tin:
   - **Name**: `qt-saigon-works` (hoac ten tuy chon)
   - **Database Password**: Tao password manh va luu lai
   - **Region**: Chon `Southeast Asia (Singapore)` hoac gan Viet Nam nhat
   - **Pricing Plan**: Chon `Free` cho MVP
5. Click "Create new project"
6. Doi 2-3 phut de Supabase khoi tao database

## Buoc 2: Lay Thong Tin Ket Noi

Sau khi project khoi tao xong:

1. Vao tab **Settings** (icon banh rang ben trai)
2. Chon **API** trong menu Settings
3. Sao chep 2 gia tri sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Chuoi dai bat dau bang `eyJ...`

**LUU Y QUAN TRONG:**
- **KHONG BAO GIO** commit anon key vao Git
- **KHONG BAO GIO** dung service_role key trong frontend
- Chi dung anon key cho frontend; RLS se bao ve du lieu

## Buoc 3: Tao File `.env.local`

Trong thu muc goc cua project (`qt-saigon-works/`), tao file `.env.local`:

```bash
# Tao file .env.local tu .env.example
cp .env.example .env.local
```

Sau do mo `.env.local` va dien thong tin:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_COMPANY_NAME=QT Sai Gon
```

Thay `xxxxx` va `eyJ...` bang gia tri that tu Supabase project cua ban.

**Kiem tra `.gitignore`:**

File `.gitignore` da chua `.env.local` de tranh commit nham:

```
.env
.env.local
.env.*.local
```

## Buoc 4: Chay Migration

### Option A: Dung Supabase SQL Editor (De nhat)

1. Vao Supabase Dashboard
2. Chon tab **SQL Editor** (icon database ben trai)
3. Click "New query"
4. Mo file `supabase/migrations/0001_initial_schema.sql` trong project
5. Copy toan bo noi dung SQL
6. Paste vao Supabase SQL Editor
7. Click "Run" (hoac Ctrl+Enter)
8. Doi cho den khi thay "Success. No rows returned"

### Option B: Dung Supabase CLI (Neu da cai)

Neu da cai Supabase CLI:

```bash
# Link project
supabase link --project-ref xxxxx

# Chay migration
supabase db push
```

## Buoc 5: Kiem Tra Schema

Sau khi chay migration thanh cong:

1. Vao tab **Table Editor**
2. Kiem tra cac bang da duoc tao:
   - `companies` (da co 1 row: QT Sai Gon)
   - `profiles`
   - `clients`
   - `projects`
   - `employees`
   - `material_items`
   - `suppliers`
   - `cost_categories` (da co 5 rows)
   - Va cac bang khac...

3. Vao tab **Authentication** > **Policies**
4. Kiem tra RLS da bat (enabled) tren tat ca cac bang

## Buoc 6: Bat Auth Email/Password

1. Vao tab **Authentication** (icon khoa ben trai)
2. Chon **Providers**
3. Tim **Email** provider
4. Dam bao **Enable Email provider** da bat (ON)
5. Cau hinh:
   - **Enable Email Confirmations**: TAT (OFF) cho MVP de test nhanh
   - Sau nay khi production co the bat lai

## Buoc 7: Tao Storage Bucket

1. Vao tab **Storage** (icon folder ben trai)
2. Click "Create a new bucket"
3. Dien thong tin:
   - **Name**: `project-documents`
   - **Public bucket**: TAT (OFF) - chi nguoi trong company moi xem duoc
4. Click "Create bucket"

### Cau hinh Storage Policy

Sau khi tao bucket, tao policy de cho phep upload/download:

1. Click vao bucket `project-documents`
2. Chon tab **Policies**
3. Click "New policy"
4. Chon **For full customization** > "Create policy"
5. Tao policy cho SELECT (download):

```sql
CREATE POLICY "Same company can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text
    FROM public.profiles
    WHERE id = auth.uid()
  )
);
```

6. Tao policy cho INSERT (upload):

```sql
CREATE POLICY "Same company can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text
    FROM public.profiles
    WHERE id = auth.uid()
  )
);
```

7. Tao policy cho DELETE:

```sql
CREATE POLICY "Same company can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text
    FROM public.profiles
    WHERE id = auth.uid()
  )
);
```

## Buoc 8: Tao User Dau Tien

### Tao Auth User

1. Vao tab **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Dien thong tin:
   - **Email**: email chu doanh nghiep (vi du: `admin@qtsaigon.com`)
   - **Password**: Tao password manh
   - **Auto Confirm User**: BAT (ON) de khong can xac nhan email
4. Click "Create user"
5. Sao chep **User UID** (chuoi uuid)

### Tao Profile Owner

1. Vao tab **Table Editor**
2. Chon bang `profiles`
3. Click "Insert" > "Insert row"
4. Dien thong tin:
   - **id**: Paste User UID tu buoc tren
   - **company_id**: `00000000-0000-0000-0000-000000000001` (QT Sai Gon)
   - **full_name**: Ten chu doanh nghiep (vi du: `Nguyen Van A`)
   - **role**: Chon `owner`
   - **phone**: So dien thoai (tuy chon)
   - **active**: `true`
5. Click "Save"

## Buoc 9: Kiem Tra Ket Noi

Quay lai project code:

```bash
# Cai dependencies neu chua co
npm install

# Chay dev server
npm run dev
```

Mo browser tai `http://localhost:5173` (hoac port hien thi).

Kiem tra:
- App khong hien loi Supabase connection
- Co the thay login form (neu da co UI)
- Console khong co loi `VITE_SUPABASE_URL` undefined

## Buoc 10: Seed Data Mau (Tuy chon)

Neu muon co data mau de test:

1. Vao **SQL Editor**
2. Chay script `supabase/seed.sql` (se duoc tao o buoc tiep theo)

## Troubleshooting

### Loi: "Failed to fetch"

- Kiem tra `.env.local` co dung `VITE_SUPABASE_URL`
- Kiem tra Supabase project chua bi pause (Free plan pause sau 1 tuan khong dung)
- Restart dev server sau khi sua `.env.local`

### Loi: "JWT expired" hoac "Invalid JWT"

- Kiem tra `VITE_SUPABASE_ANON_KEY` dung va day du
- Khong dung service_role key cho frontend

### Loi: "Row level security policy violation"

- Kiem tra user da co profile trong bang `profiles`
- Kiem tra `company_id` trong profile khop voi data dang truy cap
- Kiem tra RLS policies da duoc tao dung trong migration

### Loi: "relation does not exist"

- Migration chua chay thanh cong
- Quay lai Buoc 4 va chay lai migration

## Bao Mat

**TUYET DOI KHONG:**
- Commit `.env.local` vao Git
- Share anon key public (chi dung trong app)
- Dung service_role key trong frontend
- Tat RLS tren bang nghiep vu

**NEN:**
- Dung anon key cho frontend
- Bat RLS tren tat ca bang
- Loc theo `company_id` trong moi policy
- Backup database dinh ky (Supabase Dashboard > Database > Backups)

## Next Steps

Sau khi setup xong:
1. Test login voi user owner vua tao
2. Tao Auth UI (P1.2)
3. Tao CRUD cho clients, projects, employees (P1.3)

