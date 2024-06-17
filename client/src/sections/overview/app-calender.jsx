/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */

import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Popover, useTheme } from '@mui/material';

import './app-calender.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useSelector } from 'react-redux';

import {
  useFetchAttendanceQuery,
  useSwitchAttendanceStatusMutation,
} from 'src/state/api/attendance';
import DialogBox from './dialog-box';

// Create a localizer
const localizer = momentLocalizer(moment);

const CalendarComponent = ({ id, setSnackbar, refetchUser }) => {

  const theme = useTheme();

  const token = useSelector((state) => state.user.token);
  const user = useSelector(state => state.user.user);
  const { data, refetch } = useFetchAttendanceQuery({ token, id });

  const [switchAttendanceStatusMutation, { data: success, error }] = useSwitchAttendanceStatusMutation();

  const [events, setEvents] = useState([]);

  const [open, setOpen] = useState(null);
  const[openDialog, setOpenDialog] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState({});
  const [newStatus, setNewStatus] = useState("");

  const handleClose = () => {
    setOpen(null);
  };

  const handleEventSelect = (eventSelected, e) => {
    if(user.role === 'HR'){
      setSelectedEvent(eventSelected);
      setOpen(e.target);
    }
  };

  const getUserConfirmation = (confirm) => {
    setOpen(null);
    setOpenDialog(false);
    if(!confirm){
      setSelectedEvent({});
      return;
    }
    if(newStatus !== selectedEvent.title){
      const body = JSON.stringify({
        status: newStatus,
      });
      switchAttendanceStatusMutation({body, token, id: selectedEvent.id})
    }
    setSelectedEvent({});
  }

useEffect(() => {
  if(newStatus !== ''){
    setOpenDialog(true);
  }
}, [newStatus]);


  const eventStyleGetter = (event) => {
    const backgroundColor = event.title === 'Present' ? theme.palette.success.main : theme.palette.error.main; // Using Material Design color codes
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
      padding: '2px 5px',
      textAlign: 'center',
    };
    return {
      style: style,
    };
  };

  useEffect(() => {
    if (data) {
      const attendance = data.attendance.map((item) => {
        return {
          id: item._id,
          title: item.status,
          start: new Date(item.date), // Use the first time or just the date
          end: new Date(item.date),
          allDay: item.status === 'Present',
        };
      });
      setEvents(attendance);
    }
  }, [data]);

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
    if(success){
      refetch();
      setSnackbar({
        open: true,
        mssg: "Status Updated",
        bgColor: theme.palette.success.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      refetchUser();
    }
  }, [success, error, theme, setSnackbar, refetch, refetchUser]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventSelect}
      />
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <MenuItem value="Present" onClick={() => setNewStatus('Present')}>
          Present
        </MenuItem>
        <MenuItem value="Half Day" onClick={() => setNewStatus('Half Day')}>
          Half Day
        </MenuItem>
        <MenuItem value="Absent" onClick={() => setNewStatus('Absent')}>
          Absent
        </MenuItem>
        <MenuItem value="Medical Leave" onClick={() => setNewStatus('Medical Leave')}>
          Medical Leave
        </MenuItem>
        <MenuItem value="Casual Leave" onClick={() => setNewStatus('Casual Leave')}>
          Casual Leave
        </MenuItem>
      </Popover>
    <DialogBox open={openDialog} title="Confirm?" desc={`Change status from ${selectedEvent.title} to ${newStatus}?`} getUserConfirmation={getUserConfirmation} />
    </div>
  );
};

const AppCalender = (props) => {
  return (
    <div>
      <h1>Attendance Calendar</h1>
      <CalendarComponent {...props} />
    </div>
  );
};

export default AppCalender;
