import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "../slices/questionsSlice";
import productReducer from "../slices/productSlice";
import LoginReducer from "../slices/LoginSlice";
export const store = configureStore({
  reducer: {
    login: LoginReducer,
    questions: questionsReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
