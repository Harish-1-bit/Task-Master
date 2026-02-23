import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProject,
  updateProject,
  clearProject,
} from "../../features/project/projectSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Calendar,
  DollarSign,
  Tag,
  Activity,
  Users,
  UserCog,
  ListTodo,
  AlertCircle,
  User,
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { project, isLoading } = useSelector((state) => state.project);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  console.log(project)
  useEffect(() => {
    dispatch(getProject(id));
    return () => dispatch(clearProject());
  }, [dispatch, id]);

  const handleSave = () => {
    dispatch(updateProject({ id, ...form }));
    setEditing(false);
  };

  if (isLoading || !project) return <Loader />;
  const p = project.project;
  const tasks = project.tasks || [];

  return (
    <div className="animate-fade-in pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8 border-t-4 border-t-indigo-600">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex-1">
            {editing ? (
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-2xl font-bold text-slate-900 border-b-2 border-indigo-500 outline-none pb-1 bg-slate-50 px-2"
                placeholder="Project Name"
              />
            ) : (
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {p.name}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-all flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  const p = project?.project;
                  if (p)
                    setForm({
                      name: p.name,
                      description: p.description,
                      category: p.category,
                      status: p.status,
                      priority: p.priority,
                      budget: p.budget,
                      deadLine: p.deadLine?.split("T")[0],
                    });
                  setEditing(true);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-all flex items-center gap-2"
              >
                <Edit2 size={16} /> Edit Project
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field min-h-[120px]"
                  rows={4}
                />
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ListTodo size={16} className="text-slate-400" /> Description
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
                {p.description}
              </p>
            </div>

            <div className="space-y-5 lg:pl-8 lg:border-l border-slate-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Project Details
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Activity size={16} />{" "}
                      <span className="text-sm">Status</span>
                    </div>
                    <span className="font-semibold text-sm capitalize text-slate-900">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <AlertCircle size={16} />{" "}
                      <span className="text-sm">Priority</span>
                    </div>
                    <span className="font-semibold text-sm capitalize text-slate-900">
                      {p.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Tag size={16} />{" "}
                      <span className="text-sm">Category</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={16} />{" "}
                      <span className="text-sm">Deadline</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900">
                      {new Date(p.deadLine).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <DollarSign size={16} />{" "}
                      <span className="text-sm">Budget</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900">
                      ₹{p.budget || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Team
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <UserCog size={16} />{" "}
                      <span className="text-sm">Manager</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900">
                      {p.assignedManager?.name || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={16} />{" "}
                      <span className="text-sm">Employees</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                      {p.assignedEmployees?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Project Tasks
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">
          {tasks.length} tasks
        </span>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-2xl">
          <ListTodo className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">
            No tasks created yet
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow p-5 border-l-4 border-l-indigo-500 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 text-lg mb-1">
                  {t.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />{" "}
                    {t.assignedTo?.name || "Unassigned"}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-slate-400" /> {t.category}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  t.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : t.status === "in-progress"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : t.status === "review"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
