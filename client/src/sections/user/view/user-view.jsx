import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { useFetchAllEmployeesQuery, useRemoveEmployeeMutation } from 'src/state/api/employee';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomSnack from 'src/components/snackbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const router = useRouter();
  const theme = useTheme();

  const token = useSelector((state) => state.user.token);
  const userRole = useSelector((state) => state.user.user.role);

  const { data, refetch } = useFetchAllEmployeesQuery({ token });
  const [removeEmployeeMutation] = useRemoveEmployeeMutation();

  const initialSnackbar = {
    open: false,
    mssg: '',
    bgColor: theme.palette.error.dark,
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
  };

  const [snackbar, setSnackbar] = useState(initialSnackbar);

  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const removeEmployee = (id) => {
    removeEmployeeMutation({ token, id }).then(() => {
      const updatedUsersList = users.filter((user) => user._id !== id);
      setUsers(updatedUsersList);
    });
    setSelected([]);
  };

  const notFound = !dataFiltered.length && !!filterName;

  const redirect = () => {
    router.push('/newUser');
  };

  useEffect(() => {
    if (data) {
      setUsers(data.employees);
    }
  }, [data]);

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
        <Typography variant="h4">Users</Typography>

        {userRole === 'HR' && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={redirect}
          >
            New User
          </Button>
        )}
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          removeEmployee={() => removeEmployee(selected[0])}
          setSnackbar={setSnackbar}
          refetch={refetch}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'employeeId', label: 'Employee ID' },
                  { id: 'role', label: 'Role' },
                  { id: 'department', label: 'Department' },
                  { id: 'salary', label: 'Base Salary', align: 'center' },
                  { id: 'finalSalary', label: 'Salary Till Now', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id}
                      employeeId={row.employeeId}
                      name={`${row.name.firstName} ${row.name.lastName}`}
                      role={row.role}
                      salary={row.salary.base}
                      department={row.department ? row.department.name : '-'}
                      profilePic={row.profilePic}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                      removeEmployee={() => removeEmployee(row._id)}
                      finalAmount={row.salary.finalAmount}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
