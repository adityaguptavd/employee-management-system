import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import { base64ToUrl } from 'src/utils/url';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  employeeId,
  name,
  profilePic,
  department,
  role,
  salary,
  finalAmount,
  handleClick,
}) {
  const router = useRouter();

  const [pic, setPic] = useState('');

  const redirect = (event) => {
    if(!event.target.closest('.checkbox-cell')){
      router.push(`/user/${id}`);
    }
  }

  // const profileBase64 = Buffer.from(profilePic).toString('base64');
  useEffect(() => {
    const profile = base64ToUrl(profilePic);
    setPic(profile);
  }, [profilePic]);

  return (
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={redirect} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} className="checkbox-cell" />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={(pic)} alt={name} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{employeeId}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>{department}</TableCell>

        <TableCell align="center">
          <Label>{salary.toFixed(2)}</Label>
        </TableCell>
        <TableCell align="center">
          <Label>₹{finalAmount.toFixed(2)}</Label>
        </TableCell>
      </TableRow>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  employeeId: PropTypes.any,
  profilePic: PropTypes.any,
  department: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  salary: PropTypes.number,
  finalAmount: PropTypes.number,
};
