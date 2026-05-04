-- QT Sai Gon Works - Seed Data
-- Chay sau khi da tao user owner dau tien trong profiles

-- Luu y: Thay <OWNER_USER_ID> bang User UID that cua owner

-- Seed clients
insert into public.clients (company_id, name, contact_name, phone, address)
values
  ('00000000-0000-0000-0000-000000000001', 'Cong ty TNHH Xay Dung ABC', 'Nguyen Van B', '0901234567', 'Quan 1, TP.HCM'),
  ('00000000-0000-0000-0000-000000000001', 'Cong ty Co Phan Dau Tu XYZ', 'Tran Thi C', '0912345678', 'Quan 3, TP.HCM'),
  ('00000000-0000-0000-0000-000000000001', 'Chu dau tu ca nhan - Ong D', 'Le Van D', '0923456789', 'Binh Thanh, TP.HCM')
on conflict do nothing;

-- Seed projects
insert into public.projects (
  company_id,
  client_id,
  code,
  name,
  site_address,
  status,
  contract_value,
  estimated_cost,
  progress_percent,
  start_date,
  target_date
)
select
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'CT001',
  'Nha pho 3 tang - Quan 1',
  '123 Nguyen Hue, Quan 1, TP.HCM',
  'active',
  2500000000,
  2100000000,
  45.00,
  '2026-03-01',
  '2026-08-31'
from public.clients c
where c.name = 'Cong ty TNHH Xay Dung ABC'
limit 1
on conflict (company_id, code) do nothing;

insert into public.projects (
  company_id,
  client_id,
  code,
  name,
  site_address,
  status,
  contract_value,
  estimated_cost,
  progress_percent,
  start_date,
  target_date
)
select
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'CT002',
  'Biet thu 2 tang - Quan 2',
  '456 Thao Dien, Quan 2, TP.HCM',
  'active',
  4200000000,
  3600000000,
  30.00,
  '2026-04-15',
  '2026-12-31'
from public.clients c
where c.name = 'Cong ty Co Phan Dau Tu XYZ'
limit 1
on conflict (company_id, code) do nothing;

insert into public.projects (
  company_id,
  client_id,
  code,
  name,
  site_address,
  status,
  contract_value,
  estimated_cost,
  progress_percent,
  start_date,
  target_date
)
select
  '00000000-0000-0000-0000-000000000001',
  c.id,
  'CT003',
  'Sua chua nha cu - Binh Thanh',
  '789 Xo Viet Nghe Tinh, Binh Thanh, TP.HCM',
  'preparing',
  850000000,
  720000000,
  5.00,
  '2026-05-10',
  '2026-07-31'
from public.clients c
where c.name = 'Chu dau tu ca nhan - Ong D'
limit 1
on conflict (company_id, code) do nothing;

-- Seed employees
insert into public.employees (company_id, full_name, employee_code, phone, job_title, employment_type, base_daily_rate, active)
values
  ('00000000-0000-0000-0000-000000000001', 'Nguyen Van E', 'NV001', '0934567890', 'Chi huy cong truong', 'full_time', 500000, true),
  ('00000000-0000-0000-0000-000000000001', 'Tran Van F', 'NV002', '0945678901', 'Tho xay', 'contract', 400000, true),
  ('00000000-0000-0000-0000-000000000001', 'Le Thi G', 'NV003', '0956789012', 'Tho son', 'contract', 380000, true),
  ('00000000-0000-0000-0000-000000000001', 'Pham Van H', 'NV004', '0967890123', 'Tho dien', 'contract', 420000, true),
  ('00000000-0000-0000-0000-000000000001', 'Hoang Van I', 'NV005', '0978901234', 'Tho nuoc', 'contract', 400000, true),
  ('00000000-0000-0000-0000-000000000001', 'Vo Thi K', 'NV006', '0989012345', 'Ke toan', 'full_time', 450000, true)
on conflict (company_id, employee_code) do nothing;

-- Seed suppliers
insert into public.suppliers (company_id, name, contact_name, phone, address)
values
  ('00000000-0000-0000-0000-000000000001', 'Cong ty VLXD Hoang Long', 'Nguyen Van L', '0281234567', 'Quan 12, TP.HCM'),
  ('00000000-0000-0000-0000-000000000001', 'Cua hang sat thep Thanh Dat', 'Tran Van M', '0282345678', 'Binh Tan, TP.HCM'),
  ('00000000-0000-0000-0000-000000000001', 'Dai ly xi mang Ngoc Anh', 'Le Thi N', '0283456789', 'Tan Binh, TP.HCM')
on conflict do nothing;

-- Seed material items
insert into public.material_items (company_id, name, unit, reference_price, active)
values
  ('00000000-0000-0000-0000-000000000001', 'Xi mang PCB40', 'bao', 95000, true),
  ('00000000-0000-0000-0000-000000000001', 'Cat xay dung', 'm3', 280000, true),
  ('00000000-0000-0000-0000-000000000001', 'Da 1x2', 'm3', 320000, true),
  ('00000000-0000-0000-0000-000000000001', 'Gach block 10x20x40', 'vien', 4500, true),
  ('00000000-0000-0000-0000-000000000001', 'Thep D10', 'kg', 18000, true),
  ('00000000-0000-0000-0000-000000000001', 'Thep D16', 'kg', 17500, true),
  ('00000000-0000-0000-0000-000000000001', 'Go op pha 12mm', 'tam', 185000, true),
  ('00000000-0000-0000-0000-000000000001', 'Son nuoc ngoai troi', 'thung', 850000, true)
on conflict (company_id, name, unit) do nothing;

-- Seed sample project costs (chi phi da phat sinh)
-- Luu y: Can lay project_id that tu bang projects

insert into public.project_costs (
  project_id,
  category_id,
  cost_date,
  description,
  amount,
  vendor_name,
  status
)
select
  p.id,
  cc.id,
  '2026-04-01',
  'Mua xi mang va cat dot 1',
  45000000,
  'Cong ty VLXD Hoang Long',
  'paid'
from public.projects p
cross join public.cost_categories cc
where p.code = 'CT001'
  and cc.name = 'Vat tu'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

insert into public.project_costs (
  project_id,
  category_id,
  cost_date,
  description,
  amount,
  status
)
select
  p.id,
  cc.id,
  '2026-04-15',
  'Luong tho thang 4',
  28000000,
  'paid'
from public.projects p
cross join public.cost_categories cc
where p.code = 'CT001'
  and cc.name = 'Nhan cong'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

insert into public.project_costs (
  project_id,
  category_id,
  cost_date,
  description,
  amount,
  vendor_name,
  status
)
select
  p.id,
  cc.id,
  '2026-04-20',
  'Thue may dao dat',
  12000000,
  'Cong ty May Xay Dung',
  'paid'
from public.projects p
cross join public.cost_categories cc
where p.code = 'CT002'
  and cc.name = 'May moc'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

-- Seed sample payments (thu chi)
insert into public.payments (
  company_id,
  project_id,
  payment_date,
  direction,
  counterparty,
  description,
  amount,
  method,
  status
)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  '2026-03-15',
  'in',
  'Cong ty TNHH Xay Dung ABC',
  'Tam ung dot 1 - 30% gia tri hop dong',
  750000000,
  'bank_transfer',
  'paid'
from public.projects p
where p.code = 'CT001'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

insert into public.payments (
  company_id,
  project_id,
  payment_date,
  direction,
  counterparty,
  description,
  amount,
  method,
  status
)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  '2026-04-01',
  'out',
  'Cong ty VLXD Hoang Long',
  'Thanh toan vat tu dot 1',
  45000000,
  'bank_transfer',
  'paid'
from public.projects p
where p.code = 'CT001'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

insert into public.payments (
  company_id,
  project_id,
  payment_date,
  direction,
  counterparty,
  description,
  amount,
  method,
  status
)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  '2026-04-20',
  'in',
  'Cong ty Co Phan Dau Tu XYZ',
  'Tam ung dot 1 - 25% gia tri hop dong',
  1050000000,
  'bank_transfer',
  'paid'
from public.projects p
where p.code = 'CT002'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

-- Seed sample attendance (cham cong)
-- Tuan 1 thang 5/2026 cho CT001
insert into public.attendance_entries (
  company_id,
  project_id,
  employee_id,
  work_date,
  work_units,
  overtime_hours,
  allowance
)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  e.id,
  '2026-05-01',
  1.0,
  0,
  0
from public.projects p
cross join public.employees e
where p.code = 'CT001'
  and e.employee_code in ('NV001', 'NV002', 'NV003', 'NV004')
  and p.company_id = '00000000-0000-0000-0000-000000000001'
on conflict (project_id, employee_id, work_date) do nothing;

insert into public.attendance_entries (
  company_id,
  project_id,
  employee_id,
  work_date,
  work_units,
  overtime_hours,
  allowance
)
select
  '00000000-0000-0000-0000-000000000001',
  p.id,
  e.id,
  '2026-05-02',
  1.0,
  2.0,
  50000
from public.projects p
cross join public.employees e
where p.code = 'CT001'
  and e.employee_code in ('NV001', 'NV002', 'NV003', 'NV004')
  and p.company_id = '00000000-0000-0000-0000-000000000001'
on conflict (project_id, employee_id, work_date) do nothing;

-- Seed sample material requests
insert into public.material_requests (
  project_id,
  material_id,
  description,
  quantity,
  unit,
  needed_date,
  status
)
select
  p.id,
  m.id,
  'Can them xi mang cho do mong',
  50,
  'bao',
  '2026-05-10',
  'review'
from public.projects p
cross join public.material_items m
where p.code = 'CT001'
  and m.name = 'Xi mang PCB40'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

insert into public.material_requests (
  project_id,
  material_id,
  description,
  quantity,
  unit,
  needed_date,
  status
)
select
  p.id,
  m.id,
  'Thep D16 cho cot tang 2',
  800,
  'kg',
  '2026-05-15',
  'approved'
from public.projects p
cross join public.material_items m
where p.code = 'CT002'
  and m.name = 'Thep D16'
  and p.company_id = '00000000-0000-0000-0000-000000000001'
limit 1;

-- Hoan thanh seed
select 'Seed data completed successfully!' as message;

