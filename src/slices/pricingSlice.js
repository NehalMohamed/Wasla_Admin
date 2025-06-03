// pricingSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
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
    },
  };
};

// Async thunk for fetching pricing data
export const fetchPricingData = createAsyncThunk(
  'pricing/fetchPricingData',
  async ({ lang, curr_code }, { rejectWithValue }) => {
    if (checkAUTH()) {
        try {
            const packages = {
            "service_id": 0,
            "curr_code": curr_code,
            "lang_code": lang,
            "active": true
            };
        const response = await axios.post(
            `${BASE_URL}/GetPricingPackages`,
            packages,
            getAuthHeaders()
        );
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
        }
    } else {
          // Redirect to login if not authenticated
          history.push("/login");
          window.location.reload();
          return null;
        }
  }
);

// Async thunk for saving pricing package
export const savePricingPackage = createAsyncThunk(
  'pricing/savePricingPackage',
  async (packageData, { rejectWithValue }) => {
   if (checkAUTH()) {
    try {
      const response = await axios.post(
        `${BASE_URL}/SavePricingPackage`,
        packageData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
}else {
          // Redirect to login if not authenticated
          history.push("/login");
          window.location.reload();
          return null;
        }
  }
);

// Async thunk for saving features
export const savePackageFeatures = createAsyncThunk(
  'pricing/savePackageFeatures',
  async ({ id,package_id, feature, lang_code, active }, { rejectWithValue }) => {
   if (checkAUTH()) {
    try {
     
      const formattedFeatures ={
        id,
        package_id,
        feature_name: feature,
        feature_desc: feature,
        lang_code,
        active
      };
      
      const response = await axios.post(
        `${BASE_URL}/SavePricingPKgFeatureLst`,
        formattedFeatures,
         getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
    }else {
          // Redirect to login if not authenticated
          history.push("/login");
          window.location.reload();
          return null;
        }
  }
);

// Async thunk for fetching features
export const fetchPackageFeatures = createAsyncThunk(
  'pricing/fetchPackageFeatures',
  async ({ package_id, lang_code }, { rejectWithValue }) => {
   if (checkAUTH()) {
    try {
      const response = await axios.post(
        `${BASE_URL}/GetPricingPkgFeatures`,
        { package_id, active: true, lang_code },
        getAuthHeaders()
      );
      return { package_id, features: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } 
}else {
          // Redirect to login if not authenticated
          history.push("/login");
          window.location.reload();
          return null;
        }
  }
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: {
    data: [],
    loading: false,
    error: null,
    featuresLoading: false,
    featuresError: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch pricing data
      .addCase(fetchPricingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPricingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save pricing package
      .addCase(savePricingPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePricingPackage.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the package in state.data
      })
      .addCase(savePricingPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save features
      .addCase(savePackageFeatures.pending, (state) => {
        state.featuresLoading = true;
        state.featuresError = null;
      })
      .addCase(savePackageFeatures.fulfilled, (state, action) => {
        state.featuresLoading = false;
        // Update features for the specific package
      })
      .addCase(savePackageFeatures.rejected, (state, action) => {
        state.featuresLoading = false;
        state.featuresError = action.payload;
      })
      
      // Fetch features
      .addCase(fetchPackageFeatures.pending, (state) => {
      state.featuresLoading = true;
      state.featuresError = null;
    })
    .addCase(fetchPackageFeatures.fulfilled, (state, action) => {
      state.featuresLoading = false;
      state.features = action.payload|| [];
    })
    .addCase(fetchPackageFeatures.rejected, (state, action) => {
      state.featuresLoading = false;
      state.featuresError = action.payload;
    });
  }
});

export const { clearError } = pricingSlice.actions;
export default pricingSlice.reducer;