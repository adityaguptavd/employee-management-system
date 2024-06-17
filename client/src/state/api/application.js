import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const uploadApplicationApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "uploadApplicationApi",
    tagTypes: ["uploadApplication"],
    endpoints: (build) => ({
        uploadApplication: build.mutation({
            query: ({token, body}) => ({
                url: `/applications/uploadApplication`,
                method: 'POST',
                body,
                headers: {token},
            }),
        }),
    })
});

export const approveLeaveApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "approveLeaveApi",
    tagTypes: ["approveLeave"],
    endpoints: (build) => ({
        approveLeave: build.mutation({
            query: ({token, id}) => ({
                url: `/applications/approveLeave/${id}`,
                method: 'PATCH',
                headers: {token},
            }),
        }),
    })
});

export const rejectLeaveApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "rejectLeaveApi",
    tagTypes: ["rejectLeave"],
    endpoints: (build) => ({
        rejectLeave: build.mutation({
            query: ({token, id}) => ({
                url: `/applications/rejectLeave/${id}`,
                method: 'PATCH',
                headers: {token},
            }),
        }),
    })
});

export const fetchAllApplicationsApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchAllApplicationsApi",
    tagTypes: ["fetchAllApplications"],
    endpoints: (build) => ({
        fetchAllApplications: build.query({
            query: ({token, page, rowsPerPage}) => ({
                url: `/applications/fetchAllApplications/${page}/${rowsPerPage}`,
                method: 'GET',
                headers: {token},
            }),
        }),
    })
});

export const { useUploadApplicationMutation } = uploadApplicationApi;
export const { useFetchAllApplicationsQuery } = fetchAllApplicationsApi;
export const { useApproveLeaveMutation } = approveLeaveApi;
export const { useRejectLeaveMutation } = rejectLeaveApi;
