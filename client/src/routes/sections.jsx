import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const NewUserPage = lazy(() => import('src/pages/new-user'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const DepartmentPage = lazy(() => import('src/pages/department'));
export const ApplicationPage = lazy(() => import('src/pages/application'));
export const AdminProfilePage = lazy(() => import('src/pages/admin-profile'));
export const AttendancePage = lazy(() => import('src/pages/attendance'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    { path: 'new', element: <IndexPage /> },
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'user/:id', element: <ProfilePage /> },
        { path: 'department', element: <DepartmentPage /> },
        { path: 'newUser', element: <NewUserPage /> },
        { path: 'profile', element: <AdminProfilePage /> },
        { path: 'application', element: <ApplicationPage /> },
        { path: 'attendance/:name/:id', element: <AttendancePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
