/* eslint-disable import/no-unresolved */
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
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useFetchAllApplicationsQuery } from 'src/state/api/application';
import { useTheme } from '@mui/material';
import CustomSnack from 'src/components/snackbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import ApplicationUploadForm from '../application-upload-form';
import ApplicationTableToolbar from '../application-table-toolbar';
import ApplicationTableHead from '../application-table-head';
import ApplicationTableRow from '../application-table-row';

// ----------------------------------------------------------------------

export default function ApplicationView() {
  const theme = useTheme();

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  const [applications, setApplications] = useState([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('employeeName');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(null);

  const { data, refetch } = useFetchAllApplicationsQuery({ token, page, rowsPerPage });

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
      const newSelecteds = applications.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectOne = (event, id) => {
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
    inputData: applications,
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

  useEffect(() => {
    if (data) {
      setApplications(data.applications);
      setTotal(data.total);
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
        <Typography variant="h4">Applications</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenPopup}
        >
          Upload Application
        </Button>
      </Stack>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: '450px', height: '580px', padding: '20px' },
        }}
      >
        <ApplicationUploadForm
          setSnackbar={setSnackbar}
          refetch={refetch}
          handleCloseMenu={handleCloseMenu}
        />
      </Popover>
      <Card>
        {user && (user.role === 'HR' || user.department.pseudoAdmin) && (
          <ApplicationTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected[0]}
            setSnackbar={setSnackbar}
            refetch={refetch}
          />
        )}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ApplicationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'employeeName', label: 'Employee Name' },
                  { id: 'employeeId', label: 'Employee ID' },
                  { id: 'leaveType', label: 'Leave Type' },
                  { id: 'fromDate', label: 'From' },
                  { id: 'toDate', label: 'To' },
                  { id: 'reason', label: 'Reason' },
                  { id: 'status', label: 'Status' },
                  { id: 'document', label: 'Document' },
                ]}
              />

              {/* Table body */}
              <TableBody>
                {dataFiltered.slice(0, rowsPerPage).map((row) => (
                  <ApplicationTableRow
                    key={row._id}
                    employeeId={row.employee ? row.employee.employeeId : ''}
                    employeeName={
                      row.employee
                        ? `${row.employee.name.firstName} ${row.employee.name.lastName}`
                        : ''
                    }
                    profilePic={row.employee ? row.employee.profilePic : ''}
                    leaveType={row.leaveType}
                    from={row.fromDate}
                    to={row.toDate}
                    reason={row.reason}
                    status={row.status}
                    document={row.document}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleSelectOne(event, row._id)}
                  />
                ))}
                <TableEmptyRows
                  height={60}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />
                {notFound && <TableNoData query={filterName} />}
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
