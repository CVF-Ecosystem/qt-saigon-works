# QT Sai Gon Works - Product Spec

Ngay lap spec: 2026-05-04

## 1. Muc tieu san pham

QT Sai Gon Works la ung dung quan ly thi cong cho cong ty xay dung nho duoi 50 nhan su. San pham khong nham thay the ERP day du ngay lap tuc. Ban dau can giai quyet cac viec hang ngay cua chu doanh nghiep, quan ly du an, ke toan noi bo va chi huy cong truong.

Ung dung phai dung duoc tren web va co the dong goi desktop Windows. Backend dung Supabase de giam chi phi van hanh va rut ngan thoi gian trien khai.

## 2. Doi tuong nguoi dung

- Chu doanh nghiep: xem tinh hinh cong trinh, dong tien, cong no, loi nhuan du kien.
- Quan ly du an: cap nhat tien do, chi phi, vat tu, nha thau phu.
- Ke toan: theo doi thu chi, hoa don, tam ung, cong no, bao cao.
- Chi huy cong truong: nhap cham cong, de nghi vat tu, nhat ky cong truong, hinh anh.
- Nhan su hanh chinh: ho so nhan vien, ngay cong, bang luong co ban.

## 3. Pham vi MVP

### Bat buoc co

- Dashboard tong quan cong ty.
- Danh sach cong trinh, trang thai, gia tri hop dong, tien do.
- Du toan va hang muc chi phi theo cong trinh.
- Thu chi, tam ung, thanh toan, cong no phai thu/phai tra.
- Vat tu: danh muc, de nghi mua, nha cung cap, don mua hang co ban.
- Nhan su: ho so nhan vien, cham cong theo cong trinh, bang luong mau.
- Tai lieu: hop dong, bien ban, hoa don, hinh anh cong truong.
- Bao cao: lai lo cong trinh, dong tien, cong no, nhan cong.

### Chua lam o MVP

- Ke toan day du theo TT200/TT133.
- Quan ly kho nhieu dia diem phuc tap.
- MRP, san xuat, ban hang le, CRM nang cao.
- Phan quyen qua Keycloak hoac SSO doanh nghiep.
- Quy trinh phe duyet qua nhieu cap phuc tap.

## 4. Module

### 4.1 Dashboard

Hien thi:

- So cong trinh dang thi cong.
- Tong gia tri hop dong.
- Tong chi phi da ghi nhan.
- Tien da thu, tien chua thu.
- Lai lo uoc tinh theo cong trinh.
- Viec can xu ly: de nghi mua hang, tam ung, thanh toan, cong no qua han.

### 4.2 Cong trinh

Quan ly moi du an thi cong:

- Ten cong trinh, khach hang, dia chi.
- Gia tri hop dong, ngay bat dau, ngay ket thuc du kien.
- Trang thai: chuan bi, dang thi cong, tam dung, nghiem thu, bao hanh, dong.
- Tien do phan tram.
- Nguoi phu trach.
- Lien ket chi phi, vat tu, nhan cong, tai lieu.

### 4.3 Du toan va chi phi

Theo doi:

- Hang muc du toan theo cong trinh.
- Chi phi vat tu, nhan cong, may moc, nha thau phu, khac.
- Tam ung va quyet toan tam ung.
- So sanh budget vs actual.
- Canh bao vuot ngan sach.

### 4.4 Vat tu va mua hang

Workflow MVP:

1. Cong truong tao de nghi vat tu.
2. Quan ly du an duyet.
3. Ke toan/hanh chinh tao don mua hang.
4. Cap nhat trang thai da dat, da giao, da thanh toan.

Theo doi:

- Danh muc vat tu.
- Nha cung cap.
- Don gia tham khao.
- De nghi mua hang.
- Don mua hang.

### 4.5 Nhan su va cham cong

Pham vi nhe:

- Ho so nhan vien.
- Vai tro: van phong, chi huy cong truong, tho, bao ve, lai xe, thoi vu.
- Cham cong theo ngay va cong trinh.
- Tang ca, phu cap, tam ung luong.
- Bang luong tong hop thang.

### 4.6 Ke toan nhe

Khong thay the phan mem ke toan chinh o giai doan dau. Muc tieu la cung cap ke toan quan tri noi bo:

- Thu tien khach hang.
- Chi tien nha cung cap, nhan cong, nha thau phu.
- Cong no phai thu/phai tra.
- Hoa don dau vao/dau ra o muc quan ly ho so.
- But toan noi bo don gian de doi soat.
- Xuat Excel/CSV cho ke toan chinh.

### 4.7 Tai lieu

Luu tren Supabase Storage:

- Hop dong.
- Phu luc.
- Hoa don.
- Bien ban nghiem thu.
- Hinh anh tien do.
- Ho so thanh toan.

## 5. Luong nghiep vu chinh

### Tao cong trinh moi

1. Nhap khach hang va thong tin cong trinh.
2. Nhap gia tri hop dong va moc tien do.
3. Nhap du toan ban dau.
4. Gan quan ly du an va doi thi cong.
5. Dashboard bat dau tinh budget, actual, margin.

### Ghi nhan chi phi

1. Chon cong trinh.
2. Chon loai chi phi.
3. Nhap so tien, ngay, nha cung cap/nhan vien lien quan.
4. Upload chung tu.
5. He thong cap nhat actual cost va cong no.

### Cham cong cong truong

1. Chon ngay va cong trinh.
2. Chon nhan vien.
3. Nhap cong, tang ca, ghi chu.
4. Cuoi thang tong hop bang luong.

### De nghi vat tu

1. Chi huy cong truong tao phieu de nghi.
2. Quan ly du an duyet hoac tu choi.
3. Ke toan/hanh chinh tao don mua.
4. Cap nhat giao hang va thanh toan.

## 6. Phan quyen

- owner: toan quyen.
- accountant: tai chinh, thu chi, cong no, bao cao.
- project_manager: cong trinh, tien do, chi phi, vat tu.
- site_supervisor: cham cong, de nghi vat tu, nhat ky, tai lieu.
- hr: nhan vien, cham cong, luong.
- viewer: chi xem bao cao duoc cap quyen.

## 7. Tieu chi thanh cong MVP

- Chu doanh nghiep xem duoc lai lo tung cong trinh trong 30 giay.
- Ke toan nam duoc cong no va dong tien theo cong trinh.
- Cong truong gui duoc cham cong va de nghi vat tu tu dien thoai/laptop.
- Du lieu co the xuat ra Excel/CSV.
- App web chay tren Netlify, desktop chay tren Windows.

## 8. Huong mo rong

Giai doan 2:

- PWA offline-first cho cong truong.
- Quy trinh phe duyet nhieu cap.
- Bao gia va hop dong mau.
- Tich hop chu ky so, email, Zalo OA.
- Bao cao thue va mapping sang phan mem ke toan.

Giai doan 3:

- Multi-company.
- BI dashboard.
- Mobile app native neu can.
- API tich hop voi ngan hang, hoa don dien tu, ke toan chuyen nghiep.
