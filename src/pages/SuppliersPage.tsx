import { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import SupplierForm from '../components/suppliers/SupplierForm';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, type Supplier, type SupplierInput } from '../hooks/useSuppliers';

export default function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();

  const { data: suppliers, isLoading } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  function handleCreate(input: SupplierInput) {
    createSupplier.mutate(input, {
      onSuccess: () => setShowForm(false),
    });
  }

  function handleUpdate(input: SupplierInput) {
    if (!editingSupplier) return;
    updateSupplier.mutate(
      { id: editingSupplier.id, input },
      {
        onSuccess: () => setEditingSupplier(undefined),
      }
    );
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa nhà cung cấp "${name}"?`)) return;
    deleteSupplier.mutate(id);
  }

  function openEditForm(supplier: Supplier) {
    setEditingSupplier(supplier);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSupplier(undefined);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="QUẢN LÝ NHÀ CUNG CẤP"
          title="Nhà cung cấp"
          description="Danh sách nhà cung cấp vật tư"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Thêm NCC</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên NCC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Người liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Địa chỉ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {suppliers?.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{supplier.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{supplier.contact_name || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {supplier.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone size={14} className="text-slate-500" />
                          {supplier.phone}
                        </div>
                      )}
                      {supplier.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mail size={14} className="text-slate-500" />
                          {supplier.email}
                        </div>
                      )}
                      {!supplier.phone && !supplier.email && <span className="text-slate-500">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300 max-w-xs truncate">{supplier.address || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(supplier)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {suppliers?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chưa có nhà cung cấp nào</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {suppliers?.map((supplier) => (
          <div key={supplier.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{supplier.name}</h3>
                {supplier.contact_name && (
                  <p className="text-sm text-slate-400">{supplier.contact_name}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(supplier)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id, supplier.name)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {supplier.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={16} className="text-slate-500" />
                  {supplier.phone}
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  {supplier.email}
                </div>
              )}
            </div>
          </div>
        ))}

        {suppliers?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">Chưa có nhà cung cấp nào</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingSupplier) && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={editingSupplier ? handleUpdate : handleCreate}
          onCancel={closeForm}
          loading={createSupplier.isPending || updateSupplier.isPending}
        />
      )}
    </div>
  );
}
