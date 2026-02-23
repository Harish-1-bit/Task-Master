import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, reset } from '../../features/user/userSlice';
import Loader from '../../components/Loader';
import { Users, Mail, Star, User } from 'lucide-react';

export default function Employees() {
  const dispatch = useDispatch();
  const { employees, isLoading } = useSelector((state) => state.user);

  useEffect(() => { dispatch(getEmployees()); return () => dispatch(reset()); }, [dispatch]);

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Roster</h1>
          <p className="text-sm text-slate-500 mt-1">View employee profiles and their configured skills.</p>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No employees found</h3>
          <p className="text-slate-500 text-sm">There are no employee accounts registered in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((e) => (
            <div key={e._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-t-8 border-t-emerald-500">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-xl shadow-sm shrink-0 relative">
                  {e.name?.charAt(0).toUpperCase()}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-100 text-emerald-700 p-1 rounded-full border-2 border-white">
                    <User size={12} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-lg truncate">{e.name}</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <p className="truncate">{e.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
