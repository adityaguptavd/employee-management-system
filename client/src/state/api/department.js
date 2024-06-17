import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const createDepartmentApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "createDepartmentApi",
    tagTypes: ["createDepartment"],
    endpoints: (build) => ({
        createDepartment: build.mutation({
            query: ({token, body}) => ({
                url: `/departments/createDepartment`,
                method: 'POST',
                body,
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const fetchAllDepartmentsApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchAllDepartmentsApi",
    tagTypes: ["fetchAllDepartments"],
    endpoints: (build) => ({
        fetchAllDepartments: build.query({
            query: ({token}) => ({
                url: `/departments/fetchAllDepartments`,
                method: 'GET',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const updateDepartmentApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "updateDepartmentApi",
    tagTypes: ["updateDepartment"],
    endpoints: (build) => ({
        updateDepartment: build.mutation({
            query: ({token, body, id}) => ({
                url: `/departments/updateDepartment/${id}`,
                method: 'PUT',
                body,
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const removeDepartmentApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "removeDepartmentApi",
    tagTypes: ["removeDepartment"],
    endpoints: (build) => ({
        removeDepartment: build.mutation({
            query: ({token, id}) => ({
                url: `/departments/removeDepartment/${id}`,
                method: 'DELETE',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const { useFetchAllDepartmentsQuery } = fetchAllDepartmentsApi;
export const { useCreateDepartmentMutation } = createDepartmentApi;
export const { useUpdateDepartmentMutation } = updateDepartmentApi;
export const {useRemoveDepartmentMutation} = removeDepartmentApi;