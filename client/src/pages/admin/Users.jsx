import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, changeUserRole, changeUserStatus, reset } from '../../features/user/userSlice';
import Loader from '../../components/Loader';
import { Shield, Briefcase, User as UserIcon, MoreVertical, CheckCircle2, XCircle, Users as UsersIcon } from 'lucide-react';

const roleBadge = {
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  manager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  employee: 'bg-amber-50 text-amber-700 border-amber-200',
};

const RoleIcon = {
  admin: Shield,
  manager: Briefcase,
  employee: UserIcon
};

export default function Users() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);

  useEffect(() => { dispatch(getAllUsers()); return () => dispatch(reset()); }, [dispatch]);

  const handleRole = (id, role) => dispatch(changeUserRole({ id, role }));
  const handleStatus = (id) => dispatch(changeUserStatus(id));

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user access, roles, and account status across the organization.</p>
        </div>
      </div>

      {users?.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <UsersIcon className="w-12 h-12 text-indigo-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No users found</h3>
          <p className="text-slate-500 text-sm">There are no users to display in the directory.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden border-t-4 border-t-indigo-600">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">User Details</th>
                  <th scope="col" className="px-6 py-4">System Role</th>
                  <th scope="col" className="px-6 py-4">Account Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users?.map((u) => {
                  const Icon = RoleIcon[u.role] || UserIcon;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/50 bg-white transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Icon size={14} className="text-slate-500" />
                          </div>
                          <select
                            value={u.role}
                            onChange={(e) => handleRole(u._id, e.target.value)}
                            className={`pl-8 pr-8 py-1.5 rounded-md text-xs font-semibold border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none ${roleBadge[u.role]}`}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                          >
                            <option value="admin">Administrator</option>
                            <option value="manager">Project Manager</option>
                            <option value="employee">Team Member</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {u.isActive !== false ? (
                            <><CheckCircle2 size={16} className="text-emerald-500" /> <span className="text-emerald-700 font-medium text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Active</span></>
                          ) : (
                            <><XCircle size={16} className="text-red-500" /> <span className="text-red-700 font-medium text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-100">Suspended</span></>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleStatus(u._id)} 
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-all focus:ring-2 focus:outline-none ${
                            u.isActive !== false 
                              ? 'bg-white border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 focus:ring-red-500/20' 
                              : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900/20'
                          }`}
                        >
                          {u.isActive !== false ? 'Suspend Access' : 'Restore Access'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
