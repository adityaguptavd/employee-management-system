import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { LoadingButton } from '@mui/lab';

import { fToNow } from 'src/utils/format-time';

import {
  useFetchNotificationsQuery,
  useMarkAllNotificationsAsSeenMutation,
} from 'src/state/api/notification';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { base64ToUrl } from 'src/utils/url';
import { useRouter } from 'src/routes/hooks';
import { CircularProgress } from '@mui/material';

export default function NotificationsPopover() {
  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(0);

  const { data: Notifications, isLoading } = useFetchNotificationsQuery({ token, page });
  const [markAllNotificationsAsSeenMutation, { data: marked }] =
    useMarkAllNotificationsAsSeenMutation();

  const [notifications, setNotifications] = useState([]);

  const [allFetched, setAllFetched] = useState(false);

  const [totalUnRead, setTotalUnread] = useState(0);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsSeenMutation({ token });
  };

  useEffect(() => {
    if (Notifications) {
      if (Notifications.notifications.length < 5) {
        setAllFetched(true);
      }
      const unread = Notifications.notifications.filter((item) => item.status === 'Unseen').length;
      setTotalUnread((prev) => prev + unread);
      setNotifications((n) => [...n, ...Notifications.notifications]);
    }
  }, [Notifications]);

  useEffect(() => {
    if (marked) {
      setTotalUnread(0);
      setNotifications((notification) =>
        notification.map((n) => {
          const temp = { ...n };
          temp.status = 'Seen';
          return temp;
        })
      );
    }
  }, [marked]);

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                handleClose={handleClose}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2).map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                handleClose={handleClose}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {!allFetched && (
          <Box sx={{ p: 1 }}>
            <LoadingButton loading={isLoading} loadingIndicator={<CircularProgress />} fullWidth disableRipple onClick={() => setPage((p) => p + 1)}>
              View More
            </LoadingButton>
          </Box>
        )}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    date: PropTypes.string,
    _id: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
    pic: PropTypes.string,
    payload: PropTypes.any,
    to: PropTypes.string,
  }),
  handleClose: PropTypes.func,
};

function NotificationItem({ notification, handleClose }) {
  const router = useRouter();
  const title = renderContent(notification);
  const pic = base64ToUrl(notification.pic);

  const openEmployeeProfile = () => {
    if (notification.payload && notification.payload.employee) {
      handleClose();
      router.push(`/user/${notification.payload.employee}`);
    }
  };

  const openNotification = () => {
    if (notification.payload && notification.payload.application) {
      handleClose();
      router.push(`/application`);
    } else if (notification.payload && notification.payload.department) {
      handleClose();
      router.push(`/department`);
    }
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.status === 'Unseen' && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={pic}
          alt="notification profile"
          sx={{ bgcolor: 'background.neutral' }}
          onClick={openEmployeeProfile}
        />
      </ListItemAvatar>
      <ListItemText
        onClick={openNotification}
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.date)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = <Typography variant="subtitle2">{notification.message}</Typography>;

  return title;
}
