import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Client, ClientInput } from '../../hooks/useClients';

interface ClientFormProps {
  client?: Client;
  onSubmit: (input: ClientInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClientForm({ client, onSubmit, onCancel, loading }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientInput>({
    name: client?.name || '',
    contact_name: client?.contact_name || null,
    phone: client?.phone || null,
    email: client?.email || null,
    address: client?.address || null,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {client ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition"
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên khách hàng */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Tên khách hàng <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Công ty TNHH ABC"
            />
          </div>

          {/* Người liên hệ */}
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-slate-300 mb-2">
              Người liên hệ
            </label>
            <input
              id="contact_name"
              type="text"
              value={formData.contact_name || ''}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0901234567"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@company.com"
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
              Địa chỉ
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Quận 1, TP.HCM"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {loading ? 'Đang lưu...' : client ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
