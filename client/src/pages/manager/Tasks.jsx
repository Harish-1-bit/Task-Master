import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerTasks, assignTask, deleteTask, reset } from '../../features/task/taskSlice';
import { getEmployees } from '../../features/user/userSlice';
import Loader from '../../components/Loader';
import { Link, useSearchParams } from 'react-router-dom';
import { ClipboardList, Plus, Trash2, User, Tag, Calendar, FolderKanban } from 'lucide-react';

const statusColors = {
  'in-progress': 'bg-amber-100 text-amber-700',
  review: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function Tasks() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.task);
  const { employees } = useSelector((state) => state.user);
  const [assigningId, setAssigningId] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const query = projectId ? `?projectId=${projectId}` : '';
    dispatch(getManagerTasks(query));
    dispatch(getEmployees());
    return () => dispatch(reset());
  }, [dispatch, projectId]);

  const handleAssign = (taskId, employeeId) => {
    dispatch(assignTask({ id: taskId, employeeId }));
    setAssigningId(null);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete._id));
    }
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1">Oversee, assign, and track all tasks across your projects.</p>
        </div>
        <Link to="/manager/tasks/new" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/50 flex items-center gap-2">
          <Plus size={16} /> New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <ClipboardList className="w-12 h-12 text-emerald-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks to display</h3>
          <p className="text-slate-500 text-sm mb-4">There are currently no tasks associated with your projects.</p>
          <Link to="/manager/tasks/new" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/50 inline-flex items-center gap-2">
            <Plus size={16} /> Create Task
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:bg-white transition-all duration-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 border-l-[6px] border-l-emerald-500">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{t.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider shrink-0 ml-4 ${statusColors[t.status]}`}>{t.status}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{t.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <span className="flex items-center gap-1.5"><FolderKanban size={14} className="text-slate-400"/> {t?.project?.name}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1.5"><Tag size={14} className="text-slate-400"/> <span className="capitalize">{t?.category}</span></span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {new Date(t?.deadLine).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="w-full">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assignment</p>
                  {t?.assignedTo ? (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-100 w-full">
                      <User size={14} /> <span className="text-xs font-semibold truncate">{t?.assignedTo?.name}</span>
                    </div>
                  ) : assigningId === t?._id ? (
                    <select onChange={(e) => handleAssign(t?._id, e.target.value)} className="w-full text-xs font-medium border border-sky-300 focus:ring-2 focus:ring-sky-500/20 bg-sky-50 rounded-xl px-2 py-2 outline-none" defaultValue="">
                      <option value="" disabled>Select employee</option>
                      {employees.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                  ) : (
                    <button onClick={() => setAssigningId(t?._id)} className="w-full text-xs bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 px-3 py-2 rounded-xl font-medium transition-all shadow-sm cursor-pointer">Assign Member</button>
                  )}
                </div>
                
                <button onClick={() => handleDeleteClick(t)} className="mt-auto text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 w-full md:w-auto cursor-pointer">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Task</h3>
              <p className="text-slate-500 text-sm mb-4">
                Are you sure you want to delete <strong className="text-slate-700">{taskToDelete.title}</strong>?
              </p>
              
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-2">
                <div className="flex flex-col gap-2 text-sm text-red-800">
                  <span>This action is permanent and cannot be undone. All context, including employee assignments, will be permanently erased.</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
