import { configureStore } from "@reduxjs/toolkit";
import { workshopApi } from "./features/workshopApi";
import { favoritesApi } from "./features/favoritesSlice";

export const store = configureStore({
  reducer: {
    [workshopApi.reducerPath]: workshopApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(workshopApi.middleware)
      .concat(favoritesApi.middleware),
});
