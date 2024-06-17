import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function DepartmentTableRow({
  selected,
  name,
  description,
  open: openTime,
  close: closeTime,
  pseudoAdmin,
  handleClick,
}) {

  return (
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>


        <TableCell>{description}</TableCell>
        <TableCell>{fTime(openTime)}</TableCell>

        <TableCell>{fTime(closeTime)}</TableCell>

        <TableCell>{pseudoAdmin}</TableCell>
      </TableRow>
  );
}

DepartmentTableRow.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.string,
  description: PropTypes.string,
  open: PropTypes.any,
  close: PropTypes.any,
  pseudoAdmin: PropTypes.bool,
  selected: PropTypes.any,
};
