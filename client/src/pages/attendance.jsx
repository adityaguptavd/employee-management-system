import { Helmet } from 'react-helmet-async';

import { AttendanceView } from 'src/sections/attendance/view';

// ----------------------------------------------------------------------

export default function AttendancePage() {
  return (
    <>
      <Helmet>
        <title> Attendance | Employee Management System </title>
      </Helmet>

      <AttendanceView />
    </>
  );
}
