import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: (userId) => `/favorites/${userId}`,
    }),
    addFavorite: builder.mutation({
      query: ({ userId, itemId }) => ({
        url: "/favorites",
        method: "POST",
        body: { userId, itemId },
      }),
    }),
    removeFavorite: builder.mutation({
      query: ({ userId, itemId }) => ({
        url: "/favorites",
        method: "DELETE",
        body: { userId, itemId },
      }),
    }),
  }),
});


export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
