import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const uploadAttendanceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  reducerPath: 'uploadAttendanceApi',
  tagTypes: ['Upload Attendance'],
  endpoints: (build) => ({
    uploadAttendance: build.mutation({
      query: ({ token, body }) => ({
        url: '/attendance/uploadAttendance',
        method: 'POST',
        body,
        headers: { token },
      }),
    }),
  }),
});

export const fetchAttendanceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  reducerPath: 'fetchAttendanceApi',
  tagTypes: ['Fetch Attendance'],
  endpoints: (build) => ({
    fetchAttendance: build.query({
      query: ({ token, id }) => ({
        url: `/attendance/fetchAttendance/${id}`,
        method: 'GET',
        headers: { token },
      }),
    }),
  }),
});

export const switchAttendanceStatusApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  reducerPath: 'switchAttendanceStatusApi',
  tagTypes: ['Switch Attendance Status'],
  endpoints: (build) => ({
    switchAttendanceStatus: build.mutation({
      query: ({ token, body, id }) => ({
        url: `/attendance/switchAttendanceStatus/${id}`,
        method: 'PATCH',
        body,
        headers: { 'content-type': 'application/json', token },
      }),
    }),
  }),
});

export const { useUploadAttendanceMutation } = uploadAttendanceApi;
export const { useFetchAttendanceQuery } = fetchAttendanceApi;
export const { useSwitchAttendanceStatusMutation } = switchAttendanceStatusApi;
