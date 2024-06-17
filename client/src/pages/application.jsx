import { Helmet } from 'react-helmet-async';

import { ApplicationView } from 'src/sections/application/view';

// ----------------------------------------------------------------------

export default function ApplicationPage() {
  return (
    <>
      <Helmet>
        <title> Application | Employee Management System </title>
      </Helmet>

      <ApplicationView />
    </>
  );
}
