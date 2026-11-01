import API from "../../utils/api";

const register = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

const login = async (userData) => {
  const { data } = await API.post('/auth/login', userData);
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

const getMe = async (token) => {
  try {
    const { data } = await API.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { ...data, token };
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const authService = { register, login, getMe, logout };
export default authService;
