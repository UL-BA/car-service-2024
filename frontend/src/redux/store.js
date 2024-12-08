import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import workshopsApi from './features/workshops/workshopsApi'
import ordersApi from './features/orders/ordersApi'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [workshopsApi.reducerPath]: workshopsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workshopsApi.middleware, ordersApi.middleware),
})