create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'owner',
  'accountant',
  'project_manager',
  'site_supervisor',
  'hr',
  'viewer'
);

create type public.project_status as enum (
  'preparing',
  'active',
  'paused',
  'handover',
  'warranty',
  'closed'
);

create type public.approval_status as enum (
  'draft',
  'review',
  'approved',
  'rejected',
  'ordered',
  'delivered',
  'paid',
  'closed'
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_code text,
  address text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'viewer',
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  code text not null,
  name text not null,
  site_address text,
  manager_id uuid references public.profiles(id) on delete set null,
  status public.project_status not null default 'preparing',
  contract_value numeric(18, 2) not null default 0,
  estimated_cost numeric(18, 2) not null default 0,
  progress_percent numeric(5, 2) not null default 0,
  start_date date,
  target_date date,
  created_at timestamptz not null default now(),
  unique (company_id, code)
);

create table public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  planned_start date,
  planned_finish date,
  actual_finish date,
  progress_percent numeric(5, 2) not null default 0,
  sort_order int not null default 0
);

create table public.boq_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text,
  description text not null,
  unit text not null default 'lot',
  quantity numeric(18, 3) not null default 1,
  unit_price numeric(18, 2) not null default 0,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

create table public.cost_categories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  accounting_hint text,
  unique (company_id, name)
);

create table public.project_costs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  category_id uuid references public.cost_categories(id) on delete set null,
  cost_date date not null default current_date,
  description text not null,
  amount numeric(18, 2) not null check (amount >= 0),
  vendor_name text,
  employee_id uuid,
  status public.approval_status not null default 'draft',
  document_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  employee_code text,
  phone text,
  job_title text,
  employment_type text not null default 'full_time',
  base_daily_rate numeric(18, 2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (company_id, employee_code)
);

create table public.attendance_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  work_units numeric(5, 2) not null default 1,
  overtime_hours numeric(6, 2) not null default 0,
  allowance numeric(18, 2) not null default 0,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (project_id, employee_id, work_date)
);

create table public.material_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  unit text not null,
  reference_price numeric(18, 2) not null default 0,
  active boolean not null default true,
  unique (company_id, name, unit)
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table public.material_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  material_id uuid references public.material_items(id) on delete set null,
  requested_by uuid references public.profiles(id) on delete set null,
  description text not null,
  quantity numeric(18, 3) not null default 1,
  unit text not null,
  needed_date date,
  status public.approval_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  po_number text not null,
  order_date date not null default current_date,
  status public.approval_status not null default 'draft',
  total_amount numeric(18, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (company_id, po_number)
);

create table public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  material_id uuid references public.material_items(id) on delete set null,
  description text not null,
  quantity numeric(18, 3) not null default 1,
  unit text not null,
  unit_price numeric(18, 2) not null default 0
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  payment_date date not null default current_date,
  direction text not null check (direction in ('in', 'out')),
  counterparty text not null,
  description text not null,
  amount numeric(18, 2) not null check (amount >= 0),
  method text not null default 'bank_transfer',
  status public.approval_status not null default 'paid',
  document_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  document_type text not null default 'general',
  storage_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  entry_date date not null default current_date,
  reference_no text,
  memo text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.journal_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  account_code text not null,
  account_name text not null,
  debit numeric(18, 2) not null default 0,
  credit numeric(18, 2) not null default 0,
  check (debit >= 0 and credit >= 0),
  check (debit = 0 or credit = 0)
);

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_phases enable row level security;
alter table public.boq_items enable row level security;
alter table public.cost_categories enable row level security;
alter table public.project_costs enable row level security;
alter table public.employees enable row level security;
alter table public.attendance_entries enable row level security;
alter table public.material_items enable row level security;
alter table public.suppliers enable row level security;
alter table public.material_requests enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.payments enable row level security;
alter table public.documents enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_lines enable row level security;

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1
$$;

create policy "same company can read company"
  on public.companies for select
  to authenticated
  using (id = public.current_company_id());

create policy "owner can update company"
  on public.companies for update
  to authenticated
  using (id = public.current_company_id() and public.current_app_role() = 'owner')
  with check (id = public.current_company_id());

create policy "same company can read profiles"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or company_id = public.current_company_id());

create policy "owner can manage same company profiles"
  on public.profiles for all
  to authenticated
  using (company_id = public.current_company_id() and public.current_app_role() = 'owner')
  with check (company_id = public.current_company_id());

create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and company_id = public.current_company_id());

create policy "same company manage clients"
  on public.clients for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage projects"
  on public.projects for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage project phases"
  on public.project_phases for all
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  );

create policy "same company manage boq items"
  on public.boq_items for all
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  );

create policy "same company manage cost categories"
  on public.cost_categories for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage project costs"
  on public.project_costs for all
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  );

create policy "same company manage employees"
  on public.employees for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage attendance"
  on public.attendance_entries for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage materials"
  on public.material_items for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage suppliers"
  on public.suppliers for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage material requests"
  on public.material_requests for all
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.company_id = public.current_company_id()
    )
  );

create policy "same company manage purchase orders"
  on public.purchase_orders for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage purchase order items"
  on public.purchase_order_items for all
  to authenticated
  using (
    exists (
      select 1 from public.purchase_orders po
      where po.id = purchase_order_id
        and po.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.purchase_orders po
      where po.id = purchase_order_id
        and po.company_id = public.current_company_id()
    )
  );

create policy "same company manage payments"
  on public.payments for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage documents"
  on public.documents for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage journal entries"
  on public.journal_entries for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "same company manage journal lines"
  on public.journal_lines for all
  to authenticated
  using (
    exists (
      select 1 from public.journal_entries je
      where je.id = journal_entry_id
        and je.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.journal_entries je
      where je.id = journal_entry_id
        and je.company_id = public.current_company_id()
    )
  );

insert into public.companies (id, name, address)
values ('00000000-0000-0000-0000-000000000001', 'QT Sai Gon', 'TP. Ho Chi Minh')
on conflict do nothing;

insert into public.cost_categories (company_id, name, accounting_hint)
values
  ('00000000-0000-0000-0000-000000000001', 'Vat tu', 'Material cost'),
  ('00000000-0000-0000-0000-000000000001', 'Nhan cong', 'Labor cost'),
  ('00000000-0000-0000-0000-000000000001', 'Nha thau phu', 'Subcontractor cost'),
  ('00000000-0000-0000-0000-000000000001', 'May moc', 'Equipment cost'),
  ('00000000-0000-0000-0000-000000000001', 'Chi phi khac', 'Other project cost')
on conflict do nothing;
