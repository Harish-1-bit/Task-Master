import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, reset } from '../../features/project/projectSlice';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, AlertCircle } from 'lucide-react';

export default function CreateProject() {
  const [form, setForm] = useState({ name: '', description: '', category: '', priority: 'medium', deadLine: '', budget: 0, tags: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message } = useSelector((state) => state.project);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    const result = dispatch(createProject(data));
    if (!result.error) {
      dispatch(reset());
      navigate('/admin/projects');
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <FolderPlus className="text-indigo-600" size={28} />
          Launch New Project
        </h1>
        <p className="text-sm text-slate-500 mt-2">Set up a new project workspace and define its initial parameters.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 border-t-4 border-t-indigo-600">
        {isError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            <AlertCircle size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Enterprise Client Portal Redesign" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[120px]" rows={4} placeholder="Detailed overview of the project goals, scope, and deliverables..." required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field bg-white" required>
                <option value="">Select category...</option>
                <option value="e-commerce">E-Commerce</option>
                <option value="saas">SaaS Development</option>
                <option value="portfolio">Corporate Website</option>
                <option value="mobile-app">Mobile Application</option>
                <option value="api">API / Integration</option>
                <option value="other">Other Initiative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority Level</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field bg-white">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical (Blocking)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Deadline <span className="text-red-500">*</span></label>
              <input type="date" value={form.deadLine} onChange={(e) => setForm({ ...form, deadLine: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Budget (₹)</label>
              <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input-field" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags <span className="text-slate-400 font-normal text-xs ml-1">(comma-separated)</span></label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="e.g. react, nodejs, migration, q3" />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" disabled={isLoading} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium rounded-md transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/50 outline-none w-full flex justify-center items-center gap-2 mt-2">
              <FolderPlus size={20} />
              {isLoading ? 'Initializing Project Workspace...' : 'Create Project Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
