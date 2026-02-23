import axios from 'axios';

const register = async (userData) => {
  const { data } = await axios.post('/api/auth/register', userData);
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

const login = async (userData) => {
  const { data } = await axios.post('/api/auth/login', userData);
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

const getMe = async (token) => {
  try {
    const { data } = await axios.get('/api/auth/me', {
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
