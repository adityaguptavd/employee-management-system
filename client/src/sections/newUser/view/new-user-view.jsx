import { useRef, useState, useEffect } from 'react';
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
import Avatar from '@mui/material/Avatar';

import { useRouter } from 'src/routes/hooks';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadingButton } from '@mui/lab';

import { fDate } from 'src/utils/format-time';
import CustomSnack from 'src/components/snackbar';
import { useSelector } from 'react-redux';
import { useFetchAllDepartmentsQuery } from 'src/state/api/department';
import { useCreateEmployeeMutation } from 'src/state/api/employee';
import { getFileURL } from 'src/utils/url';
import { UploadIcon } from 'src/components/iconify/upload-file-icon';

export default function NewUserView() {
  const router = useRouter();
  const token = useSelector((state) => state.user.token);
  const loggedUser = useSelector((state) => state.user.user);

  useEffect(() => {
    if (loggedUser && loggedUser.role !== 'HR') {
      router.push('/404');
    }
  }, [loggedUser, router]);

  // fetch department list
  const { data, error } = useFetchAllDepartmentsQuery({ token });
  // to send user data to backend
  const [createEmployeeMutation, { isLoading, data: success, error: failed }] =
    useCreateEmployeeMutation();

  const profilePicInput = useRef();
  const theme = useTheme();

  const [user, setUser] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: '',
    whatsApp: '',
    dob: '',
    local: '',
    city: '',
    state: '',
    pincode: '',
    commLocal: '',
    commCity: '',
    commPincode: '',
    commState: '',
    role: '',
    departmentId: '',
    salary: '',
    hike: '',
  });

  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const [profilePic, setProfilePic] = useState(null);
  const [qatarDocs, setQatarDocs] = useState({
    id: '',
    doc: null,
    expiryDate: '',
  });

  const [passportDocs, setPassportDocs] = useState({
    id: '',
    doc: null,
    expiryDate: '',
  });

  const initialSnackbar = {
    open: false,
    mssg: '',
    bgColor: theme.palette.error.dark,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  };

  const [snackbar, setSnackbar] = useState(initialSnackbar);

  const chooseProfilePic = () => {
    profilePicInput.current.click();
  };

  const uploadProfilePic = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProfilePic(selectedFile);
    }
  };

  const saveUser = () => {
    const formData = new FormData();
    // validate information
    let isValidDetails = true;
    Object.keys(user).forEach((key) => {
      if (user[key] === '') {
        isValidDetails = false;
        return;
      }
      // validate email
      if (key === 'email') {
        if (!validator.isEmail(user[key])) {
          isValidDetails = false;
          return;
        }
        formData.append(key, user[key]);
      }
      // format dob
      else if (key === 'dob') {
        const dob = fDate(new Date(user[key]), 'dd/MM/yyyy');
        formData.append(key, dob);
      }
      // set department value to id only
      else if (key === 'departmentId') {
        const departmentId = user[key].split('^')[0];
        formData.append(key, departmentId);
      } else {
        formData.append(key, user[key]);
      }
    });
    if (!isValidDetails) {
      setSnackbar({
        open: true,
        mssg: 'All fields are mandatory',
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    // attach profilePic if provided
    formData.append('profilePicture', profilePic);
    // attach legal documents
    if (!qatarDocs.doc || !passportDocs.doc) {
      setSnackbar({
        open: true,
        mssg: 'Qatar/Passport Image is missing',
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    if (qatarDocs.id === '' || qatarDocs.expiryDate === '') {
      setSnackbar({
        open: true,
        mssg: 'Qatar ID details missing',
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    if (passportDocs.id === '' || passportDocs.expiryDate === '') {
      setSnackbar({
        open: true,
        mssg: 'Qatar ID details missing',
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }
    formData.append('qatarDoc', qatarDocs.doc);
    formData.append('passportDoc', passportDocs.doc);

    formData.append('qatarExpiryDate', fDate(new Date(qatarDocs.expiryDate), 'dd/MM/yyyy'));
    formData.append('passportExpiryDate', fDate(new Date(passportDocs.expiryDate), 'dd/MM/yyyy'));

    formData.append('qatarID', qatarDocs.id);
    formData.append('passportID', passportDocs.id);
    createEmployeeMutation({ body: formData, token });
  };

  const uploadImageField = (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={chooseProfilePic}
        startIcon={<UploadIcon />}
        sx={{ width: '150px', marginLeft: '25px' }}
      >
        Upload Pic
      </Button>
      <input
        ref={profilePicInput}
        type="file"
        style={{ display: 'none' }}
        onChange={uploadProfilePic}
      />
    </>
  );

  const uploadQatarImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
        setSnackbar({
          open: true,
          mssg: 'Only jpg/jpeg/png file is allowed!',
          bgColor: theme.palette.error.dark,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      } else {
        setQatarDocs({ ...qatarDocs, doc: selectedFile });
      }
    }
  };

  const uploadPassportImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
        setSnackbar({
          open: true,
          mssg: 'Only jpg/jpeg/png file is allowed!',
          bgColor: theme.palette.error.dark,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      } else {
        setPassportDocs({ ...passportDocs, doc: selectedFile });
      }
    }
  };

  // department list fetch
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
      if (data.departments.length > 0) {
        const { _id, name } = data.departments[0];
        if (_id && name) {
          setUser((u) => ({
            ...u,
            departmentId: `${_id}^${name}`,
          }));
        }
      } else {
        setUser((u) => ({
          ...u,
          departmentId: '',
        }));
        setSnackbar({
          open: true,
          mssg: 'Warning! No department found',
          bgColor: theme.palette.error.dark,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    }
  }, [error, data, theme]);

  // user added
  useEffect(() => {
    if (failed) {
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
      router.push('/user');
    }
  }, [failed, success, router, theme]);

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
        <Typography variant="h4">New User</Typography>
      </Stack>
      <Stack direction="column" gap="20px" width="250px" alignItems="flex-start">
        <Avatar sx={{ height: '200px', width: '200px' }} src={getFileURL(profilePic)} />
        {uploadImageField}
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
              <TextField
                fullWidth
                placeholder="Employee ID"
                value={user.employeeId}
                onChange={(e) => {
                  handleChange('employeeId', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) => {
                  handleChange('firstName', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) => {
                  handleChange('lastName', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="Gender"
                value={user.gender}
                onChange={(e) => {
                  handleChange('gender', e.target.value);
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                value={user.email}
                onChange={(e) => {
                  handleChange('email', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Phone"
                type="number"
                value={user.phone}
                onChange={(e) => {
                  handleChange('phone', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="WhatsApp"
                type="number"
                value={user.whatsApp}
                onChange={(e) => {
                  handleChange('whatsApp', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    label="Date Of Birth"
                    disableFuture
                    sx={{ width: '100%' }}
                    value={user.dob === '' ? null : user.dob}
                    onChange={(date) => {
                      handleChange('dob', date);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
            Homeland Address
          </Typography>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={8}>
              <TextField
                fullWidth
                placeholder="Enter your homeland address"
                value={user.local}
                onChange={(e) => {
                  handleChange('local', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                placeholder="Pin code"
                type="number"
                value={user.pincode}
                onChange={(e) => {
                  handleChange('pincode', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="City"
                value={user.city}
                onChange={(e) => {
                  handleChange('city', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="State"
                value={user.state}
                onChange={(e) => {
                  handleChange('state', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
            Communication Address
          </Typography>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={8}>
              <TextField
                fullWidth
                placeholder="Enter your communication address"
                value={user.commLocal}
                onChange={(e) => {
                  handleChange('commLocal', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                placeholder="Pin code"
                type="number"
                value={user.commPincode}
                onChange={(e) => {
                  handleChange('commPincode', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="City"
                value={user.commCity}
                onChange={(e) => {
                  handleChange('commCity', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="State"
                value={user.commState}
                onChange={(e) => {
                  handleChange('commState', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
            Legal Documents
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={{ xs: '10px', md: '40px' }}
            mt={{ xs: '50px', md: '30px' }}
            alignItems="center"
          >
            <Avatar
              src={getFileURL(qatarDocs.doc)}
              alt={qatarDocs.doc ? qatarDocs.doc.name : 'Qatar Document'}
            >
              Q
            </Avatar>
            <TextField
              type="text"
              placeholder="Qatar ID Number"
              value={qatarDocs.id}
              onChange={(e) => setQatarDocs({ ...qatarDocs, id: e.target.value })}
            />
            <Button component="label" variant="contained" tabIndex={-1} startIcon={<UploadIcon />}>
              Upload Image
              <input type="file" onChange={uploadQatarImg} style={{ display: 'none' }} />
            </Button>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="Expiry Date"
                  disablePast
                  sx={{ width: '100%' }}
                  value={qatarDocs.expiryDate === '' ? null : qatarDocs.expiryDate}
                  onChange={(date) => setQatarDocs({ ...qatarDocs, expiryDate: date })}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button onClick={() => window.open(getFileURL(qatarDocs.doc), '_blank')}>View</Button>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={{ xs: '10px', md: '40px' }}
            mt={{ xs: '50px', md: '30px' }}
            alignItems="center"
          >
            <Avatar
              src={getFileURL(passportDocs.doc)}
              alt={passportDocs.doc ? passportDocs.doc.name : 'Passport Document'}
            >
              P
            </Avatar>
            <TextField
              type="text"
              placeholder="Passport ID Number"
              value={passportDocs.id}
              onChange={(e) => setPassportDocs({ ...passportDocs, id: e.target.value })}
            />
            <Button component="label" variant="contained" tabIndex={-1} startIcon={<UploadIcon />}>
              Upload Image
              <input type="file" onChange={uploadPassportImg} style={{ display: 'none' }} />
            </Button>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="Expiry Date"
                  disablePast
                  sx={{ width: '100%' }}
                  value={passportDocs.expiryDate === '' ? null : passportDocs.expiryDate}
                  onChange={(date) => setPassportDocs({ ...passportDocs, expiryDate: date })}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button onClick={() => window.open(getFileURL(passportDocs.doc), '_blank')}>
              View
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
            Other Information
          </Typography>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                placeholder="Employee Role"
                value={user.role}
                onChange={(e) => {
                  handleChange('role', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="Department"
                value={user.departmentId}
                onChange={(e) => {
                  const [id, name] = e.target.value.split('^');
                  handleChange('departmentId', `${id}^${name}`);
                }}
              >
                {!data || data.departments.length === 0 ? (
                  <MenuItem value=""> </MenuItem>
                ) : (
                  data.departments.map((dept) => (
                    <MenuItem value={`${dept._id}^${dept.name}`}>{dept.name}</MenuItem>
                  ))
                )}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Base Salary (per month)"
                type="number"
                value={user.salary}
                onChange={(e) => {
                  handleChange('salary', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                placeholder="Salry Hike (yearly in %)"
                type="number"
                value={user.hike}
                onChange={(e) => {
                  handleChange('hike', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <LoadingButton
          loading={isLoading}
          loadingIndicator={<CircularProgress />}
          variant="contained"
          sx={{ alignSelf: 'flex-start' }}
          onClick={saveUser}
        >
          Save
        </LoadingButton>
      </Card>
    </Container>
  );
}
