import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from 'src/state/api/department';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';

const NewDepartmentForm = ({ refetch, handleCloseMenu, edit, setEdit, setSnackbar }) => {
  const theme = useTheme();
  const token = useSelector((state) => state.user.token);
  const [createDepartmentMutation, { data, error, isLoading }] = useCreateDepartmentMutation();
  const [updateDepartmentMutation, { data: updated, error: updationError, isLoading: updating }] =
    useUpdateDepartmentMutation();

  const [department, setDepartment] = useState({
    name: '',
    description: '',
    openTime: '',
    closeTime: '',
    pseudoAdmin: false,
  });

  const handleChange = (field, value) => {
    setDepartment({
      ...department,
      [field]: value,
    });
  };

  const createDepartment = () => {
    const { name, description, openTime, closeTime, pseudoAdmin } = department;
    if (name === '' || description === '' || openTime === '' || closeTime === '') {
      setSnackbar({
        open: true,
        mssg: 'All fields are mandatory',
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    const body = JSON.stringify({
      name,
      description,
      openTime: dayjs(openTime).format('HH:mm:ss'),
      closeTime: dayjs(closeTime).format('HH:mm:ss'),
      pseudoAdmin,
    });
    if (edit) {
      updateDepartmentMutation({ token, body, id: edit._id });
    } else {
      createDepartmentMutation({ token, body });
    }
  };

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
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (data) {
      refetch();
      handleCloseMenu();
      setSnackbar({
        open: true,
        mssg: 'Department Created',
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [error, data, theme, refetch, handleCloseMenu, setSnackbar]);

  useEffect(() => {
    if (updationError) {
      let mssg = '';
      if (updationError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = updationError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (updated) {
      refetch();
      handleCloseMenu();
      setEdit(null);
      setSnackbar({
        open: true,
        mssg: 'Department Updated',
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [updationError, updated, theme, refetch, handleCloseMenu, setEdit, setSnackbar]);

  useEffect(() => {
    if (edit) {
      setDepartment({
        ...edit,
        openTime: dayjs(edit.open),
        closeTime: dayjs(edit.close),
      });
    }
  }, [edit]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">{edit ? "Update Department" : "New Department"}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Department Name"
          value={department.name}
          onChange={(e) => {
            handleChange('name', e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Description"
          value={department.description}
          onChange={(e) => {
            handleChange('description', e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <TimePicker
              views={['hours', 'minutes', 'seconds']}
              label="Open Time"
              value={department.openTime === '' ? null : department.openTime}
              onChange={(newValue) => handleChange('openTime', newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <TimePicker
              views={['hours', 'minutes', 'seconds']}
              label="Close Time"
              value={department.closeTime === '' ? null : department.closeTime}
              onChange={(newValue) => handleChange('closeTime', newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={8} onClick={() => handleChange('pseudoAdmin', !department.pseudoAdmin)}>
      <Checkbox disableRipple checked={department.pseudoAdmin} />
      <Typography variant="body-2" sx={{cursor: "pointer"}}>Pseudo Admin</Typography>
      </Grid>
      <Grid item xs={12} container justifyContent="flex-start" spacing={2}>
        <Grid item xs={{ xs: 12, sm: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setEdit(null);
              handleCloseMenu();
            }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={{ xs: 12, sm: 3 }}>
          <LoadingButton
            variant="contained"
            onClick={createDepartment}
            loading={isLoading || updating}
            loadingIndicator={<CircularProgress />}
          >
            {edit ? 'Update' : 'Create'}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewDepartmentForm;

NewDepartmentForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
  setEdit: PropTypes.func,
  setSnackbar: PropTypes.func,
  edit: PropTypes.object,
};
