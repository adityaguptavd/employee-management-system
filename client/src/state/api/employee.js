import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

export const createEmployeeApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "createEmployeeApi",
    tagTypes: ["Create Employee"],
    endpoints: (build) => ({
        createEmployee: build.mutation({
            query: ({token, body}) => ({
                url: '/employees/createEmployee',
                method: 'POST',
                body,
                headers: {token},
            }),
        }),
    })
});

export const fetchEmployeeByIdApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchEmployeeByIdApi",
    tagTypes: ["fetchEmployee"],
    endpoints: (build) => ({
        fetchEmployee: build.query({
            query: ({id, token}) => ({
                url: `/employees/fetchEmployeeById/${id}`,
                method: 'GET',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const fetchAllEmployeesApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "fetchAllEmployeesApi",
    tagTypes: ["fetchAllEmployees"],
    endpoints: (build) => ({
        fetchAllEmployees: build.query({
            query: ({token}) => ({
                url: `/employees/fetchAllEmployees`,
                method: 'GET',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const updateEmployeeApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "updateEmployeeApi",
    tagTypes: ["Update Employee"],
    endpoints: (build) => ({
        updateEmployee: build.mutation({
            query: ({token, body, id}) => ({
                url: `/employees/updateEmployee/${id}`,
                method: 'PUT',
                body,
                headers: {token},
            }),
        }),
    })
});

export const removeEmployeeApi = createApi({
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    reducerPath: "removeEmployeeApi",
    tagTypes: ["removeEmployee"],
    endpoints: (build) => ({
        removeEmployee: build.mutation({
            query: ({id, token}) => ({
                url: `/employees/removeEmployee/${id}`,
                method: 'DELETE',
                headers: {'content-type': 'application/json', token},
            }),
        }),
    })
});

export const { useCreateEmployeeMutation } = createEmployeeApi;
export const { useUpdateEmployeeMutation } = updateEmployeeApi;
export const { useFetchEmployeeQuery } = fetchEmployeeByIdApi;
export const { useFetchAllEmployeesQuery } = fetchAllEmployeesApi;
export const { useRemoveEmployeeMutation } = removeEmployeeApi;