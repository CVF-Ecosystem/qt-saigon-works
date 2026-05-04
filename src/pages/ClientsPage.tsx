import { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import ClientForm from '../components/clients/ClientForm';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, type Client, type ClientInput } from '../hooks/useClients';

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  function handleCreate(input: ClientInput) {
    createClient.mutate(input, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  }

  function handleUpdate(input: ClientInput) {
    if (!editingClient) return;
    updateClient.mutate(
      { id: editingClient.id, input },
      {
        onSuccess: () => {
          setEditingClient(undefined);
        },
      }
    );
  }

  function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;
    deleteClient.mutate(id);
  }

  function openEditForm(client: Client) {
    setEditingClient(client);
  }

  function closeForm() {
    setShowForm(false);
    setEditingClient(undefined);
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
          eyebrow="QUẢN LÝ KHÁCH HÀNG"
          title="Khách hàng"
          description="Quản lý danh sách khách hàng và chủ đầu tư"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Thêm khách hàng</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Tên khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Người liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {clients?.map((client) => (
                <tr key={client.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{client.contact_name || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone size={14} className="text-slate-500" />
                          {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mail size={14} className="text-slate-500" />
                          {client.email}
                        </div>
                      )}
                      {!client.phone && !client.email && <span className="text-slate-500">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300 max-w-xs truncate">
                      {client.address || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(client)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                        aria-label="Sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                        aria-label="Xóa"
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

        {clients?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chưa có khách hàng nào</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-400 hover:text-blue-300 transition"
            >
              Thêm khách hàng đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {clients?.map((client) => (
          <div
            key={client.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{client.name}</h3>
                {client.contact_name && (
                  <p className="text-sm text-slate-400">{client.contact_name}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(client)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                  aria-label="Sửa"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                  aria-label="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {client.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={16} className="text-slate-500" />
                  {client.phone}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  {client.email}
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>{client.address}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {clients?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400 mb-4">Chưa có khách hàng nào</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Thêm khách hàng đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingClient) && (
        <ClientForm
          client={editingClient}
          onSubmit={editingClient ? handleUpdate : handleCreate}
          onCancel={closeForm}
          loading={createClient.isPending || updateClient.isPending}
        />
      )}
    </div>
  );
}
