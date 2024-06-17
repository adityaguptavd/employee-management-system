/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadingButton } from '@mui/lab';
import { Avatar, CircularProgress, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useUploadApplicationMutation } from 'src/state/api/application';
import { useFetchAllEmployeesQuery } from 'src/state/api/employee';
import { fDate } from 'src/utils/format-time';
import { UploadIcon } from 'src/components/iconify/upload-file-icon';
import { getFileURL } from 'src/utils/url';

const ApplicationUploadForm = ({ refetch, handleCloseMenu, setSnackbar }) => {
  const theme = useTheme();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const [uploadApplicationMutation, { data: uploaded, error: uploadingError, isLoading }] =
    useUploadApplicationMutation();
  const [skip, setSkip] = useState(true);
  const { data: employees, error: employeeFetchError } = useFetchAllEmployeesQuery(
    { token },
    { skip }
  );

  const [application, setApplication] = useState({
    employeeId: 'Select Applicant',
    leaveType: 'Medical Leave',
    fromDate: '',
    toDate: '',
    reason: '',
    document: null,
  });

  const handleChange = (field, value) => {
    setApplication({
      ...application,
      [field]: value,
    });
  };

  const uploadApplication = () => {
    let isValid = true;
    Object.keys(application).forEach((key) => {
      if (application[key] === '' || application[key] === 'Select Applicant') {
        isValid = false;
      }
    });
    if (!isValid) {
      setSnackbar({
        open: true,
        mssg: "Mandatory fields can't be left empty",
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    const formData = new FormData();
    formData.append('employeeId', application.employeeId);
    formData.append('leaveType', application.leaveType);
    formData.append('fromDate', fDate(new Date(application.fromDate), 'dd/MM/yyyy'));
    formData.append('toDate', fDate(new Date(application.toDate), 'dd/MM/yyyy'));
    formData.append('reason', application.reason);
    if (application.document) {
      formData.append('document', application.document);
    }
    uploadApplicationMutation({ token, body: formData });
  };

  const docInput = useRef();

  const chooseDoc = () => {
    docInput.current.click();
  };

  const uploadDoc = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setApplication({
        ...application,
        document: selectedFile,
      });
    }
  };

  const uploadDocsField = (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={chooseDoc}
        startIcon={<UploadIcon />}
        sx={{ width: { xs: '150px', sm: '200px' } }}
      >
        Upload Documents
      </Button>
      <input ref={docInput} type="file" style={{ display: 'none' }} onChange={uploadDoc} />
    </>
  );

  useEffect(() => {
    if (employeeFetchError) {
      let mssg = '';
      if (employeeFetchError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = employeeFetchError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [employeeFetchError, theme, setSnackbar]);

  useEffect(() => {
    if (uploadingError) {
      let mssg = '';
      if (uploadingError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = uploadingError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (uploaded) {
      refetch();
      handleCloseMenu();
      setSnackbar({
        open: true,
        mssg: 'Application uploaded',
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [uploadingError, uploaded, theme, refetch, handleCloseMenu, setSnackbar]);

  useState(() => {
    if (user.role === 'HR' || user.department.pseudoAdmin) {
      setSkip(false);
    }
  }, [user]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Upload Application
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Select
          fullWidth
          label="Applicant"
          value={application.employeeId}
          onChange={(e) => {
            handleChange('employeeId', e.target.value);
          }}
        >
          <MenuItem value="Select Applicant">Select Applicant</MenuItem>
          {user.role === 'HR' || user.department.pseudoAdmin ? (
            employees &&
            employees.employees.map((emp) => (
              <MenuItem
                key={emp._id}
                value={emp._id}
              >{`${emp.name.firstName} ${emp.name.lastName} - ${emp.employeeId}`}</MenuItem>
            ))
          ) : (
            <MenuItem
              value={user._id}
            >{`${user.name.firstName} ${user.name.lastName} - ${user.employeeId}`}</MenuItem>
          )}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Select
          fullWidth
          label="Leave Type"
          value={application.leaveType}
          onChange={(e) => {
            handleChange('leaveType', e.target.value);
          }}
        >
          <MenuItem value="Medical Leave">Medical Leave</MenuItem>
          <MenuItem value="Casual Leave">Casual Leave</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="From"
              format="DD/MM/YYYY"
              value={application.fromDate === '' ? null : application.fromDate}
              onChange={(newValue) => handleChange('fromDate', newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="To"
              format="DD/MM/YYYY"
              value={application.toDate === '' ? null : application.toDate}
              onChange={(newValue) => handleChange('toDate', newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Reason"
          value={application.reason}
          onChange={(e) => {
            handleChange('reason', e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        {!application.document ? (
          uploadDocsField
        ) : (
          <Stack direction="row" gap={2}>
            <Avatar src={getFileURL(application.document)} alt="Document" />
            <Button onClick={() => window.open(getFileURL(application.document), '_blank')}>
              View
            </Button>
            <Button onClick={() => setApplication({ ...application, document: null })}>
              Remove
            </Button>
          </Stack>
        )}
      </Grid>
      <Grid item xs={12} container justifyContent="flex-start" spacing={2}>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={handleCloseMenu}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <LoadingButton
            variant="contained"
            onClick={uploadApplication}
            loading={isLoading}
            loadingIndicator={<CircularProgress />}
          >
            Upload
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ApplicationUploadForm;

ApplicationUploadForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func,
};
