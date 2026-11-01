import API from "../../utils/api";

const getAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Manager endpoints
const createTask = async (data, token) =>
  (await API.post("/manager/tasks", data, getAuth(token))).data;
const getManagerTasks = async (query = "", token) =>
  (await API.get(`/manager/tasks${query}`, getAuth(token))).data;
const updateTask = async ({ id, ...data }, token) =>
  (await API.put(`/manager/tasks/${id}`, data, getAuth(token))).data;
const assignTask = async ({ id, employeeId }, token) =>
  (
    await API.put(
      `/manager/tasks/assign/${id}`,
      { employeeId },
      getAuth(token),
    )
  ).data;
const deleteTask = async (id, token) =>
  (await API.delete(`/manager/tasks/${id}`, getAuth(token))).data;

// Employee endpoints
const getMyTasks = async (query = "", token) =>
  (await API.get(`/employee/tasks${query}`, getAuth(token))).data;
const getTask = async (id, token) =>
  (await API.get(`/employee/tasks/${id}`, getAuth(token))).data;
const updateTaskStatus = async ({ id, status }, token) =>
  (
    await API.put(
      `/employee/tasks/status/${id}`,
      { status },
      getAuth(token),
    )
  ).data;
const addComment = async ({ id, text }, token) =>
  (
    await API.post(
      `/employee/tasks/comment/${id}`,
      { text },
      getAuth(token),
    )
  ).data;
const getComments = async (id, token) =>
  (await API.get(`/employee/tasks/comments/${id}`, getAuth(token))).data;

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
