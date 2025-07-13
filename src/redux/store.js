import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/usersSlice";
import questionsReducer from "../slices/questionsSlice";
import productReducer from "../slices/productSlice";
import pricingReducer from "../slices/pricingSlice";
import LoginReducer from "../slices/LoginSlice";
import packagesReducer from "../slices/packagesSlice";
import servicesReducer from "../slices/servicesSlice";
import featuresReducer from "../slices/featuresSlice";
export const store = configureStore({
  reducer: {
    login: LoginReducer,
    questions: questionsReducer,
    products: productReducer, 
    users: usersReducer,
    pricing: pricingReducer,
    packages: packagesReducer,
    services: servicesReducer,
    features: featuresReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
