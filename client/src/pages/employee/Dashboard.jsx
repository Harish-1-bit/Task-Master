import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTasks } from '../../features/task/taskSlice';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { ClipboardList, ListTodo, Activity, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task);
  useEffect(() => { dispatch(getMyTasks()); }, [dispatch]);

  // Derive unique projects from assigned tasks
  const myProjects = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    const uniqueProjects = new Map();
    tasks.forEach(task => {
        if (task.project && task.project._id && !uniqueProjects.has(task.project._id)) {
            uniqueProjects.set(task.project._id, task);
        }
    });
  console.log(uniqueProjects)
    
    return Array.from(uniqueProjects.values());
  }, [tasks]);

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <ClipboardList size={20} />
            </span>
            My Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1 pl-13">Overview of your assigned tasks and active projects.</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard title="Total Assigned" value={tasks?.length || 0} icon={ClipboardList} colorClass="bg-white border-t-2 border-t-amber-500 shadow-md" textClass="text-slate-900" iconColor="text-amber-600 bg-amber-50" />
          <StatsCard title="In Progress" value={tasks?.filter(t => t.status === 'in-progress').length || 0} icon={Activity} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-amber-500 bg-amber-50" />
          <StatsCard title="Completed" value={tasks?.filter(t => t.status === 'completed').length || 0} icon={CheckCircle2} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-emerald-500 bg-emerald-50" />
        </div>
      </div>

      {myProjects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Involved Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProjects.map((p) => (
              <div key={p._id} className="bg-white mb-2 rounded-2xl border border-slate-200 border-b-[6px] border-b-amber-500 p-6 shadow-sm group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200 cursor-default">
                <h3 className="font-bold text-slate-900 text-lg mb-3 truncate group-hover:text-amber-600 transition-colors">{p.project.name}</h3>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>{p.status}</span>
                  <span className="text-xs font-medium text-slate-500 capitalize">{p.project.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-start">
        <Link to="/employee/tasks" className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full transition-all duration-300 shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-1 focus:ring-2 focus:ring-amber-500/50 inline-flex items-center gap-2">
          Open Task Board <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
