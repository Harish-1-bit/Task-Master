import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects, deleteProject, reset } from '../../features/project/projectSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { Plus, Trash2, ArrowRight, FolderKanban, Calendar, DollarSign, User } from 'lucide-react';

const statusColors = {
  open: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
};

export default function Projects() {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.project);

  useEffect(() => { dispatch(getAllProjects()); return () => dispatch(reset()); }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) dispatch(deleteProject(id));
  };

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all organization projects and portfolios.</p>
        </div>
        <Link to="/admin/projects/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/50 outline-none flex items-center gap-2">
          <Plus size={16} /> New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <FolderKanban className="w-12 h-12 text-indigo-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No projects found</h3>
          <p className="text-slate-500 text-sm mb-4">Get started by creating your first project.</p>
          <Link to="/admin/projects/new" className="btn-primary bg-indigo-600 hover:bg-indigo-700 inline-flex items-center gap-2">
            <Plus size={16} /> Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p._id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col h-full border-t-[3px] border-t-indigo-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-1.5">
                    <Link to={`/admin/projects/${p._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                      {p.name}
                    </Link>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wider font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </div>
              
              <div className="mt-auto grid grid-cols-2 gap-y-3 gap-x-4 mb-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User size={14} className="text-slate-400" />
                  <span className="truncate">{p.assignedManager?.name || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{new Date(p.deadLine).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border border-current/10 ${priorityColors[p.priority]}`}>{p.priority} priority</span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{p.category}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Project">
                  <Trash2 size={16} />
                </button>
                <Link to={`/admin/projects/${p._id}`} className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 text-xs font-medium rounded-md transition-all shadow-sm flex items-center gap-2">
                  Manage <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
