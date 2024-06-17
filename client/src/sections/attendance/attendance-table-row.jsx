import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fTime, fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function AttendanceTableRow({ date, status, daySalary, entryExitTime }) {
  let entryTime = '';
  let exitTime = '';
  entryExitTime.forEach((time, index) => {
    if(index % 2 === 0){
      exitTime += `${fTime(time)} `;
    }
    else if(index % 2 !== 0){
      entryTime += `${fTime(time)} `;
    }
  });

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell component="th" scope="row" padding="none">
        {fDate(date, 'dd/MM/yyyy')}
      </TableCell>

      <TableCell>{status}</TableCell>
      <TableCell>{daySalary.toFixed(2)}</TableCell>
      <TableCell>{entryTime === '' ? '-' : entryTime}</TableCell>
      <TableCell>{exitTime === '' ? '-' : exitTime}</TableCell>
    </TableRow>
  );
}

AttendanceTableRow.propTypes = {
  date: PropTypes.any,
  status: PropTypes.string,
  daySalary: PropTypes.number,
  entryExitTime: PropTypes.array,
};
