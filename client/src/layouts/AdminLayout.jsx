import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 relative z-10 lg:max-w-[calc(100vw-16rem)] w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              TaskMaster<span className="text-indigo-600">.</span>
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="w-full mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
