import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function EmployeeLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
