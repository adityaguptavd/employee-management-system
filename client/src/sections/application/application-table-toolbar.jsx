import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import {LoadingButton} from '@mui/lab'
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { CircularProgress, useTheme } from '@mui/material';
import { useApproveLeaveMutation, useRejectLeaveMutation } from 'src/state/api/application';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function ApplicationTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selected,
  setSnackbar,
  refetch
}) {
  const MuiTheme = useTheme();
  const token = useSelector(state => state.user.token);
  const [approveLeaveMutation, {isLoading: approving, error: approveError, data: approved}] = useApproveLeaveMutation();
  const [rejectLeaveMutation, {isLoading: rejecting, error: rejectError, data: rejected}] = useRejectLeaveMutation();

  const approveLeave = () => {
    approveLeaveMutation({token, id: selected});
  }

  const rejectLeave = () => {
    rejectLeaveMutation({token, id: selected});
  }

  useEffect(() => {
    if (rejectError) {
      let mssg = '';
      if (rejectError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = rejectError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: MuiTheme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (rejected) {
      refetch()
      setSnackbar({
        open: true,
        mssg: "Approved",
        bgColor: MuiTheme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [rejected, rejectError, MuiTheme, setSnackbar, refetch]);

  useEffect(() => {
    if (approveError) {
      let mssg = '';
      if (approveError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = approveError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: MuiTheme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (approved) {
      refetch();
      setSnackbar({
        open: true,
        mssg: "Approved",
        bgColor: MuiTheme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [approved, approveError, MuiTheme, setSnackbar, refetch]);

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
          <LoadingButton disabled={approving || rejecting} loading={approving || rejecting} loadingIndicator={<CircularProgress />} onClick={approveLeave}>Approve</LoadingButton>
          <LoadingButton disabled={approving || rejecting} loading={approving || rejecting} loadingIndicator={<CircularProgress />} onClick={rejectLeave}>Reject</LoadingButton>
        </Stack>
      )}
    </Toolbar>
  );
}

ApplicationTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.string,
  setSnackbar: PropTypes.func,
  refetch: PropTypes.func,
};