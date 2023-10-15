/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Pagination,
  Card
} from '@mui/material';
import { useLoaderData, useSearchParams } from 'react-router-dom';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// import _ from 'lodash';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('name', {
    header: 'Full Name',
    cell: (value) => {
      return value.getValue();
    }
  }),
  columnHelper.accessor('email', {
    header: 'E-mail Address',
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('Action', {
    header: 'Action',
    cell: (value) => {
      return <>
        <Button size="small" variant="text">Text</Button>
      </>;
    }
  }),
];

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState({
    pageIndex: 0, // page index matlab = page number
    pageSize: 5, // page size matlab = limit
  });

  /// Getting user data from loader
  const users = useLoaderData();

  const [sorting, setSorting] = useState([]);
  console.log(sorting);

  useEffect(() => {
    /// For sorting only
    if (sorting.length > 0) {
      setSearchParams({
        sort: sorting
          .map((el) => `${el.id}:${el.desc ? 'desc' : 'asc'}`)
          .join(','),
      });
    } else {
      const obj = Object.fromEntries(searchParams);
      delete obj.sort;
      setSearchParams(obj);
    }

    /// For pegination only
    setSearchParams({
      page: table.getState().pagination.pageIndex + 1,
      limit: table.getState().pagination.pageSize,
    });
  }, [sorting, pagination]);

  const table = useReactTable({
    data: users.data,
    state: {
      sorting,
      pagination,
    },
    pageCount: users.totalCount / users.count,
    manualPagination: true,
    onPaginationChange: setPagination,
    sortDescFirst: false,
    onSortingChange: setSorting,
    enableMultiSort: true,
    manualSorting: true,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <Stack sx={{ p: 2 }} style={{ width: '100%', maxWidth: '30%' }}>
        <FormControl size="small">
          <InputLabel id="demo-simple-select-label">
            Show per page record
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={table.getState().pagination.pageSize}
            label="Show per page record"
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100, 200, 500].map((el) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.grey[100]
                },
              }} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    style={{color:'#D98880'}}
                    key={header.id}
                  // onClick={() => header.column.toggleSorting(null, true)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {/* {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null} */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.grey[100],
                },
              }} key={row.id} onClick={() => console.log(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>


        {/* Simple Pagination */}
        {/* <Stack direction="row" justifyContent={'space-between'} sx={{ p: 3 }}>
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            color="primary"
            variant="contained"
          >
            previous page
          </Button>
          <Typography>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </Typography>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            color="primary"
            variant="contained"
          >
            next page
          </Button>
        </Stack> */}

        {/* Pagination styled */}
        <Stack direction="row" justifyContent={'center'} sx={{ p: 3 }}>
          <Pagination
            page={table.getState().pagination.pageIndex + 1}
            onChange={(e, val) => table.setPageIndex(val - 1)}
            count={table.getPageCount()}
            showFirstButton
            showLastButton
          />
        </Stack>

      </TableContainer>
    </Card>
  );
};

export default Users;