import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  users: [],
  employees: [],
  dashboard: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, thunkAPI) => {
    try {
      return await userService.getAllUsers(
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

export const changeUserRole = createAsyncThunk(
  "user/changeRole",
  async (data, thunkAPI) => {
    try {
      return await userService.changeUserRole(
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

export const changeUserStatus = createAsyncThunk(
  "user/changeStatus",
  async (id, thunkAPI) => {
    try {
      return await userService.changeUserStatus(
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

export const getEmployees = createAsyncThunk(
  "user/getEmployees",
  async (_, thunkAPI) => {
    try {
      return await userService.getEmployees(
        thunkAPI.getState().auth.user?.token,
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message,
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users = state.users.map((u) =>
          u._id === action.payload._id
            ? { ...u, role: action.payload.role }
            : u,
        );
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u,
        );
      })
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
