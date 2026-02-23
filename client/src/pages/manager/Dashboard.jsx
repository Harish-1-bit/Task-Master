import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProjects } from '../../features/project/projectSlice';
import { getManagerTasks } from '../../features/task/taskSlice';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { FolderKanban, ClipboardList, Activity, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  
  const { projects, isLoading: projectsLoading } = useSelector((state) => state.project);
  const { tasks, isLoading: tasksLoading } = useSelector((state) => state.task);

  useEffect(() => { 
    dispatch(getMyProjects());
    dispatch(getManagerTasks());
  }, [dispatch]);

  const isLoading = projectsLoading || tasksLoading;

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <FolderKanban size={18} />
            </span>
            Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 pl-10">Overview of your assigned projects and team tasks.</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatsCard title="Active Projects" value={projects?.length || 0} icon={FolderKanban} colorClass="bg-white border-t-2 border-t-sky-500 shadow-md" textClass="text-slate-900" iconColor="text-sky-600 bg-sky-50" />
          <StatsCard title="Total Tasks Managed" value={tasks?.length || 0} icon={ClipboardList} colorClass="bg-white border-t-2 border-t-emerald-500 shadow-md" textClass="text-slate-900" iconColor="text-emerald-600 bg-emerald-50" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="In Progress" value={tasks?.filter(t => t.status === 'in-progress').length || 0} icon={Activity} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-sky-500 bg-sky-50" />
          <StatsCard title="In Review" value={tasks?.filter(t => t.status === 'review').length || 0} icon={Search} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-purple-500 bg-purple-50" />
          <StatsCard title="Completed" value={tasks?.filter(t => t.status === 'completed').length || 0} icon={CheckCircle2} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-emerald-500 bg-emerald-50" />
        </div>
      </div>

      {projects?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Projects List</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p._id} className="bg-white mb-2 rounded-xl p-5 border border-slate-200 border-l-[6px] border-l-sky-500 shadow-sm flex items-center justify-between group cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                <div>
                  <p className="font-bold text-slate-900 text-lg">{p.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                    Status: <span className="capitalize">{p.status}</span>
                  </p>
                </div>
                <Link to="/manager/tasks" className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
