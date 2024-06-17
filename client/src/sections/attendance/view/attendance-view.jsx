import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useParams } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { useFetchAttendanceQuery } from 'src/state/api/attendance';

import TableEmptyRows from '../table-empty-rows';
import { emptyRows } from '../utils';
import AttendanceTableHead from '../attendance-table-head';
import AttendanceTableRow from '../attendance-table-row';

// ----------------------------------------------------------------------

export default function AttendancePage() {

  
  const { id: userId, name } = useParams();

  const token = useSelector(state => state.user.token);

  const [attendance, setAttendance] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [total, setTotal] = useState(0);

  const { data } = useFetchAttendanceQuery({token, id: userId, page, rowsPerPage});

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(()=> {
    if(data){
      setAttendance(data.attendance);
      setTotal(data.total);
    }
  }, [data]);

  return (
    <Container>
      <Stack direction="column" spacing={1} mb={5}>
        <Typography variant="h4">Attendance</Typography>
        <Typography variant="subtitle">{name}</Typography>
      </Stack>
      
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AttendanceTableHead
                order={order}
                orderBy={orderBy}
                rowCount={attendance.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'date', label: 'Date' },
                  { id: 'status', label: 'Status' },
                  { id: 'daySalary', label: 'Salary Added' },
                  { id: 'entry', label: 'Entry' },
                  { id: 'exit', label: 'Exit' },
                ]}
              />
              <TableBody>
                {attendance
                  .slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <AttendanceTableRow
                      key={row._id}
                      date={row.date}
                      status={row.status}
                      daySalary={row.daySalary}
                      entryExitTime={row.entryExitTime}
                    />
                  ))}

                <TableEmptyRows
                  height={60}
                  emptyRows={emptyRows(page, rowsPerPage, attendance.length)}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
