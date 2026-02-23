import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, reset } from "../../features/task/taskSlice";
import { getMyProjects } from "../../features/project/projectSlice";
import { getEmployees } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { PlusSquare, AlertCircle } from "lucide-react";

export default function CreateTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "medium",
    category: "other",
    deadLine: "",
    assignedTo: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message } = useSelector((state) => state.task);
  const { projects } = useSelector((state) => state.project);
  const { employees } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMyProjects());
    dispatch(getEmployees());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.assignedTo) delete data.assignedTo;
    const result = await dispatch(createTask(data));
    if (!result.error) {
      dispatch(reset());
      navigate("/manager/tasks");
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <PlusSquare className="text-emerald-600" size={28} />
          Define New Task
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Create a new task and associate it with a project.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 border-t-8 border-t-emerald-500">
        {isError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            <AlertCircle size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="e.g. Implement authentication flow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field min-h-[120px] focus:ring-emerald-500/20 focus:border-emerald-500"
              rows={4}
              placeholder="Detailed instructions..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Project Association <span className="text-red-500">*</span>
              </label>
              <select
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="input-field bg-white focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              >
                <option value="">Select Target Project...</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Work Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field bg-white focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="frontend">Frontend Engineering</option>
                <option value="backend">Backend Engineering</option>
                <option value="design">UI/UX Design</option>
                <option value="testing">Quality Assurance</option>
                <option value="devops">DevOps & Infrastructure</option>
                <option value="other">Other Activity</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Priority Level
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input-field focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical (Blocking)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Target Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.deadLine}
                onChange={(e) => setForm({ ...form, deadLine: e.target.value })}
                className="input-field focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Assign to Employee{" "}
              <span className="text-xs font-normal text-slate-400 ml-1">
                (Optional)
              </span>
            </label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="input-field focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Leave Unassigned</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-medium rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/50 flex justify-center items-center gap-2"
            >
              <PlusSquare size={20} />
              {isLoading ? "Creating Task..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
