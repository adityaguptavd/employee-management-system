import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const fetchNotificationsApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchNotificationsApi",
    tagTypes: ["Fetch Notifications"],
    endpoints: (build) => ({
        fetchNotifications: build.query({
            query: ({token, page}) => ({
                url: `/notifications/fetchAllNotifications/${page}`,
                method: 'GET',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const markAllNotificationsAsSeenApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "markAllNotificationsAsSeenApi",
    tagTypes: ["Notifications Seen"],
    endpoints: (build) => ({
        markAllNotificationsAsSeen: build.mutation({
            query: ({token}) => ({
                url: "/notifications/markAllNotificationAsSeen",
                method: 'PATCH',
                headers: {'content-type': 'application/json', token},
            }),
        })
    })
})

export const { useFetchNotificationsQuery } = fetchNotificationsApi;
export const { useMarkAllNotificationsAsSeenMutation } = markAllNotificationsAsSeenApi;