import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const fetchAdminSummaryApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchAdminSummaryApi",
    tagTypes: ["Fetch Admin Summary"],
    endpoints: (build) => ({
        fetchAdminSummary: build.query({
            query: ({token}) => ({
                url: '/summary/fetchAdminSummary',
                method: 'GET',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const { useFetchAdminSummaryQuery } = fetchAdminSummaryApi;