// pricingSlice.js
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

//services dropdown data
export const fetchMainServices = createAsyncThunk(
  "fetchMainServices",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getMainServices", payload, getAuthHeaders())
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/login");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);
////packages dropdown data

export const fetchMainPackages = createAsyncThunk(
  "fetchMainPackages",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getMainPackages", payload, getAuthHeaders())
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/login");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);

//assign price to package
export const AssignPriceToPackage = createAsyncThunk(
  "AssignPriceToPackage",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/AssignPriceToPackage`,
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
////packages data with service grouping

export const getServiceGrpWithPkgs = createAsyncThunk(
  "getServiceGrpWithPkgs",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getServiceGrpWithPkgs", {}, getAuthHeaders())
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/login");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);
//edit & save main package
export const SaveMainPackage = createAsyncThunk(
  "SaveMainPackage",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/SaveMainPackage`,
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
// Async thunk for saving pricing package
export const AssignPackagesToService = createAsyncThunk(
  "AssignPackagesToService",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/AssignPackagesToService`,
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

//fetch prices with currency for specific package
export const getServicePackagePrice = createAsyncThunk(
  "getServicePackagePrice",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getServicePackagePrice", payload, getAuthHeaders())
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);

//fetch features for specific package
export const getPackageFeatures = createAsyncThunk(
  "getPackageFeatures",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getPackageFeatures", payload, getAuthHeaders())
        .then((res) => {
          console.log("res ", res);
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);

//fetch features dropdown
export const getMainFeatures = createAsyncThunk(
  "getMainFeatures",
  async (payload, thunkAPI) => {
    if (checkAUTH()) {
      var response = await axios
        .post(BASE_URL + "/getMainFeatures", {}, getAuthHeaders())
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          if (error.response.status == 401) {
            history.push("/");
            window.location.reload();
          } else {
            return error.response.data;
          }
        });
      return response;
    } else {
      history.push("/");
      window.location.reload();
    }
  }
);

// Async thunk for assign feature to package
export const AssignFeaturesToPackage = createAsyncThunk(
  "AssignFeaturesToPackage",
  async (data, { rejectWithValue }) => {
    if (checkAUTH()) {
      try {
        const response = await axios.post(
          `${BASE_URL}/AssignFeaturesToPackage`,
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
const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    services: [],
    packages: [],
    PackagesWithService: [],
    loading: false,
    error: null,
    Prices: [],
    Features: [],
    PackageFeatures: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services data
      .addCase(fetchMainServices.pending, (state) => {
        console.log("loadingggggg ");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainServices.fulfilled, (state, action) => {
        console.log("rrrr ", action.payload);
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchMainServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMainPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchMainPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServiceGrpWithPkgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceGrpWithPkgs.fulfilled, (state, action) => {
        state.loading = false;
        state.PackagesWithService = action.payload;
      })
      .addCase(getServiceGrpWithPkgs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign Packages To Service
      .addCase(AssignPackagesToService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AssignPackagesToService.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the package in state.data
      })
      .addCase(AssignPackagesToService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign prices with currency To package
      .addCase(AssignPriceToPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AssignPriceToPackage.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the package in state.data
      })
      .addCase(AssignPriceToPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get prices
      .addCase(getServicePackagePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicePackagePrice.fulfilled, (state, action) => {
        state.loading = false;
        state.Prices = action.payload;
      })
      .addCase(getServicePackagePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get features for package
      .addCase(getPackageFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackageFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.PackageFeatures = action.payload;
      })
      .addCase(getPackageFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get features dropdown
      .addCase(getMainFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMainFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.Features = action.payload;
      })
      .addCase(getMainFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign featuresTo package
      .addCase(AssignFeaturesToPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AssignFeaturesToPackage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(AssignFeaturesToPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = packagesSlice.actions;
export default packagesSlice.reducer;
