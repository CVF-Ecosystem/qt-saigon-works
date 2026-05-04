import { ClipboardList, Package, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/vat-tu', label: 'Danh mục', icon: Package },
  { to: '/yeu-cau-vat-tu', label: 'Yêu cầu', icon: ClipboardList },
  { to: '/don-mua-vat-tu', label: 'Đơn mua', icon: ShoppingCart },
];

export function MaterialsNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Điều hướng vật tư">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white',
            ].join(' ')
          }
        >
          <Icon size={16} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
