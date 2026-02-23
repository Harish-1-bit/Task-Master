import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyProjects,
  releaseProject,
  updateProjectStatus,
  getProjectProgress,
  reset,
} from "../../features/project/projectSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  FolderKanban,
  Users,
  Calendar,
  ArrowRight,
  XCircle,
  ClipboardList,
  Activity,
  MessageSquare,
} from "lucide-react";

export default function MyProjects() {
  const dispatch = useDispatch();
  const { projects, projectProgress, isLoading } = useSelector(
    (state) => state.project,
  );

  useEffect(() => {
    dispatch(getMyProjects());
    return () => dispatch(reset());
  }, [dispatch]);

  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [projectToRelease, setProjectToRelease] = useState(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [activeProjectName, setActiveProjectName] = useState("");

  const handleReleaseClick = (project) => {
    setProjectToRelease(project);
    setShowReleaseModal(true);
  };

  const confirmRelease = () => {
    if (projectToRelease) {
      dispatch(releaseProject(projectToRelease._id));
    }
    setShowReleaseModal(false);
    setProjectToRelease(null);
  };

  const cancelRelease = () => {
    setShowReleaseModal(false);
    setProjectToRelease(null);
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateProjectStatus({ id, status: newStatus }));
  };

  const handleReviewProgress = (project) => {
    dispatch(getProjectProgress(project._id));
    setActiveProjectName(project.name);
    setShowProgressModal(true);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <FolderKanban size={18} />
            </span>
            Active Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1 pl-10">
            Manage projects currently under your ownership.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
          <FolderKanban
            className="w-12 h-12 text-sky-300 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            No active projects
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            You haven't selected any projects to manage yet.
          </p>
          <Link
            to="/manager/projects/available"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-sky-500/50 inline-flex items-center gap-2"
          >
            Browse Board <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full border-l-[6px] border-l-sky-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    {p.name}
                  </h2>
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                    className={`px-2 py-1 flex items-center gap-1 rounded-md text-[11px] font-semibold uppercase tracking-wider cursor-pointer outline-none border-0 ring-0 focus:ring-0 ${
                      p.status === "completed"
                        ? "bg-sky-100 text-sky-700"
                        : p.status === "in-progress"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />{" "}
                    {p.assignedEmployees?.length || 0} Team Members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" /> Due:{" "}
                    {new Date(p.deadLine).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to={`/manager/tasks?projectId=${p._id}`}
                    className="flex-1 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <ClipboardList size={16} /> Manage Tasks
                  </Link>
                  <button
                    onClick={() => handleReviewProgress(p)}
                    className="flex-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Activity size={16} /> Review Progress
                  </button>
                  <button
                    onClick={() => handleReleaseClick(p)}
                    className="px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    title="Release Project"
                  >
                    <XCircle size={16} /> Release
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showReleaseModal && projectToRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <XCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Release Project
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Are you sure you want to release{" "}
                <strong className="text-slate-700">
                  {projectToRelease.name}
                </strong>{" "}
                back to the project board?
              </p>

              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-2">
                <div className="flex flex-col gap-2 text-sm text-rose-800">
                  <span className="font-semibold flex items-center gap-2">
                    <XCircle size={16} /> Data Warning
                  </span>
                  <span>
                    All task assignments within this project will be permanently
                    cleared and reset to "In-Progress" status. Assigned
                    employees will also be removed. The project status will
                    revert to "Open".
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={cancelRelease}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRelease}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl shadow-sm transition-colors"
              >
                Release Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Review Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity className="text-emerald-600" size={20} /> Project
                  Progress
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {activeProjectName}
                </p>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!projectProgress ? (
                <div className="py-12 flex justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Completion Overview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                        <span className="block text-2xl font-bold text-slate-900">
                          {projectProgress.progressStats.total}
                        </span>
                        <span className="text-xs font-medium text-slate-500 mt-1">
                          Total Tasks
                        </span>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center text-emerald-700">
                        <span className="block text-2xl font-bold">
                          {projectProgress.progressStats.completed}
                        </span>
                        <span className="text-xs font-medium mt-1">
                          Completed
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center text-blue-700">
                        <span className="block text-2xl font-bold">
                          {projectProgress.progressStats.inProgress}
                        </span>
                        <span className="text-xs font-medium mt-1">
                          In Progress
                        </span>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center text-purple-700">
                        <span className="block text-2xl font-bold">
                          {projectProgress.progressStats.review}
                        </span>
                        <span className="text-xs font-medium mt-1">
                          In Review
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${projectProgress.progressStats.completionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-right text-xs font-bold tracking-wider text-emerald-600 mt-2">
                      {projectProgress.progressStats.completionPercentage}%
                      Completed
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <MessageSquare size={14} /> Employee Feedback & Updates
                    </h4>
                    {projectProgress.comments.length === 0 ? (
                      <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                        No comments posted by employees yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {projectProgress.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-900">
                                {comment.user?.name}
                              </span>
                              <span className="text-xs font-medium text-slate-400">
                                {new Date(
                                  comment.createdAt,
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(comment.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                              Task: {comment.task?.title}
                            </span>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
