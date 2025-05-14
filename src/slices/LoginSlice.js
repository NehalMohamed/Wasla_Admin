import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;
const initialState = {
  Token: "",
  User: {},
  errors: null,
  loading: false,
};
//normal login
export const LoginUser = createAsyncThunk(
  "LoginUser",
  async (payload, thunkAPI) => {
    var response = await axios
      .post(BASE_URL_AUTH + "/LoginUser", payload)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //start Login
    builder.addCase(LoginUser.pending, (state, action) => {
      state.User = null;
      state.loading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      if (action.payload.status != null && action.payload.status != 200) {
        state.User = null;
        state.loading = false;
        state.errors = JSON.stringify(action.payload.errors);
      } else {
        state.User = action.payload;
        state.loading = false;
        localStorage.setItem("token", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.User = null;
      state.loading = false;
    });

    //end login
  },
});
export default loginSlice.reducer;
