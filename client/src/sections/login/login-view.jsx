import validator from 'validator';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { setIdToken } from 'src/state/user/userSlice';
import { useGetIdTokenMutation } from 'src/state/api/auth';

import Iconify from 'src/components/iconify';
import CustomSnack from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const router = useRouter();

  const [getIdTokenMutation, { error, data, isLoading }] = useGetIdTokenMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const initialSnackbar = {
    open: false,
    mssg: '',
    bgColor: theme.palette.error.dark,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  };

  const [snackbar, setSnackbar] = useState(initialSnackbar);

  const handleClick = () => {
    if (!validator.isEmail(email)) {
      setValidEmail(false);
      return;
    }
    setValidEmail(true);
    if (password.length === 0) {
      setValidPassword(false);
      return;
    }
    setValidPassword(true);
    // prepare body to send
    const body = JSON.stringify({
      email,
      password,
    });
    getIdTokenMutation({ body });
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
      console.error(error);
    }
    if (data) {
      const { id, token } = data;
      dispatch(setIdToken({ id, token }));
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      router.push('/');
    }
  }, [error, data, router, theme, dispatch]);

  const renderForm = (
    <Stack spacing={6}>
      <TextField
        name="email"
        label="Email address"
        value={email}
        helperText={!validEmail && 'Invalid Email'}
        error={!validEmail}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <TextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        helperText={!validPassword && 'Invalid Password'}
        error={!validPassword}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        loading={isLoading}
        loadingIndicator={<CircularProgress />}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
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

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Sign in
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
