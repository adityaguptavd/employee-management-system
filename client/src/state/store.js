import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { loginApi } from './api/auth';
import userReducer from './user/userSlice';
import { fetchAdminSummaryApi } from './api/summary';
import { fetchAllDepartmentsApi, createDepartmentApi, updateDepartmentApi, removeDepartmentApi } from './api/department';
import { fetchNotificationsApi, markAllNotificationsAsSeenApi } from './api/notification';
import {
  createEmployeeApi,
  removeEmployeeApi,
  fetchEmployeeByIdApi,
  fetchAllEmployeesApi,
  updateEmployeeApi,
} from './api/employee';
import { fetchAttendanceApi, uploadAttendanceApi, switchAttendanceStatusApi } from './api/attendance';
import {
  approveLeaveApi,
  fetchAllApplicationsApi,
  rejectLeaveApi,
  uploadApplicationApi,
} from './api/application';
import { updateAdminApi } from './api/admin';

const apis = [
  loginApi,
  updateAdminApi,
  createEmployeeApi,
  fetchEmployeeByIdApi,
  fetchAllEmployeesApi,
  removeEmployeeApi,
  updateEmployeeApi,
  fetchAdminSummaryApi,
  createDepartmentApi,
  fetchAllDepartmentsApi,
  updateDepartmentApi,
  removeDepartmentApi,
  fetchNotificationsApi,
  markAllNotificationsAsSeenApi,
  uploadAttendanceApi,
  uploadApplicationApi,
  switchAttendanceStatusApi,
  fetchAttendanceApi,
  fetchAllApplicationsApi,
  approveLeaveApi,
  rejectLeaveApi,
];

const store = configureStore({
  reducer: {
    user: userReducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [updateAdminApi.reducerPath]: updateAdminApi.reducer,
    [createEmployeeApi.reducerPath]: createEmployeeApi.reducer,
    [fetchEmployeeByIdApi.reducerPath]: fetchEmployeeByIdApi.reducer,
    [fetchAllEmployeesApi.reducerPath]: fetchAllEmployeesApi.reducer,
    [updateEmployeeApi.reducerPath]: updateEmployeeApi.reducer,
    [removeEmployeeApi.reducerPath]: removeEmployeeApi.reducer,
    [createDepartmentApi.reducerPath]: createDepartmentApi.reducer,
    [fetchAllDepartmentsApi.reducerPath]: fetchAllDepartmentsApi.reducer,
    [updateDepartmentApi.reducerPath]: updateDepartmentApi.reducer,
    [removeDepartmentApi.reducerPath]: removeDepartmentApi.reducer,
    [fetchAdminSummaryApi.reducerPath]: fetchAdminSummaryApi.reducer,
    [fetchNotificationsApi.reducerPath]: fetchNotificationsApi.reducer,
    [markAllNotificationsAsSeenApi.reducerPath]: markAllNotificationsAsSeenApi.reducer,
    [uploadAttendanceApi.reducerPath]: uploadAttendanceApi.reducer,
    [fetchAttendanceApi.reducerPath]: fetchAttendanceApi.reducer,
    [switchAttendanceStatusApi.reducerPath]: switchAttendanceStatusApi.reducer,
    [uploadApplicationApi.reducerPath]: uploadApplicationApi.reducer,
    [fetchAllApplicationsApi.reducerPath]: fetchAllApplicationsApi.reducer,
    [approveLeaveApi.reducerPath]: approveLeaveApi.reducer,
    [rejectLeaveApi.reducerPath]: rejectLeaveApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apis.flatMap((api) => api.middleware)),
});

setupListeners(store.dispatch);

export default store;
