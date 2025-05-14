import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "../slices/questionsSlice";
import productReducer from '../slices/productSlice';
export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    products: productReducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
