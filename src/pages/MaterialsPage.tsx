import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import MaterialForm from '../components/materials/MaterialForm';
import { MaterialsNav } from '../components/materials/MaterialsNav';
import { useMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial, type MaterialItem, type MaterialInput } from '../hooks/useMaterials';
import { formatVnd } from '../utils/format';

export default function MaterialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | undefined>();

  const { data: materials, isLoading } = useMaterials();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();

  function handleCreate(input: MaterialInput) {
    createMaterial.mutate(input, {
      onSuccess: () => setShowForm(false),
    });
  }

  function handleUpdate(input: MaterialInput) {
    if (!editingMaterial) return;
    updateMaterial.mutate(
      { id: editingMaterial.id, input },
      {
        onSuccess: () => setEditingMaterial(undefined),
      }
    );
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa vật tư "${name}"?`)) return;
    deleteMaterial.mutate(id);
  }

  function openEditForm(material: MaterialItem) {
    setEditingMaterial(material);
  }

  function closeForm() {
    setShowForm(false);
    setEditingMaterial(undefined);
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
          eyebrow="QUẢN LÝ VẬT TƯ"
          title="Danh mục vật tư"
          description="Danh sách vật tư xây dựng"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Thêm vật tư</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      <MaterialsNav />

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên vật tư</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Đơn vị</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Đơn giá tham khảo</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {materials?.map((material) => (
                <tr key={material.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{material.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{material.unit}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-white">{formatVnd(material.reference_price)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      material.active 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {material.active ? 'Đang dùng' : 'Ngừng dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(material)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id, material.name)}
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

        {materials?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chưa có vật tư nào</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {materials?.map((material) => (
          <div key={material.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{material.name}</h3>
                <p className="text-sm text-slate-400 mt-1">Đơn vị: {material.unit}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(material)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(material.id, material.name)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <div className="text-sm text-slate-400">Đơn giá tham khảo</div>
              <div className="text-lg font-semibold text-white">{formatVnd(material.reference_price)}</div>
            </div>

            <div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                material.active 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'bg-gray-500/10 text-gray-400'
              }`}>
                {material.active ? 'Đang dùng' : 'Ngừng dùng'}
              </span>
            </div>
          </div>
        ))}

        {materials?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">Chưa có vật tư nào</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingMaterial) && (
        <MaterialForm
          material={editingMaterial}
          onSubmit={editingMaterial ? handleUpdate : handleCreate}
          onCancel={closeForm}
          loading={createMaterial.isPending || updateMaterial.isPending}
        />
      )}
    </div>
  );
}
