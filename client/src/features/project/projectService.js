import axios from "axios";

const getAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Admin endpoints
const createProject = async (data, token) =>
  (await axios.post("/api/admin/projects", data, getAuth(token))).data;
const getAllProjects = async (query = "", token) =>
  (await axios.get(`/api/admin/projects${query}`, getAuth(token))).data;
const getProject = async (id, token) =>
  (await axios.get(`/api/admin/projects/${id}`, getAuth(token))).data;
const updateProject = async ({ id, ...data }, token) =>
  (await axios.put(`/api/admin/projects/${id}`, data, getAuth(token))).data;
const deleteProject = async (id, token) =>
  (await axios.delete(`/api/admin/projects/${id}`, getAuth(token))).data;

// Manager endpoints
const getAvailableProjects = async (token) =>
  (await axios.get("/api/manager/projects/available", getAuth(token))).data;
const selectProject = async (id, token) =>
  (await axios.post(`/api/manager/projects/select/${id}`, {}, getAuth(token)))
    .data;
const releaseProject = async (id, token) =>
  (await axios.post(`/api/manager/projects/release/${id}`, {}, getAuth(token)))
    .data;
const getMyProjects = async (token) =>
  (await axios.get("/api/manager/projects/my", getAuth(token))).data;
const updateProjectStatus = async ({ id, ...data }, token) =>
  (await axios.put(`/api/manager/projects/${id}`, data, getAuth(token))).data;
const getProjectProgress = async (id, token) =>
  (await axios.get(`/api/manager/projects/progress/${id}`, getAuth(token)))
    .data;

const projectService = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getAvailableProjects,
  selectProject,
  releaseProject,
  getMyProjects,
  updateProjectStatus,
  getProjectProgress,
};
export default projectService;
