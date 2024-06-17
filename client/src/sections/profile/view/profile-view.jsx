/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import { useRef, useState, useEffect } from 'react';
import { CircularProgress, IconButton, useTheme } from '@mui/material';
import validator from 'validator';

import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
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
import InputLabel from '@mui/material/InputLabel';

import { useParams } from 'react-router-dom';
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
import { useFetchEmployeeQuery, useUpdateEmployeeMutation } from 'src/state/api/employee';
import dayjs from 'dayjs';

import { getFileURL, base64ToUrl } from 'src/utils/url';

import { RouterLink } from 'src/routes/components';
import AppCalender from 'src/sections/overview/app-calender';
import { UploadIcon, EmailIcon, WhatsAppIcon } from '../icons';
import UserSummaryView from '../user-summary-view';

export default function ProfileView() {
  const token = useSelector((state) => state.user.token);
  const loggedUser = useSelector((state) => state.user.user);
  const { id: userId } = useParams();

  const [skip, setSkip] = useState(true);
  // fetch department list
  const { data, error } = useFetchAllDepartmentsQuery({ token }, { skip });
  useEffect(() => {
    if (loggedUser && (loggedUser.role === 'HR' || loggedUser.department.pseudoAdmin)) {
      setSkip(false);
    }
  }, [loggedUser]);

  const {
    data: employee,
    error: noEmployee,
    refetch,
  } = useFetchEmployeeQuery({ token, id: userId });
  // to send user data to backend
  const [updateEmployeeMutation, { isLoading, data: success, error: failed }] =
    useUpdateEmployeeMutation();

  const profilePicInput = useRef();
  const theme = useTheme();
  const router = useRouter();

  const [prevUserDetails, setPrevUserDetails] = useState({
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
    commState: '',
    commPincode: '',
    role: '',
    departmentId: '',
    salary: '',
    hike: '',
    qatarId: '',
    qatarExpiryDate: '',
    passportId: '',
    passportExpiryDate: '',
  });
  const [user, setUser] = useState(prevUserDetails);
  const [summary, setSummary] = useState(null);

  const [changed, setChanged] = useState({
    profilePic: false,
    qatarDoc: false,
    passportDoc: false,
  });
  const [fileData] = useState([]);
  const [fileDataTime, setFileDataTime] = useState([]);

  console.log(fileDataTime, 'fileDataTime');
  const calculateDaysWorked = (data) => {
    const employeeWorkDays = {};

    data.forEach((item) => {
      if (!employeeWorkDays[item.employeeId]) {
        employeeWorkDays[item.employeeId] = new Set();
      }
      employeeWorkDays[item.employeeId].add(item.date);
    });

    // Convert Set sizes into actual counts
    for (const employee in employeeWorkDays) {
      employeeWorkDays[employee] = employeeWorkDays[employee].size;
    }

    return employeeWorkDays;
  };

  const daysWorked = calculateDaysWorked(fileDataTime);
  console.log(daysWorked);

  const dailyWages = {
    10: 100, // Daily wage for employee 211
    13: 120, // Daily wage for employee 212
  };

  const calculateMonthlySalary = (daysWorked, wages) => {
    const monthlySalaries = {};

    for (const employeeId in daysWorked) {
      monthlySalaries[employeeId] = daysWorked[employeeId] * (wages[employeeId] || 0);
    }

    return monthlySalaries;
  };

  const monthlySalaries = calculateMonthlySalary(daysWorked, dailyWages);
  console.log(monthlySalaries, 'monthlySalaries');

  console.log(fileData, 'fileData');
  console.log(fileData, 'fileData-0-0-');
  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const [qatarDocs, setQatarDocs] = useState({
    doc: null,
    url: '',
  });

  const [passportDocs, setPassportDocs] = useState({
    doc: null,
    url: '',
  });

  const [editMode, setEditMode] = useState(false);

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
      setProfilePic({
        file: selectedFile,
        url: getFileURL(selectedFile),
      });
      setChanged({
        ...changed,
        profilePic: true,
      });
    }
  };

  const saveUser = () => {
    const formData = new FormData();
    const update = {};
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
        if (user[key] !== prevUserDetails[key]) {
          update[key] = user[key];
        }
      }
      // format dob
      else if (key === 'dob' || key === 'qatarExpiryDate' || key === 'passportExpiryDate') {
        const value = fDate(new Date(user[key]), 'dd/MM/yyyy');
        if (value !== fDate(new Date(prevUserDetails[key]), 'dd/MM/yyyy')) {
          update[key] = value;
        }
      }
      // set department value to id only
      else if (key === 'departmentId') {
        const departmentId = user[key].split('^')[0];
        if (user[key] !== prevUserDetails[key]) {
          update.department = departmentId;
        }
      } else if (user[key] !== prevUserDetails[key]) {
        update[key] = user[key];
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
    if (password !== '') {
      if (password === confirmPassword) {
        update.password = password;
      } else {
        setSnackbar({
          open: true,
          mssg: 'Password Mismatch',
          bgColor: theme.palette.error.dark,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
        return;
      }
    }
    // attach profilePic if provided
    if (changed.profilePic) {
      formData.append('profilePicture', profilePic.file);
    }
    if (changed.qatarDoc) {
      formData.append('qatarDoc', qatarDocs.doc);
    }
    if (changed.passportDoc) {
      formData.append('passportDoc', passportDocs.doc);
    }
    formData.append('update', JSON.stringify(update));
    updateEmployeeMutation({ body: formData, token, id: userId });
  };

  const uploadImageField = (
    <>
      <Button
        disabled={!editMode}
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
        setQatarDocs({ doc: selectedFile, url: getFileURL(selectedFile) });
        setChanged({
          ...changed,
          qatarDoc: true,
        });
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
        setPassportDocs({ doc: selectedFile, url: getFileURL(selectedFile) });
        setChanged({
          ...changed,
          passportDoc: true,
        });
      }
    }
  };

  // post fetching department list
  useEffect(() => {
    if (error) {
      let mssg = '';
      if (error.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = 'Unable to fetch department list';
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      console.error(error);
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

  // post saving user
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
    }
    if (success) {
      setSnackbar({
        open: true,
        mssg: 'Profille Updated',
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      setEditMode((e) => !e);
      refetch();
    }
  }, [failed, success, router, theme, refetch]);

  // post fetching employee by id
  useEffect(() => {
    if (noEmployee) {
      let mssg = '';
      if (noEmployee.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = 'Unable to fetch user details';
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    if (employee) {
      if (!editMode) {
        const { user: emp, leaveSummary, attendanceSummary } = employee;
        setSummary({ attendanceSummary, leaveSummary, salary: emp.salary });
        const { local, pincode, state, city } = emp.address;
        const {
          local: commLocal,
          pincode: commPincode,
          state: commState,
          city: commCity,
        } = emp.commAddress;
        const profilePicUrl = base64ToUrl(emp.profilePic);
        const qatarImg = base64ToUrl(emp.qatarDocs.file);
        const passportImg = base64ToUrl(emp.passportDocs.file);
        setProfilePic({
          file: emp.profilePic,
          url: profilePicUrl,
        });

        setQatarDocs({
          doc: emp.qatarDocs.file,
          url: qatarImg,
        });

        setPassportDocs({
          doc: emp.passportDocs.file,
          url: passportImg,
        });

        setPrevUserDetails({
          ...emp,
          firstName: emp.name.firstName,
          lastName: emp.name.lastName,
          local,
          pincode,
          city,
          state,
          commLocal,
          commCity,
          commPincode,
          commState,
          departmentId: emp.department ? `${emp.department._id}^${emp.department.name}` : '',
          dob: dayjs(emp.dob),
          salary: emp.salary.base,
          hike: emp.salary.hike,
          qatarId: emp.qatarDocs.id,
          passportId: emp.passportDocs.id,
          qatarExpiryDate: dayjs(emp.qatarDocs.expiryDate),
          passportExpiryDate: dayjs(emp.passportDocs.expiryDate),
        });
        setUser({
          ...emp,
          firstName: emp.name.firstName,
          lastName: emp.name.lastName,
          local,
          pincode,
          city,
          state,
          commLocal,
          commCity,
          commPincode,
          commState,
          departmentId: emp.department ? `${emp.department._id}^${emp.department.name}` : '',
          dob: dayjs(emp.dob),
          salary: emp.salary.base,
          hike: emp.salary.hike,
          qatarId: emp.qatarDocs.id,
          passportId: emp.passportDocs.id,
          qatarExpiryDate: dayjs(emp.qatarDocs.expiryDate),
          passportExpiryDate: dayjs(emp.passportDocs.expiryDate),
        });
      }
    }
  }, [employee, noEmployee, theme, editMode]);

  const renderDept = () => {
    if (loggedUser && (loggedUser.role !== 'HR' && !loggedUser.department.pseudoAdmin)) {
      return (
        <MenuItem value={`${loggedUser.department._id}^${loggedUser.department.name}`}>
          {loggedUser.department.name}
        </MenuItem>
      );
    }
    if (!data) {
      return <MenuItem value=""> </MenuItem>;
    }
    return data.departments.map((dept) => (
      <MenuItem key={dept._id} value={`${dept._id}^${dept.name}`}>
        {dept.name}
      </MenuItem>
    ));
  };

  // useEffect(() => {
  //   const handleGetEmployeeID = () => {
  //     // Define the base URL based on the environment
  //     const url =
  //       process.env.NODE_ENV === 'production'
  //         ? 'https://hr-project-wohb.onrender.com'
  //         : 'http://localhost:5000';

  //     // Fetch the employee data
  //     fetch(`${url}/api/v1/files/getEmployeeData/${user.employeeId}`, {
  //       method: 'GET',
  //     })
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log('Success:', result);
  //         setFileDataTime(result.employee); // Make sure to set the result here
  //         // setFileDataTime(Array.isArray(result) ? result : []);
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });
  //   };
  //   if (user.employeeId) {
  //     handleGetEmployeeID();
  //   }
  // }, [user.employeeId]); // Ensure the dependency array is correct

  return (
    <>
      {employee && (
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
            <Typography variant="h4">{editMode ? 'Update User' : 'User Profile'}</Typography>
            {loggedUser && (loggedUser.role === 'HR' || loggedUser.department.pseudoAdmin) && (
              <Stack direction="row" spacing={2}>
                <Tooltip title="Email">
                  <IconButton
                    disabled={editMode}
                    component={RouterLink}
                    href={`mailto:${user.email}`}
                  >
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Whatsapp">
                  <IconButton
                    disabled={editMode}
                    component={RouterLink}
                    href={`whatsapp://send?phone=+91${user.whatsApp}`}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                </Tooltip>
                <Button variant="contained" onClick={() => setEditMode(!editMode)}>
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            gap={1}
            justifyContent="space-between"
            alignItems="flex-start"
            width="100%"
          >
            <Stack
              direction="column"
              gap="20px"
              width="250px"
              alignItems="flex-start"
              sx={{ alignSelf: 'center' }}
            >
              <Avatar sx={{ height: '200px', width: '200px' }} src={profilePic && profilePic.url} />
              {loggedUser &&
                (loggedUser.role === 'HR' || loggedUser.department.pseudoAdmin) &&
                uploadImageField}
            </Stack>
            <UserSummaryView
              summary={summary}
              id={userId}
              name={`${user.firstName} ${user.lastName}`}
            />
          </Stack>
          <Box>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12}>
                <AppCalender id={userId} setSnackbar={setSnackbar} refetchUser={refetch} />
              </Grid>
            </Grid>
          </Box>
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
                  <InputLabel id="employeeid">Employee ID</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="employeeid"
                    fullWidth
                    placeholder="Employee ID"
                    value={user.employeeId}
                    onChange={(e) => {
                      handleChange('employeeId', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="firstname">First Name</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="firstname"
                    fullWidth
                    placeholder="First Name"
                    value={user.firstName}
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
                    value={user.lastName}
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
                  <InputLabel id="email">Email</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="email"
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
                  <InputLabel id="phone">Phone</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="phone"
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
                  <InputLabel id="whatsapp">Whatsapp No.</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="whatsapp"
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

            {loggedUser && (loggedUser.role === 'HR' || loggedUser.department.pseudoAdmin) && (
              <Box>
                <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
                  Change Password
                </Typography>
                <Grid container spacing={2} alignItems="stretch">
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="password">New Password</InputLabel>
                    <TextField
                      disabled={!editMode}
                      labelId="password"
                      fullWidth
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box>
              <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
                Homeland Address
              </Typography>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={8}>
                  <InputLabel id="local">Enter Your Homeland Address</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="local"
                    fullWidth
                    placeholder="Enter your homeland address"
                    value={user.local}
                    onChange={(e) => {
                      handleChange('local', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="pincode">Pin Code</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="pincode"
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
                  <InputLabel id="city">City</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="city"
                    fullWidth
                    placeholder="City"
                    value={user.city}
                    onChange={(e) => {
                      handleChange('city', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="state">State</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="state"
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
                  <InputLabel id="commlocal">Enter Your Communication Address</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="commlocal"
                    fullWidth
                    placeholder="Enter your communication address"
                    value={user.commLocal}
                    onChange={(e) => {
                      handleChange('commLocal', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="commpincode">Pin Code</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="commpincode"
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
                  <InputLabel id="commCity">City</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="commCity"
                    fullWidth
                    placeholder="City"
                    value={user.commCity}
                    onChange={(e) => {
                      handleChange('commCity', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="commState">State</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="commState"
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
                  src={qatarDocs.url}
                  alt={qatarDocs.doc ? qatarDocs.doc.name : 'Qatar Document'}
                >
                  Q
                </Avatar>
                <TextField
                  disabled={!editMode}
                  type="text"
                  placeholder="Qatar ID Number"
                  value={user.qatarId}
                  onChange={(e) => handleChange('qatarId', e.target.value)}
                />
                <Button
                  component="label"
                  disabled={!editMode}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<UploadIcon />}
                >
                  Upload Image
                  <input type="file" onChange={uploadQatarImg} style={{ display: 'none' }} />
                </Button>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      disabled={!editMode}
                      label="Expiry Date"
                      disablePast
                      sx={{ width: '100%' }}
                      value={user.qatarExpiryDate === '' ? null : user.qatarExpiryDate}
                      onChange={(date) => handleChange('qatarExpiryDate', date)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Button onClick={() => window.open(qatarDocs.url, '_blank')}>View</Button>
              </Stack>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                gap={{ xs: '10px', md: '40px' }}
                mt={{ xs: '50px', md: '30px' }}
                alignItems="center"
              >
                <Avatar
                  src={passportDocs.url}
                  alt={passportDocs.doc ? passportDocs.doc.name : 'Passport Document'}
                >
                  P
                </Avatar>
                <TextField
                  disabled={!editMode}
                  type="text"
                  placeholder="Passport ID Number"
                  value={user.passportId}
                  onChange={(e) => handleChange('passportId', e.target.value)}
                />
                <Button
                  component="label"
                  disabled={!editMode}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<UploadIcon />}
                >
                  Upload Image
                  <input type="file" onChange={uploadPassportImg} style={{ display: 'none' }} />
                </Button>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                    <DatePicker
                      disabled={!editMode}
                      format="DD/MM/YYYY"
                      label="Expiry Date"
                      disablePast
                      sx={{ width: '100%' }}
                      value={user.passportExpiryDate === '' ? null : user.passportExpiryDate}
                      onChange={(date) => handleChange('passportExpiryDate', date)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <Button onClick={() => window.open(passportDocs.url, '_blank')}>View</Button>
              </Stack>
            </Box>

            <Box>
              <Typography gutterBottom variant="h5" color={theme.palette.grey[500]}>
                Other Information
              </Typography>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} sm={6}>
                  <InputLabel id="role">Employee Role</InputLabel>
                  <TextField
                    disabled={!editMode}
                    labelId="role"
                    fullWidth
                    placeholder="Employee Role"
                    value={user.role}
                    onChange={(e) => {
                      handleChange('role', e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="department">Department</InputLabel>
                  <Select
                    disabled={!editMode}
                    labelId="department"
                    fullWidth
                    label="Department"
                    value={user.departmentId}
                    onChange={(e) => {
                      const [id, name] = e.target.value.split('^');
                      handleChange('departmentId', `${id}^${name}`);
                    }}
                  >
                    {renderDept()}
                  </Select>
                </Grid>
                {loggedUser && 
                  (loggedUser.role === 'HR' || !loggedUser.department.pseudoAdmin || loggedUser._id === userId) && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <InputLabel id="salary">Base Salary (per month)</InputLabel>
                        <TextField
                          disabled={!editMode}
                          labelId="salary"
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
                        <InputLabel id="hike">Salary Hike (yearly in %)</InputLabel>
                        <TextField
                          disabled={!editMode}
                          labelId="hike"
                          fullWidth
                          placeholder="Salary Hike (yearly in %)"
                          type="number"
                          value={user.hike}
                          onChange={(e) => {
                            handleChange('hike', e.target.value);
                          }}
                        />
                      </Grid>
                    </>
                  )}
              </Grid>
            </Box>

            {loggedUser && (loggedUser.role === 'HR' || loggedUser.department.pseudoAdmin) && (
              <LoadingButton
                disabled={!editMode}
                loading={isLoading}
                loadingIndicator={<CircularProgress />}
                variant="contained"
                sx={{ alignSelf: 'flex-start' }}
                onClick={saveUser}
              >
                Update
              </LoadingButton>
            )}
          </Card>
        </Container>
      )}
    </>
  );
}
