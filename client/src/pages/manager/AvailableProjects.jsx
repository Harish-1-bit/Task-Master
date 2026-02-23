import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAvailableProjects,
  selectProject,
  reset,
} from "../../features/project/projectSlice";
import Loader from "../../components/Loader";
import { Search, Calendar, DollarSign, Tag, CheckCircle2 } from "lucide-react";

export default function AvailableProjects() {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getAvailableProjects());
    return () => dispatch(reset());
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [projectToSelect, setProjectToSelect] = useState(null);

  const handleSelect = (id) => {
    setProjectToSelect(id);
    setShowModal(true);
  };

  const confirmSelection = () => {
    if (projectToSelect) {
      dispatch(selectProject(projectToSelect));
    }
    setShowModal(false);
    setProjectToSelect(null);
  };

  const cancelSelection = () => {
    setShowModal(false);
    setProjectToSelect(null);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Search size={18} />
            </span>
            Project Board
          </h1>
          <p className="text-sm text-slate-500 mt-1 pl-10">
            Browse and select available projects to manage.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <Search
            className="w-12 h-12 text-slate-300 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            No open projects
          </h3>
          <p className="text-slate-500 text-sm">
            There are currently no projects available for assignment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full border-t-8 border-t-sky-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-1.5">
                    {p.name}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-slate-400" /> {p.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />{" "}
                    {new Date(p.deadLine).toLocaleDateString()}
                  </span>
                  {p.budget > 0 && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-slate-400" /> ₹
                      {p.budget}
                    </span>
                  )}
                </div>

                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 mt-2">
                  <button
                    onClick={() => handleSelect(p._id)}
                    className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium focus:ring-2 focus:ring-sky-500/50 flex justify-center items-center gap-2 shadow-sm transition-all duration-200"
                  >
                    <CheckCircle2 size={16} /> Take Ownership
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Take Ownership
              </h3>
              <p className="text-slate-500 text-sm">
                Are you sure you want to take ownership of this project? It will
                be assigned to you and moved to your active projects dashboard.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={cancelSelection}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl shadow-sm transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
