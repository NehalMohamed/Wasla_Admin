// packagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";
import api from "../api/axios";

const API_URL = process.env.REACT_APP_API_URL;

// const getAuthHeaders = () => {
//     let accessToken = localStorage.getItem("token");
//     return {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//             "Accept-Language": "en",
//         },
//     };
// };

export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async (_, { rejectWithValue }) => {
    // if (checkAUTH()) {
    try {
      const response = await api.post(
        `${API_URL}/getMainPackages`,
        { isDropDown: false }
        //getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
    // } else {
    //   history.push("/");
    //   window.location.reload();
    //   return null;
    // }
  }
);

export const savePackage = createAsyncThunk(
  "packages/savePackage",
  async (packageData, { rejectWithValue }) => {
    // if (checkAUTH()) {
    try {
      const response = await api.post(
        `${API_URL}/SaveMainPackage`,
        packageData
        //getAuthHeaders()
      );

      if (response.data.errors) {
        return rejectWithValue(response.data.errors);
      }

      return { ...packageData, id: response.data.idOut };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(errorMessage);
    }
    // } else {
    //   history.push("/");
    //   window.location.reload();
    //   return null;
    // }
  }
);

export const savePackageTranslation = createAsyncThunk(
  "packages/savePackageTranslation",
  async (translationData, { rejectWithValue }) => {
    // if (checkAUTH()) {
    try {
      const response = await api.post(
        `${API_URL}/SavePackageTranslations`,
        translationData
        //getAuthHeaders()
      );

      if (response.data.errors) {
        return rejectWithValue(response.data.errors);
      }

      return { ...translationData, id: response.data.idOut };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(errorMessage);
    }
    // } else {
    //   history.push("/");
    //   window.location.reload();
    //   return null;
    // }
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    currentPackage: null,
    saveStatus: "idle",
    saveError: null,
    translationStatus: "idle",
    translationError: null,
  },
  reducers: {
    setCurrentPackage: (state, action) => {
      state.currentPackage = action.payload;
    },
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
    resetSaveStatus: (state) => {
      state.saveStatus = "idle";
      state.saveError = null;
    },
    resetTranslationStatus: (state) => {
      state.translationStatus = "idle";
      state.translationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(savePackage.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(savePackage.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        const existingIndex = state.items.findIndex(
          (p) => p.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.currentPackage = action.payload;
      })
      .addCase(savePackage.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload || action.error.message;
      })

      .addCase(savePackageTranslation.pending, (state) => {
        state.translationStatus = "loading";
        state.translationError = null;
      })
      .addCase(savePackageTranslation.fulfilled, (state, action) => {
        state.translationStatus = "succeeded";
        if (state.currentPackage) {
          const translationIndex =
            state.currentPackage.package_translations?.findIndex(
              (t) => t.id === action.payload.id
            );

          if (action.payload.delete) {
            state.currentPackage.package_translations =
              state.currentPackage.package_translations?.filter(
                (t) => t.id !== action.payload.id
              );
          } else if (translationIndex >= 0) {
            state.currentPackage.package_translations[translationIndex] =
              action.payload;
          } else {
            state.currentPackage.package_translations = [
              ...(state.currentPackage.package_translations || []),
              action.payload,
            ];
          }
        }
      })
      .addCase(savePackageTranslation.rejected, (state, action) => {
        state.translationStatus = "failed";
        state.translationError = action.payload || action.error.message;
      });
  },
});

export const {
  setCurrentPackage,
  clearCurrentPackage,
  resetSaveStatus,
  resetTranslationStatus,
} = packagesSlice.actions;

export default packagesSlice.reducer;
