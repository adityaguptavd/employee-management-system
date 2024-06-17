import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { fDate } from 'src/utils/format-time';
import { Avatar } from '@mui/material';
import { base64ToUrl } from 'src/utils/url';

// ----------------------------------------------------------------------

export default function ApplicationTableRow({
  selected,
  employeeId,
  profilePic,
  employeeName,
  leaveType,
  from,
  to,
  reason,
  status,
  document,
  handleClick,
}) {

  const [pic, setPic] = useState('');
  const [doc, setDoc] = useState('');

  useEffect(() => {
    if (profilePic) {
      const profile = base64ToUrl(profilePic);
      setPic(profile);
    }
    if (document) {
      const docUrl = base64ToUrl(document);
      setDoc(docUrl);
    }
  }, [profilePic, document]);

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} >
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={(pic)} alt={employeeName} />
            <Typography variant="subtitle2" noWrap>
              {employeeName}
            </Typography>
          </Stack>
        </TableCell>

      <TableCell>{employeeId}</TableCell>
      <TableCell>{leaveType}</TableCell>

      <TableCell>{fDate(from, 'dd/MM/yyyy')}</TableCell>
      <TableCell>{fDate(to, 'dd/MM/yyyy')}</TableCell>

      <TableCell>{reason}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        {document ? (
          <Stack direction="row" spacing={2}>
            <Avatar src={doc} alt="Document" />
            <Button onClick={() => window.open(doc, '_blank')}>View</Button>
          </Stack>
        ) : (
          <>No document!</>
        )}
      </TableCell>
    </TableRow>
  );
}

ApplicationTableRow.propTypes = {
  // removeEmployee: PropTypes.func,
  handleClick: PropTypes.func,
  employeeId: PropTypes.string,
  employeeName: PropTypes.string,
  profilePic: PropTypes.any,
  leaveType: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  reason: PropTypes.string,
  status: PropTypes.string,
  document: PropTypes.any,
  selected: PropTypes.any,
};
