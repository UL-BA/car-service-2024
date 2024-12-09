import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const workshopApi = createApi({
  reducerPath: 'workshopApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  endpoints: (builder) => ({
    getWorkshops: builder.query({
      query: () => '/workshop',
    }),
  }),
})

export const { useGetWorkshopsQuery } = workshopApi