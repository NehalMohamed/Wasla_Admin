import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import { checkAUTH } from "../helper/helperFN";
import { history } from "../index";
import api from "../api/axios";
const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get authentication headers
// const getAuthHeaders = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const accessToken = user?.accessToken;
//   return {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   };
// };
// Async thunks
export const fetchParentProducts = createAsyncThunk(
  "products/fetchParentProducts",
  async () => {
    // if (checkAUTH()) {
    const response = await api.post(
      `${API_URL}/GetProduct`,
      {
        parent: 0,
        active: true,
      }
      //getAuthHeaders()
    );
    return response.data;
    // } else {
    //   // Redirect to login if not authenticated
    //   history.push("/");
    //   window.location.reload();
    //   return null;
    // }
  }
);

export const fetchProductTree = createAsyncThunk(
  "products/fetchProductTree",
  async () => {
    // if (checkAUTH()) {
    const response = await api.post(
      `${API_URL}/GetProduct_Tree`,
      {}
      //getAuthHeaders()
    );
    return response.data;
    // } else {
    //   // Redirect to login if not authenticated
    //   history.push("/");
    //   window.location.reload();
    //   return null;
    // }
  }
);

export const saveProduct = createAsyncThunk(
  "products/saveProduct",
  async (productData) => {
    const response = await api.post(
      `${API_URL}/SaveProduct`,
      productData
      //getAuthHeaders()
    );
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    parentProducts: [],
    productTree: [],
    status: "idle",
    error: null,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parent Products
      .addCase(fetchParentProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParentProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parentProducts = action.payload;
      })
      .addCase(fetchParentProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Product Tree
      .addCase(fetchProductTree.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductTree.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productTree = action.payload;
      })
      .addCase(fetchProductTree.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Save Product
      .addCase(saveProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.productId
          ? "Service updated successfully!"
          : "Service created successfully!";
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message;
      });
  },
});

export const { clearMessages } = productSlice.actions;
export default productSlice.reducer;
