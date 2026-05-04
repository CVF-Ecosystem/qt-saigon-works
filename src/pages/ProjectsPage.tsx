import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import ProjectForm from '../components/projects/ProjectForm';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project, type ProjectInput, type ProjectStatus } from '../hooks/useProjects';
import { formatVnd } from '../utils/format';

const statusLabels: Record<ProjectStatus, string> = {
  preparing: 'Chuẩn bị',
  active: 'Đang thi công',
  paused: 'Tạm dừng',
  handover: 'Nghiệm thu',
  warranty: 'Bảo hành',
  closed: 'Đóng',
};

const statusColors: Record<ProjectStatus, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  preparing: 'info',
  active: 'success',
  paused: 'warning',
  handover: 'info',
  warranty: 'neutral',
  closed: 'neutral',
};

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  function handleCreate(input: ProjectInput) {
    createProject.mutate(input, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  }

  function handleUpdate(input: ProjectInput) {
    if (!editingProject) return;
    updateProject.mutate(
      { id: editingProject.id, input },
      {
        onSuccess: () => {
          setEditingProject(undefined);
        },
      }
    );
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Bạn có chắc muốn xóa công trình "${name}"?`)) return;
    deleteProject.mutate(id);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProject(undefined);
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
          eyebrow="QUẢN LÝ CÔNG TRÌNH"
          title="Công trình"
          description="Danh sách các dự án thi công"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Thêm công trình</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Mã CT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tên công trình</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Giá trị HĐ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Tiến độ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {projects?.map((project) => (
                <tr key={project.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-blue-400">{project.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{project.name}</div>
                    {project.site_address && (
                      <div className="text-sm text-slate-400 mt-1">{project.site_address}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge tone={statusColors[project.status]}>
                      {statusLabels[project.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-white">{formatVnd(project.contract_value)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-white">{project.progress_percent}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(project)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
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

        {projects?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chưa có công trình nào</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {projects?.map((project) => (
          <div key={project.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-mono text-xs text-blue-400 mb-1">{project.code}</div>
                <h3 className="font-semibold text-white">{project.name}</h3>
                {project.site_address && (
                  <p className="text-sm text-slate-400 mt-1">{project.site_address}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(project)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.name)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <StatusBadge tone={statusColors[project.status]}>
                {statusLabels[project.status]}
              </StatusBadge>
              <div className="text-slate-300">{project.progress_percent}%</div>
            </div>

            <div className="pt-2 border-t border-slate-700">
              <div className="text-sm text-slate-400">Giá trị hợp đồng</div>
              <div className="text-lg font-semibold text-white">{formatVnd(project.contract_value)}</div>
            </div>
          </div>
        ))}

        {projects?.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400">Chưa có công trình nào</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={closeForm}
          loading={createProject.isPending || updateProject.isPending}
        />
      )}
    </div>
  );
}
