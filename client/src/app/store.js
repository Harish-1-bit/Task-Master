import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    task: taskReducer,
    user: userReducer,
  },
});

export default store;
