import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../features/user/userSlice';
import { getAllProjects } from '../../features/project/projectSlice';
import { getManagerTasks as getAllTasks } from '../../features/task/taskSlice';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';
import { 
  FolderKanban, FolderOpen, Zap, CheckCircle2, 
  Users, UserCog, User, 
  ClipboardList, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  
  const { users } = useSelector((state) => state.user);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  useEffect(() => { 
    dispatch(getAllUsers());
    dispatch(getAllProjects());
    dispatch(getAllTasks()); // Admin has access to all via the same query as manager if no project ID is provided, wait actually Manager endpoint filters by manager's projects.
  }, [dispatch]);

  return (
    <div className="animate-fade-in bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-600 rounded-sm"></div> Admin Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">System metrics and recent activity across your organization.</p>
        </div>
      </div>

      {/* Project Stats */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Project Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatsCard title="Total Projects" value={projects?.length || 0} icon={FolderKanban} colorClass="bg-white border-t-2 border-t-indigo-600 shadow-md" textClass="text-slate-900" iconColor="text-indigo-600 bg-indigo-50" />
          <StatsCard title="Open" value={projects?.filter(p => p.status === 'open').length || 0} icon={FolderOpen} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-slate-500 bg-slate-50" />
          <StatsCard title="In Progress" value={projects?.filter(p => p.status === 'in-progress').length || 0} icon={Zap} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-indigo-500 bg-indigo-50" />
          <StatsCard title="Completed" value={projects?.filter(p => p.status === 'completed').length || 0} icon={CheckCircle2} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-emerald-500 bg-emerald-50" />
        </div>
      </div>

      {/* User Stats */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Team Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Total Users" value={users?.length || 0} icon={Users} colorClass="bg-white border-t-2 border-t-indigo-600 shadow-md" textClass="text-slate-900" iconColor="text-indigo-600 bg-indigo-50" />
          <StatsCard title="Managers" value={users?.filter(u => u.role === 'manager').length || 0} icon={UserCog} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-slate-500 bg-slate-50" />
          <StatsCard title="Employees" value={users?.filter(u => u.role === 'employee').length || 0} icon={User} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-slate-500 bg-slate-50" />
        </div>
      </div>

      {/* Task Stats */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Total Tasks" value={tasks?.length || 0} icon={ClipboardList} colorClass="bg-white border-t-2 border-t-indigo-600 shadow-md" textClass="text-slate-900" iconColor="text-indigo-600 bg-indigo-50" />
          <StatsCard title="In Progress" value={tasks?.filter(t => t.status === 'in-progress').length || 0} icon={Activity} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-indigo-500 bg-indigo-50" />
          <StatsCard title="Completed" value={tasks?.filter(t => t.status === 'completed').length || 0} icon={CheckCircle2} colorClass="bg-white hover:border-slate-300 transition-colors" iconColor="text-emerald-500 bg-emerald-50" />
        </div>
      </div>

    </div>
  );
}
