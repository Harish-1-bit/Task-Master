import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTasks, reset } from '../../features/task/taskSlice';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { ClipboardList, FolderKanban, Calendar, Tag, AlertCircle } from 'lucide-react';

const statusColors = {
  'in-progress': 'bg-amber-100 text-amber-700',
  review: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

const priorityColors = {
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
};

export default function MyTasks() {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task);

  useEffect(() => { dispatch(getMyTasks()); return () => dispatch(reset()); }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <ClipboardList size={20} />
            </span>
            Assigned Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1 pl-13">Manage and update your daily deliverables.</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-3xl">
          <ClipboardList className="w-12 h-12 text-amber-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-slate-900 mb-1">You're all caught up!</h3>
          <p className="text-slate-500 text-sm">No active tasks are currently assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((t) => (
            <Link key={t._id} to={`/employee/tasks/${t._id}`} className="bg-white rounded-3xl border border-slate-200 border-b-[6px] border-b-amber-500 p-6 flex flex-col h-full shadow-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 hover:bg-white active:scale-95">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight mb-2">{t.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColors[t.status]}`}>{t.status}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityColors[t.priority]}`}>
                      {t.priority === 'critical' && <AlertCircle size={10} className="inline mr-1 -mt-0.5" />}
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed flex-1">{t.description}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><FolderKanban size={14} className="text-slate-400"/> {t.project?.name}</span>
                  <span className="flex items-center gap-1.5"><Tag size={14} className="text-slate-400"/> <span className="capitalize">{t.category}</span></span>
                  <span className="flex items-center gap-1.5 ml-auto text-slate-400"><Calendar size={13}/> {new Date(t.deadLine).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
