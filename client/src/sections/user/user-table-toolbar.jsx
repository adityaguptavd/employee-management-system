/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { CircularProgress, useTheme } from '@mui/material';
import { useUploadAttendanceMutation } from 'src/state/api/attendance';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  removeEmployee,
  setSnackbar,
  refetch,
}) {
  const muiTheme = useTheme();

  const token = useSelector((state) => state.user.token);
  const userRole = useSelector((state) => state.user.user.role);
  const [uploadAttendanceMutation, { isLoading, data, error }] = useUploadAttendanceMutation();
  // const [fileData, setFileData] = useState([]);
  const attendanceInputRef = useRef();

  const uploadAttendance = (event) => {
    const dataFile = new FormData();
    dataFile.append('attendance', event.target.files[0]);
    uploadAttendanceMutation({ token, body: dataFile });
  };

  const uploadAttendanceField = (
    <>
      <LoadingButton
        loading={isLoading}
        loadingIndicator={<CircularProgress />}
        variant="contained"
        color="primary"
        onClick={() => {
          attendanceInputRef.current.click();
        }}
      >
        Upload Attendance
      </LoadingButton>
      <input
        ref={attendanceInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={uploadAttendance}
      />
    </>
  );

  // post uploading attendance
  useEffect(() => {
    if (error) {
      let mssg = '';
      if (error.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = error.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: muiTheme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
    if (data) {
      setSnackbar({
        open: true,
        mssg: 'Attendance Uploaded!',
        bgColor: muiTheme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      refetch();
    }
  }, [error, data, muiTheme, refetch, setSnackbar]);

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
        <>
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
          {userRole === "HR" && uploadAttendanceField}
        </>
      )}
      {userRole === 'HR' && numSelected === 1 && (
        <Tooltip title="Delete">
          <IconButton onClick={removeEmployee}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  removeEmployee: PropTypes.func,
  setSnackbar: PropTypes.func,
  refetch: PropTypes.func,
};
