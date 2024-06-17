import { useState, useEffect } from 'react';
import { CircularProgress, useTheme } from '@mui/material';
import validator from 'validator';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';

import { fDate } from 'src/utils/format-time';
import CustomSnack from 'src/components/snackbar';
import { useUpdateAdminMutation } from 'src/state/api/admin';
import dayjs from 'dayjs';
import { setUser } from 'src/state/user/userSlice';
import { useRouter } from 'src/routes/hooks';

export default function AdminProfileView() {
  const router = useRouter();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  // to send admin data to backend
  const [updateAdminMutation, { isLoading, data: success, error: failed }] =
    useUpdateAdminMutation();

  const theme = useTheme();

  const [prevAdminDetails, setPrevAdminDetails] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: '',
    whatsApp: '',
    dob: '',
    role: 'HR',
  });
  const [admin, setAdmin] = useState(prevAdminDetails);

  const handleChange = (field, value) => {
    setAdmin({
      ...admin,
      [field]: value,
    });
  };

  const [editMode, setEditMode] = useState(false);

  const initialSnackbar = {
    open: false,
    mssg: '',
    bgColor: theme.palette.error.dark,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  };

  const [snackbar, setSnackbar] = useState(initialSnackbar);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveAdmin = () => {
    // validate information
    const update = {};
    let isValidDetails = true;
    let mssg = '';
    Object.keys(admin).forEach((key) => {
      if (admin[key] === '') {
        mssg = `${key} field is mandatory`;
        isValidDetails = false;
        return;
      }
      // validate email
      if (key === 'email') {
        if (!validator.isEmail(admin[key])) {
          mssg = 'Invalid Email';
          isValidDetails = false;
          return;
        }
        if (admin[key] !== prevAdminDetails[key]) {
          update[key] = admin[key];
        }
      }
      // format dob
      else if (key === 'dob') {
        const dob = fDate(new Date(admin[key]), 'dd/MM/yyyy');
        if (
          fDate(new Date(admin[key]), 'dd/MM/yyyy') !==
          fDate(new Date(prevAdminDetails[key]), 'dd/MM/yyyy')
        ) {
          update[key] = dob;
        }
      }
      else if (admin[key] !== prevAdminDetails[key]) {
        update[key] = admin[key];
      }
    });
    update.name = {
      firstName: admin.firstName,
      lastName: admin.lastName,
    }
    delete update.firstName;
    delete update.lastName;
    if (password !== '') {
      if (password !== confirmPassword) {
        setSnackbar({
          open: true,
          mssg: 'Password mismatch',
          bgColor: theme.palette.error.dark,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
        return;
      }
      update.password = password;
    }
    if (!isValidDetails) {
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    updateAdminMutation({ body: { ...update }, token });
  };

  // post saving admin
  useEffect(() => {
    if (failed) {
      console.log(failed);
      let mssg = '';
      if (failed.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = failed.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      console.error(failed);
    }
    if (success) {
      setPrevAdminDetails(admin);
      dispatch(
        setUser({
          user: {
            ...admin,
            name: {
              firstName: admin.firstName,
              lastName: admin.lastName,
            },
            dob: fDate(new Date(admin.dob), 'dd/MM/yyyy'),
          },
        })
      );
      setSnackbar({
        open: true,
        mssg: 'Profille Updated',
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      setEditMode((e) => !e);
    }
    // eslint-disable-next-line
  }, [failed, success, theme]);

  useEffect(() => {
    if (user.role !== 'HR') {
      router.push(`/user/${user._id}`);
      return;
    }
    let formattedDate = user.dob;
    const [day, month, year] = user.dob.split('/');
    if(year){
      const dateObject = new Date(`${year}-${month}-${day}`);
      formattedDate = dayjs(dateObject).format("YYYY-MM-DD");
    }
    setPrevAdminDetails({
      ...user,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      dob: dayjs(formattedDate),
    });
    setAdmin({
      ...user,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      dob: dayjs(formattedDate),
    });
  }, [user, router]);

  return (
    <Container>
      <CustomSnack
        open={snackbar.open}
        mssg={snackbar.mssg}
        bgColor={snackbar.bgColor}
        closeSnackbar={() => {
          setSnackbar(initialSnackbar);
        }}
        severity="error"
        anchorOrigin={snackbar.anchorOrigin}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{editMode ? 'Update Admin' : 'Admin Profile'}</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit'}
          </Button>
        </Stack>
      </Stack>

      <Card
        sx={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          marginTop: '50px',
        }}
      >
        <Box>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
            Personal Information
          </Typography>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <InputLabel id="firstname">First Name</InputLabel>
              <TextField
                disabled={!editMode}
                labelId="firstname"
                fullWidth
                placeholder="First Name"
                value={admin.firstName}
                onChange={(e) => {
                  handleChange('firstName', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="lastname">Last Name</InputLabel>
              <TextField
                disabled={!editMode}
                labelId="lastname"
                fullWidth
                placeholder="Last Name"
                value={admin.lastName}
                onChange={(e) => {
                  handleChange('lastName', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                disabled={!editMode}
                labelId="gender"
                fullWidth
                label="Gender"
                value={admin.gender}
                onChange={(e) => {
                  handleChange('gender', e.target.value);
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="email">Email</InputLabel>
              <TextField
                disabled={!editMode}
                labelId="email"
                fullWidth
                placeholder="Email"
                type="email"
                value={admin.email}
                onChange={(e) => {
                  handleChange('email', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="phone">Phone</InputLabel>
              <TextField
                disabled={!editMode}
                labelId="phone"
                fullWidth
                placeholder="Phone"
                type="number"
                value={admin.phone}
                onChange={(e) => {
                  handleChange('phone', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="whatsapp">Whatsapp No.</InputLabel>
              <TextField
                disabled={!editMode}
                labelId="whatsapp"
                fullWidth
                placeholder="WhatsApp"
                type="number"
                value={admin.whatsApp}
                onChange={(e) => {
                  handleChange('whatsApp', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="dob">Date Of Birth</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    disabled={!editMode}
                    labelId="dob"
                    format="DD/MM/YYYY"
                    label="Date Of Birth"
                    disableFuture
                    sx={{ width: '100%' }}
                    value={admin.dob === '' ? null : admin.dob}
                    onChange={(date) => {
                      handleChange('dob', date);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="role">Admin Role</InputLabel>
              <TextField
                disabled
                labelId="role"
                fullWidth
                placeholder="Admin Role"
                value={admin.role}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel id="password">Change Password</InputLabel>
                <TextField
                  disabled={!editMode}
                  labelId="password"
                  fullWidth
                  placeholder="Change Password"
                  value={password}
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="confirmPassword">Confirm Password</InputLabel>
                <TextField
                  disabled={!editMode}
                  labelId="confirmPassword"
                  type="password"
                  fullWidth
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </Grid>
          </Grid>
        </Box>

        <LoadingButton
          disabled={!editMode}
          loading={isLoading}
          loadingIndicator={<CircularProgress />}
          variant="contained"
          sx={{ alignSelf: 'flex-start' }}
          onClick={saveAdmin}
        >
          Update
        </LoadingButton>
      </Card>
    </Container>
  );
}
