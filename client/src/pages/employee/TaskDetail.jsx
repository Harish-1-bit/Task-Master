import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTask, updateTaskStatus, addComment, clearTask, reset } from '../../features/task/taskSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ArrowLeft, FolderKanban, Tag, Flag, Calendar, User, CheckCircle2, MessageSquare, Send } from 'lucide-react';

const statusFlow = ['in-progress', 'review', 'completed'];
const statusColors = {
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  review: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function TaskDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { task, comments, isLoading } = useSelector((state) => state.task);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { dispatch(getTask(id)); return () => { dispatch(clearTask()); dispatch(reset()); }; }, [dispatch, id]);

  const handleStatus = (status) => dispatch(updateTaskStatus({ id, status }));

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ id, text: commentText }));
    setCommentText('');
  };

  if (isLoading || !task) return <Loader />;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors group cursor-pointer">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Task Info */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 opacity-50 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 leading-tight tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${statusColors[task.status]}`}>{task.status}</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                task.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                task.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>{task.priority} Priority</span>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-white/60 rounded-xl border border-amber-100 mb-8 backdrop-blur-sm">
          <p className="text-slate-700 whitespace-pre-line leading-relaxed">{task.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-6 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"><FolderKanban size={14}/> Project</div>
            <p className="font-semibold text-slate-800">{task.project?.name}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"><Tag size={14}/> Category</div>
            <p className="font-semibold text-slate-800 capitalize">{task.category}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"><Calendar size={14}/> Deadline</div>
            <p className="font-semibold text-slate-800">{new Date(task.deadLine).toLocaleDateString()}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5"><User size={14}/> Assigned By</div>
            <p className="font-semibold text-slate-800">{task.assignedBy?.name}</p>
          </div>
        </div>

        {/* Status Flow */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-900">Update Task Status</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFlow.map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={task.status === s}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border-2 ${
                  task.status === s
                    ? `${statusColors[s]} ring-4 ring-offset-2 ring-slate-200 scale-105 border-transparent shadow-md`
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:-translate-y-1 hover:shadow-md'
                } disabled:cursor-default disabled:opacity-100 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-white`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      {/* Activity / Comments */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-slate-400" /> Activity Details
          </h2>
          <span className="bg-slate-50 text-slate-600 border border-slate-200 font-bold px-3 py-1 rounded-full text-xs">{comments.length} updates</span>
        </div>

        <form onSubmit={handleComment} className="flex gap-3 mb-8">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add an update, note, or comment..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full px-6 py-3 font-medium outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20"
          />
          <button type="submit" disabled={!commentText.trim()} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500 disabled:cursor-not-allowed">
            <Send size={16} /> Post
          </button>
        </form>

        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">No activity logged yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-4 group">
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-full flex items-center justify-center text-sm shrink-0 shadow-sm">{c.user?.name?.charAt(0).toUpperCase()}</div>
                <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{c.user?.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{c.user?.role}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
