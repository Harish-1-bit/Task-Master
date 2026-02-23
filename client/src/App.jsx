import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './features/auth/authSlice';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

import Login from './pages/Login';
import Register from './pages/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminProjectDetail from './pages/admin/ProjectDetail';
import AdminCreateProject from './pages/admin/CreateProject';
import AdminUsers from './pages/admin/Users';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import AvailableProjects from './pages/manager/AvailableProjects';
import MyProjects from './pages/manager/MyProjects';
import ManagerTasks from './pages/manager/Tasks';
import CreateTask from './pages/manager/CreateTask';
import Employees from './pages/manager/Employees';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MyTasks from './pages/employee/MyTasks';
import TaskDetail from './pages/employee/TaskDetail';

function AppRoutes() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAuth =() => {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null' && !user) {
        dispatch(getMe());
      }
      setIsInitializing(false);
    };
    checkAuth();
  }, [dispatch, user]); // run once on initialization

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminCreateProject />} />
        <Route path="projects/:id" element={<AdminProjectDetail />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Manager */}
      <Route path="/manager" element={<ProtectedRoute roles={['manager']}><ManagerLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="projects/available" element={<AvailableProjects />} />
        <Route path="projects/my" element={<MyProjects />} />
        <Route path="tasks" element={<ManagerTasks />} />
        <Route path="tasks/new" element={<CreateTask />} />
        <Route path="employees" element={<Employees />} />
      </Route>

      {/* Employee */}
      <Route path="/employee" element={<ProtectedRoute roles={['employee']}><EmployeeLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
