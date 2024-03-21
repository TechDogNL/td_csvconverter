import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';



function Tabel() {
  const data = [
 [ 'bravo', '2', '9', '16', '1,71E+12', ''],
 ['charlie', '3', '10', '17', '2,71E+12', ''],
 ['delta', '4', '11', '18', '3,71E+12', ''],
 ['echo', '5', '12', '19', '4,71E+12', ''],
 ['foxtrot', '6', '13', '20', '5,71E+12', ''],
 ['8,71E+12', '7', '14', '21', '6,71E+12', ''],
];

  const [headers, ...rows] = data;

  // Format rows into objects with id and column data
  const formattedRows = rows.map((row, index) => {
    const rowData = {};
    row.forEach((value, columnIndex) => {
      rowData[`col${columnIndex + 1}`] = value;
    });
    return { id: index + 1, ...rowData };
  });

  
  return (
    <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={formattedRows}
      columns ={headers.map((header, index) => ({
        field: `col${index + 1}`,
        headerName: header,
        width: 150,
        id:index
      }))}
    />
  </div>
);
}

export default Tabel;