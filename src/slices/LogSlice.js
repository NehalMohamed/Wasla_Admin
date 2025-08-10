import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";

const BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to get authentication headers
const getAuthHeaders = () => {
  let accessToken = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
  };
};

// get log table data which contain all tables transactions (insert, update, delete)
export const GetAudit_Logs = createAsyncThunk(
  "log/GetAudit_Logs",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/GetAudit_Logs`,
          data,
          getAuthHeaders()
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    } else {
      // Redirect to login if not authenticated
      history.push("/");
      window.location.reload();
      return null;
    }
  }
);

const LogSlice = createSlice({
  name: "transactions",
  initialState: {
    loading: false,
    error: null,
    Data: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services data
      .addCase(GetAudit_Logs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAudit_Logs.fulfilled, (state, action) => {
        state.loading = false;
        state.Data = action.payload;
      })
      .addCase(GetAudit_Logs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = LogSlice.actions;
export default LogSlice.reducer;
