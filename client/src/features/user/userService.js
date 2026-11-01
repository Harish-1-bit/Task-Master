import API from "../../utils/api";

const getAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Admin endpoints
const getAllUsers = async (token) =>
  (await API.get(`/admin/users`, getAuth(token))).data;
const getUser = async (id, token) =>
  (await API.get(`/admin/users/${id}`, getAuth(token))).data;
const changeUserRole = async ({ id, role }, token) =>
  (await API.put(`/admin/users/role/${id}`, { role }, getAuth(token)))
    .data;
const changeUserStatus = async (id, token) =>
  (await API.put(`/admin/users/status/${id}`, {}, getAuth(token))).data;

// Manager endpoints
const getEmployees = async (token) =>
  (await API.get("/manager/employees", getAuth(token))).data;

const userService = {
  getAllUsers,
  getUser,
  changeUserRole,
  changeUserStatus,
  getEmployees,
};
export default userService;
