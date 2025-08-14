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

const getReportHeaders = () => {
  let accessToken = localStorage.getItem("token");
  return {
    responseType: "blob", // IMPORTANT: tells axios to handle binary
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
  };
};
// print summary Invoice
export const PrintSummaryInvoice = createAsyncThunk(
  "accounting/PrintSummaryInvoice",
  async (data, { rejectWithValue }) => {
    let accessToken = localStorage.getItem("token");
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/PrintSummaryInvoice`,
          data,
          getReportHeaders()
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

// print summary Invoice
export const PrintSummaryService = createAsyncThunk(
  "accounting/PrintSummaryService",
  async (data, { rejectWithValue }) => {
    let accessToken = localStorage.getItem("token");
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/PrintSummaryService`,
          data,
          getReportHeaders()
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
const ReportsSlice = createSlice({
  name: "reports",
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
      .addCase(PrintSummaryInvoice.fulfilled, (state, action) => {
        state.loading = false;
        //state.Invoices = action.payload;
        console.log(action.payload);
        const url = window.URL.createObjectURL(new Blob([action.payload]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "InvoiceSummary.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .addCase(PrintSummaryService.fulfilled, (state, action) => {
        state.loading = false;
        //state.Invoices = action.payload;
        console.log(action.payload);
        const url = window.URL.createObjectURL(new Blob([action.payload]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ServiceSummary.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          //state.status = "loading";
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearError } = ReportsSlice.actions;
export default ReportsSlice.reducer;
