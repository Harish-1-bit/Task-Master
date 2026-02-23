import axios from "axios";

const getAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Manager endpoints
const createTask = async (data, token) =>
  (await axios.post("/api/manager/tasks", data, getAuth(token))).data;
const getManagerTasks = async (query = "", token) =>
  (await axios.get(`/api/manager/tasks${query}`, getAuth(token))).data;
const updateTask = async ({ id, ...data }, token) =>
  (await axios.put(`/api/manager/tasks/${id}`, data, getAuth(token))).data;
const assignTask = async ({ id, employeeId }, token) =>
  (
    await axios.put(
      `/api/manager/tasks/assign/${id}`,
      { employeeId },
      getAuth(token),
    )
  ).data;
const deleteTask = async (id, token) =>
  (await axios.delete(`/api/manager/tasks/${id}`, getAuth(token))).data;

// Employee endpoints
const getMyTasks = async (query = "", token) =>
  (await axios.get(`/api/employee/tasks${query}`, getAuth(token))).data;
const getTask = async (id, token) =>
  (await axios.get(`/api/employee/tasks/${id}`, getAuth(token))).data;
const updateTaskStatus = async ({ id, status }, token) =>
  (
    await axios.put(
      `/api/employee/tasks/status/${id}`,
      { status },
      getAuth(token),
    )
  ).data;
const addComment = async ({ id, text }, token) =>
  (
    await axios.post(
      `/api/employee/tasks/comment/${id}`,
      { text },
      getAuth(token),
    )
  ).data;
const getComments = async (id, token) =>
  (await axios.get(`/api/employee/tasks/comments/${id}`, getAuth(token))).data;

const taskService = {
  createTask,
  getManagerTasks,
  updateTask,
  assignTask,
  deleteTask,
  getMyTasks,
  getTask,
  updateTaskStatus,
  addComment,
  getComments,
};
export default taskService;
