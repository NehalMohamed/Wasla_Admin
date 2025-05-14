import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchParentProducts = createAsyncThunk(
  'products/fetchParentProducts',
  async () => {
    const response = await axios.post(`${API_URL}/GetProduct`, {
      parent: 0,
      active: true
    });
    return response.data;
  }
);

export const fetchProductTree = createAsyncThunk(
  'products/fetchProductTree',
  async () => {
    const response = await axios.post(`${API_URL}/GetProduct_Tree`);
    return response.data;
  }
);

export const saveProduct = createAsyncThunk(
  'products/saveProduct',
  async (productData) => {
    const response = await axios.post(`${API_URL}/SaveProduct`, productData);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    parentProducts: [],
    productTree: [],
    status: 'idle',
    error: null,
    successMessage: null,
    errorMessage: null
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parent Products
      .addCase(fetchParentProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParentProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parentProducts = action.payload;
      })
      .addCase(fetchParentProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch Product Tree
      .addCase(fetchProductTree.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductTree.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productTree = action.payload;
      })
      .addCase(fetchProductTree.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Save Product
      .addCase(saveProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.productId 
          ? 'Service updated successfully!' 
          : 'Service created successfully!';
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message;
      });
  }
});

export const { clearMessages } = productSlice.actions;
export default productSlice.reducer;