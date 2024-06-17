import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

export default function DialogBox({ title, desc, open, getUserConfirmation }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => {}}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{desc}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => getUserConfirmation(false)}>
          Cancel
        </Button>
        <Button onClick={() => getUserConfirmation(true)} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogBox.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  open: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
};
