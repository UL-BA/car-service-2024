import { configureStore } from '@reduxjs/toolkit'
import { workshopApi } from './features/workshopApi'

export const store = configureStore({
  reducer: {
    [workshopApi.reducerPath]: workshopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workshopApi.middleware),
})