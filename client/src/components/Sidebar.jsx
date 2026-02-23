import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FolderPlus, 
  Users, 
  Briefcase, 
  CheckSquare, 
  PlusSquare, 
  LogOut,
  UserCircle
} from 'lucide-react';

const navItems = {
  admin: [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, theme: 'indigo' },
    { to: '/admin/projects', label: 'All Projects', icon: FolderKanban, theme: 'sky' },
    { to: '/admin/projects/new', label: 'New Project', icon: FolderPlus, theme: 'emerald' },
    { to: '/admin/users', label: 'Team Directory', icon: Users, theme: 'amber' },
  ], 
  manager: [
    { to: '/manager/dashboard', label: 'Overview', icon: LayoutDashboard, theme: 'sky' },
    { to: '/manager/projects/available', label: 'Project Board', icon: Briefcase, theme: 'indigo' },
    { to: '/manager/projects/my', label: 'Active Projects', icon: FolderKanban, theme: 'emerald' },
    { to: '/manager/tasks', label: 'Task Management', icon: CheckSquare, theme: 'amber' },
    { to: '/manager/tasks/new', label: 'Assign Task', icon: PlusSquare, theme: 'rose' },
    { to: '/manager/employees', label: 'My Team', icon: Users, theme: 'purple' },
  ],
  employee: [
    { to: '/employee/dashboard', label: 'Overview', icon: LayoutDashboard, theme: 'amber' },
    { to: '/employee/tasks', label: 'My Assignments', icon: CheckSquare, theme: 'emerald' },
  ],
};

const getThemeClasses = (theme) => {
  const themes = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-600', icon: 'text-indigo-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-500', icon: 'text-sky-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500', icon: 'text-amber-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-500', icon: 'text-rose-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500', icon: 'text-purple-500' },
  };
  const t = themes[theme] || themes.indigo;
  return {
    activeClass: `${t.bg} ${t.text} border-r-[3px] ${t.border} font-semibold shadow-[padding-box_0_1px_rgba(0,0,0,0.02)]`,
    iconColor: t.icon
  };
};

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">TaskMaster<span className="text-indigo-600">.</span></span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <UserCircle size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium text-sm text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize font-medium">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-6">Main Menu</p>
        {items.map((item) => {
          const IconInfo = item.icon;
          const { activeClass, iconColor } = getThemeClasses(item.theme);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? activeClass
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconInfo size={18} strokeWidth={2} className={isActive ? iconColor : 'text-slate-400'} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} strokeWidth={2} className="text-slate-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
