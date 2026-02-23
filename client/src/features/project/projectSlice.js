import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import projectService from "./projectService";

const initialState = {
  projects: [],
  project: null,
  projectProgress: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Admin
export const createProject = createAsyncThunk(
  "project/create",
  async (data, thunkAPI) => {
    try {
      return await projectService.createProject(
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

export const getAllProjects = createAsyncThunk(
  "project/getAll",
  async (query, thunkAPI) => {
    try {
      return await projectService.getAllProjects(
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

export const getProject = createAsyncThunk(
  "project/getOne",
  async (id, thunkAPI) => {
    try {
      return await projectService.getProject(
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

export const updateProject = createAsyncThunk(
  "project/update",
  async (data, thunkAPI) => {
    try {
      return await projectService.updateProject(
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

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id, thunkAPI) => {
    try {
      return await projectService.deleteProject(
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

// Manager
export const getAvailableProjects = createAsyncThunk(
  "project/available",
  async (_, thunkAPI) => {
    try {
      return await projectService.getAvailableProjects(
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const selectProject = createAsyncThunk(
  "project/select",
  async (id, thunkAPI) => {
    try {
      return await projectService.selectProject(
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

export const releaseProject = createAsyncThunk(
  "project/release",
  async (id, thunkAPI) => {
    try {
      return await projectService.releaseProject(
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

export const getMyProjects = createAsyncThunk(
  "project/my",
  async (_, thunkAPI) => {
    try {
      return await projectService.getMyProjects(
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const updateProjectStatus = createAsyncThunk(
  "project/updateStatus",
  async ({ id, ...data }, thunkAPI) => {
    try {
      return await projectService.updateProjectStatus(
        { id, ...data },
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const getProjectProgress = createAsyncThunk(
  "project/getProgress",
  async (id, thunkAPI) => {
    try {
      return await projectService.getProjectProgress(
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

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearProject: (state) => {
      state.project = null;
      state.projectProgress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.project = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.map((p) =>
          p._id === action.payload.data._id ? action.payload.data : p,
        );
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.filter(
          (p) => p._id !== action.meta.arg,
        );
      })
      .addCase(getAvailableProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvailableProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getAvailableProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(selectProject.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload._id,
        );
      })
      .addCase(releaseProject.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload._id,
        );
      })
      .addCase(getMyProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getMyProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.projects = state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        );
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProjectProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectProgress = action.payload;
      })
      .addCase(getProjectProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
