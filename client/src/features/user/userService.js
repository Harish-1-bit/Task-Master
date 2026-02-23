import axios from "axios";

const getAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Admin endpoints
const getAllUsers = async (token) =>
  (await axios.get(`/api/admin/users`, getAuth(token))).data;
const getUser = async (id, token) =>
  (await axios.get(`/api/admin/users/${id}`, getAuth(token))).data;
const changeUserRole = async ({ id, role }, token) =>
  (await axios.put(`/api/admin/users/role/${id}`, { role }, getAuth(token)))
    .data;
const changeUserStatus = async (id, token) =>
  (await axios.put(`/api/admin/users/status/${id}`, {}, getAuth(token))).data;

// Manager endpoints
const getEmployees = async (token) =>
  (await axios.get("/api/manager/employees", getAuth(token))).data;

const userService = {
  getAllUsers,
  getUser,
  changeUserRole,
  changeUserStatus,
  getEmployees,
};
export default userService;
