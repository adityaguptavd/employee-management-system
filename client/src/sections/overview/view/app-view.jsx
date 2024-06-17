import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';

import { useFetchAdminSummaryQuery } from 'src/state/api/summary';

import AppLeavesTaken from '../app-leaves-taken';
import AppEmployeeAbsent from '../app-employee-absent';
import AppDocumentsExpiring from '../app-documents-expiring-summary';

// ----------------------------------------------------------------------

export default function AppView() {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [skip, setSkip] = useState(true);
  const { data, refetch } = useFetchAdminSummaryQuery({ token }, { skip });

  useEffect(() => {
    if (user && user.role === 'HR') {
      setSkip(false);
    }
  }, [user]);

  useEffect(() => {
    if (!skip) {
      refetch();
    }
  }, [refetch, skip]);

  useEffect(() => {
    if (user && user.role !== 'HR') {
      router.push(`/user/${user._id}`);
    }
  }, [user, router]);

  return (
    <>
      {user && (
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back 👋
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <AppDocumentsExpiring
                title="Expiring Documents"
                total={data ? data.expiringDocuments : 0}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/ic_documents.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppDocumentsExpiring
                title="Total Employees"
                total={data ? data.totalEmployees : 0}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppDocumentsExpiring
                title="Total Departments"
                total={data ? data.totalDepartments : 0}
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic_department.jpg" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppDocumentsExpiring
                title="Applications Pending"
                total={data ? data.pendingApplications : 0}
                color="error"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
              />
            </Grid>

            <Grid xs={12} md={6} lg={8}>
              <AppEmployeeAbsent
                title="Employees Absent This Year"
                subheader="Across top 3 departments"
                chart={{
                  labels: Array.from(Array(12).keys()).map(
                    (month) => `${month + 1}/01/${new Date().getFullYear()}`
                  ),
                  series: data
                    ? data.attendanceSummary.map((summary, i) => {
                        const renderData = {
                          name: summary.departmentName,
                          data: summary.attendance,
                          type: 'line',
                          fill: i === 1 ? 'gradient' : 'solid',
                        };
                        if (i === 0) {
                          renderData.type = 'column';
                        } else if (i === 1) {
                          renderData.type = 'area';
                        }
                        return renderData;
                      })
                    : [
                        {
                          name: 'NA',
                          type: 'column',
                          fill: 'solid',
                          data: Array(12).fill(0),
                        },
                      ],
                }}
              />
            </Grid>

            <Grid xs={12} md={6} lg={4}>
              <AppLeavesTaken
                title="Leaves Taken This Month"
                chart={{
                  series: data
                    ? data.leaveSummary.map((leaveType) => ({
                        label: leaveType._id,
                        value: leaveType.totalLeaves,
                      }))
                    : [
                        { label: 'Sick Leave', value: 0 },
                        { label: 'Personal Attend', value: 0 },
                        { label: 'Others', value: 0 },
                      ],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
