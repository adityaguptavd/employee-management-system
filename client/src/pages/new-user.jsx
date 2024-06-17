import { Helmet } from 'react-helmet-async';

import { NewUserView } from 'src/sections/newUser/view';

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return (
    <>
      <Helmet>
        <title> New User | Employee Management System </title>
      </Helmet>

      <NewUserView />
    </>
  );
}