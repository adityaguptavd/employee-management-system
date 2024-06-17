import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DepartmentTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  editDepartment,
  removeDepartment,
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}
      {numSelected === 1 && (
        <Stack direction="row" spacing={2}>
          <Tooltip title="Edit">
            <IconButton onClick={editDepartment}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={removeDepartment}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Toolbar>
  );
}

DepartmentTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  editDepartment: PropTypes.func,
  removeDepartment: PropTypes.func,
};
