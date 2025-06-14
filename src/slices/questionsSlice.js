import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";
// Base API URL from environment variables
const BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to get authentication headers
const getAuthHeaders = () => {
  let accessToken = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
};
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/getAdminQuesList`,
          {
            lang: "all",
          },
          getAuthHeaders()
        );
        return response.data.sort((a, b) => a.ques_id - b.ques_id);
      } catch (err) {
        return rejectWithValue("Failed to fetch questions.");
      }
    } else {
      // Redirect to login if not authenticated
      history.push("/");
      window.location.reload();
      return null;
    }
  }
);

export const saveQuestion = createAsyncThunk(
  "questions/saveQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/saveQuestions`, payload, getAuthHeaders());
      return payload;
    } catch {
      return rejectWithValue("Failed to save question.");
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (entry, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/deleteQuestions`, entry, getAuthHeaders());
      return entry.ques_id;
    } catch {
      return rejectWithValue("Failed to delete question.");
    }
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    data: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveQuestion.fulfilled, (state) => {
        // We'll refetch questions from the component
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.data = state.data.filter((q) => q.ques_id !== action.payload);
      });
  },
});

export default questionsSlice.reducer;
