import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const  baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/workshop`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token =  localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const workshopsApi = createApi({
    reducerPath: 'workshopsApi',
    baseQuery,
    tagTypes: ['Workshops'],
    endpoints: (builder) =>({
        fetchAllWorkshops: builder.query({
            query: () => "/",
            providesTags: ["Workshops"]
        }),
        fetchWorkshopById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Workshops", id }],
        }),
        addWorkshop: builder.mutation({
            query: (newWorkshop) => ({
                url: `/create-workshop`,
                method: "POST",
                body: newWorkshop
            }),
            invalidatesTags: ["Workshops"]
        }),
        updateWorkshop: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Workshops"]
        }),
        deleteWorkshop: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Workshops"]
        })
    })
})

export const {useFetchAllWorkshopsQuery, useFetchWorkshopByIdQuery, useAddWorkshopMutation, useUpdateWorkshopMutation, useDeleteWorkshopMutation} = workshopsApi;
export default workshopsApi;