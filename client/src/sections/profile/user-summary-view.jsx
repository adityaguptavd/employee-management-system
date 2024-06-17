/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

export default function UserSummaryView({ summary, name, id, effectiveSalary }) {
  console.log(effectiveSalary, 'effectiveSalary');
  const router = useRouter();
  const getLeavesByStatus = () => {
    const leave = {
      Approved: 0,
      Rejected: 0,
      Pending: 0,
    };
    if (summary && summary.leaveSummary) {
      summary.leaveSummary.forEach((each) => {
        leave[each._id] = each.totalLeaves;
      });
    }
    return leave;
  };

  const getAttendanceByStatus = () => {
    const attendance = {
      Present: 0,
      Absent: 0,
      'Half Day': 0,
      Leave: 0,
    };
    if (summary && summary.attendanceSummary) {
      summary.attendanceSummary.forEach((each) => {
        attendance[each._id] = each.total;
      });
    }
    return attendance;
  };

  const { Approved, Rejected, Pending } = getLeavesByStatus();
  const attendance = getAttendanceByStatus();
  const { Present, Absent, Leave } = attendance;
  const halfDay = attendance['Half Day'];

  const redirect = () => {
    router.push(`/attendance/${name}/${id}`);
  };

  return summary ? (
    <Card
      sx={{
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flexGrow: 1,
      }}
    >
      <Typography variant="h4">Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={4} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Base Salary: </Typography>
            <Typography variant="body2">{summary.salary.base.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Effective Salary: </Typography>
            <Typography variant="body2">{summary.salary.finalAmount.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Deductions: </Typography>
            <Typography variant="body2">{summary.salary.deductions.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Last Updated: </Typography>
            <Typography variant="body2">
              {summary.salary.lastUpdated
                ? fDate(summary.salary.lastUpdated, 'dd/MM/yyyy')
                : 'No payment yet!'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Leaves Applied: </Typography>
            <Typography variant="body2">{Approved + Pending + Rejected}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Leaves Approved: </Typography>
            <Typography variant="body2">{Approved}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Leaves Pending: </Typography>
            <Typography variant="body2">{Pending}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Leaves Rejected: </Typography>
            <Typography variant="body2">{Rejected}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={4} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Present: </Typography>
            <Typography variant="body2">{Present} days</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Absent: </Typography>
            <Typography variant="body2">{Absent} days</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Half Day: </Typography>
            <Typography variant="body2">{halfDay} days</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">On Leave: </Typography>
            <Typography variant="body2">{Leave} days</Typography>
          </Stack>
          <Button sx={{ marginTop: '20px' }} onClick={redirect}>
            View Full Attendance
          </Button>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <Typography>Unable to fetch summary!</Typography>
  );
}

UserSummaryView.propTypes = {
  summary: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
};
