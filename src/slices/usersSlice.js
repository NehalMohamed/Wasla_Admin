import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_AUTH_API_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/GetUsers`);
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUsersWithRoles = createAsyncThunk(
  "users/GetUsersGrp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/GetUsersGrp`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    UsersList: [],
    loading: false,
    error: null,
    searchRole: "",
  },
  reducers: {
    setSearchRole: (state, action) => {
      state.searchRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(fetchUsersWithRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.UsersList = action.payload;
      })
      .addCase(fetchUsersWithRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export const { setSearchRole } = usersSlice.actions;
export default usersSlice.reducer;
