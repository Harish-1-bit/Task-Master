import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  task: null,
  comments: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Manager
export const createTask = createAsyncThunk(
  "task/create",
  async (data, thunkAPI) => {
    try {
      return await taskService.createTask(
        data,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const getManagerTasks = createAsyncThunk(
  "task/managerGetAll",
  async (query, thunkAPI) => {
    try {
      return await taskService.getManagerTasks(
        query,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "task/update",
  async (data, thunkAPI) => {
    try {
      return await taskService.updateTask(
        data,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const assignTask = createAsyncThunk(
  "task/assign",
  async (data, thunkAPI) => {
    try {
      return await taskService.assignTask(
        data,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id, thunkAPI) => {
    try {
      return await taskService.deleteTask(
        id,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

// Employee
export const getMyTasks = createAsyncThunk(
  "task/myTasks",
  async (query, thunkAPI) => {
    try {
      return await taskService.getMyTasks(
        query,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const getTask = createAsyncThunk("task/getOne", async (id, thunkAPI) => {
  try {
    return await taskService.getTask(id, thunkAPI.getState().auth.user?.token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateTaskStatus = createAsyncThunk(
  "task/updateStatus",
  async (data, thunkAPI) => {
    try {
      return await taskService.updateTaskStatus(
        data,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "task/addComment",
  async (data, thunkAPI) => {
    try {
      return await taskService.addComment(
        data,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const getComments = createAsyncThunk(
  "task/getComments",
  async (id, thunkAPI) => {
    try {
      return await taskService.getComments(
        id,
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearTask: (state) => {
      state.task = null;
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getManagerTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getManagerTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getManagerTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        );
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.filter((t) => t._id !== action.meta.arg);
      })
      .addCase(getMyTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.task = action.payload.task;
        state.comments = action.payload.comments;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.task = action.payload;
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.comments.unshift(action.payload);
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      });
  },
});

export const { reset, clearTask } = taskSlice.actions;
export default taskSlice.reducer;
