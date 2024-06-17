import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const updateAdminApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  reducerPath: 'updateAdminApi',
  tagTypes: ['Update Admin'],
  endpoints: (build) => ({
    updateAdmin: build.mutation({
      query: ({ token, body }) => ({
        url: `/admin/updateAdmin`,
        method: 'PATCH',
        body,
        headers: { token },
      }),
    }),
  }),
});

export const { useUpdateAdminMutation } = updateAdminApi;
