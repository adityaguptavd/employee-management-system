import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import CustomSnack from 'src/components/snackbar';

import { useFetchAllDepartmentsQuery, useRemoveDepartmentMutation } from 'src/state/api/department';

import Iconify from 'src/components/iconify';
import { useTheme } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { useRouter } from 'src/routes/hooks';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import DepartmentTableRow from '../department-table-row';
import DepartmentTableHead from '../department-table-head';
import DepartmentTableToolbar from '../department-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import NewDepartmentForm from '../department-new-form';

// ----------------------------------------------------------------------

export default function DepartmentPage() {
  const theme = useTheme();
  const router = useRouter();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user.role !== 'HR') {
      router.push('/404');
    }
  }, [user, router]);

  const { data, refetch } = useFetchAllDepartmentsQuery({ token });

  const [removeDepartmentMutation, { data: removed, error: removeError }] =
    useRemoveDepartmentMutation();

  const [edit, setEdit] = useState(null);

  const [departments, setDepartments] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);

  const initialSnackbar = {
    open: false,
    mssg: '',
    bgColor: theme.palette.error.dark,
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  };

  const [snackbar, setSnackbar] = useState(initialSnackbar);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = departments.map((n) => n._id);
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
    inputData: departments,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenPopup = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const editDepartment = (event) => {
    const [selectedDept] = departments.filter((dept) => dept._id === selected[0]);
    setEdit(selectedDept);
    setOpen(event.currentTarget);
  };

  const removeDepartment = (event) => {
    const [selectedDept] = departments.filter((dept) => dept._id === selected[0]);
    removeDepartmentMutation({ token, id: selectedDept._id });
  };

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
    }
  }, [data]);

  useEffect(() => {
    if(removed){
      setSelected([]);
      refetch();
    }
    if(removeError){
      let mssg = '';
      if (removeError.status === 'FETCH_ERROR') {
        mssg = 'Server is not responding!';
      } else {
        mssg = removeError.data.error;
      }
      setSnackbar({
        open: true,
        mssg,
        bgColor: theme.palette.error.dark,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  }, [removed, removeError, refetch, theme]);

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
        <Typography variant="h4">Departments</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenPopup}
        >
          New Department
        </Button>
      </Stack>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: '450px', height: '490px', padding: '20px' },
        }}
      >
        <NewDepartmentForm
          refetch={refetch}
          handleCloseMenu={handleCloseMenu}
          edit={edit}
          setEdit={setEdit}
          setSnackbar={setSnackbar}
        />
      </Popover>

      <Card>
        <DepartmentTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          editDepartment={editDepartment}
          removeDepartment={removeDepartment}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DepartmentTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'open', label: 'Open Time' },
                  { id: 'close', label: 'Close Time' },
                  { id: 'pseudoAdmin', label: 'Pseudo Admin' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <DepartmentTableRow
                      key={row._id}
                      name={row.name}
                      description={row.description}
                      open={row.open}
                      close={row.close}
                      pseudoAdmin={row.pseudoAdmin ? "Yes" : "No"}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, departments.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={departments.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
