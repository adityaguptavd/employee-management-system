import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const loginApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "loginApi",
    tagTypes: ["Token"],
    endpoints: (build) => ({
        getIdToken: build.mutation({
            query: ({body}) => ({
                url: "/auth/login",
                method: 'POST',
                body,
                headers: {'content-type': 'application/json'},
            }),
            invalidatesTags: ["Token"]
        }),
    })
});

export const { useGetIdTokenMutation } = loginApi;