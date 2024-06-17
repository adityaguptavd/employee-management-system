import { Helmet } from 'react-helmet-async';

import { AdminProfileView } from 'src/sections/adminProfile/view';

// ----------------------------------------------------------------------

export default function AdminProfilePage() {
  return (
    <>
      <Helmet>
        <title> Admin Profile | Employee Management System </title>
      </Helmet>

      <AdminProfileView />
    </>
  );
}
