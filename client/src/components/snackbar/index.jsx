import PropTypes from 'prop-types';

import { Alert, Snackbar } from '@mui/material';

const CustomSnack = ({ closeSnackbar, open, mssg, bgColor, anchorOrigin, severity }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={() => {
      closeSnackbar();
    }}
    anchorOrigin={anchorOrigin}
  >
    <Alert
      onClose={() => {
        closeSnackbar();
      }}
      variant="filled"
      sx={{ backgroundColor: bgColor }}
      severity={severity}
    >
      {mssg}
    </Alert>
  </Snackbar>
);

CustomSnack.propTypes = {
  closeSnackbar: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  mssg: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  anchorOrigin: PropTypes.object.isRequired,
  severity: PropTypes.string.isRequired,
};

export default CustomSnack;