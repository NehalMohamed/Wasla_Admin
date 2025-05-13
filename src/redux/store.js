import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "../slices/questionsSlice";
export const store = configureStore({
  reducer: {
    questions: questionsReducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
