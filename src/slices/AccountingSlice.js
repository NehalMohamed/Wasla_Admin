import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";

const BASE_URL = process.env.REACT_APP_ACC_API_URL;

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

// GetAllInvoices
export const GetAllInvoices = createAsyncThunk(
  "accounting/GetAllInvoices",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/GetAllInvoices`,
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

// confirm invoice
export const ConfirmInvoice = createAsyncThunk(
  "accounting/ConfirmInvoice",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/ChangeInvoiceStatus`,
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

//get reports dropdown
export const GetReports_Mains = createAsyncThunk(
  "accounting/GetReports",
  async (_, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/GetReports`,
          {},
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

//get reports dropdown
export const GetReportData = createAsyncThunk(
  "accounting/GetReportData",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/GetReportData`,
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
const AccountingSlice = createSlice({
  name: "accounting",
  initialState: {
    loading: false,
    error: null,
    Invoices: [],
    reports: [],
    reportData: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services data
      .addCase(GetAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.Invoices = action.payload;
      })
      .addCase(GetAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(ConfirmInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ConfirmInvoice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(ConfirmInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetReports_Mains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetReports_Mains.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(GetReports_Mains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(GetReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = AccountingSlice.actions;
export default AccountingSlice.reducer;
