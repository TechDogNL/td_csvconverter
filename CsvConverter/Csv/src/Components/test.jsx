import React, {useEffect, useMemo, useState} from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import _, { compact } from 'lodash';

function Test (){

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        cursor: 'pointer', 
      };
      
      const focusedStyle = {
        borderColor: '#2196f3'
      };
      
      const acceptStyle = {
        borderColor: '#00e676'
      };
      
      const rejectStyle = {
        borderColor: '#ff1744'
      };
      
const [showTabel,setShowTabel] = useState(false);
const [showdrop,setShowDrop] = useState(true);
const [importData, setImportData] = useState([]);
const [uploadedFiles, setUploadedFiles] = useState([]);
const [csvData, setcsvData] = useState([]);
const [rows,setRows] = useState([]);
const [header,setHeaders] = useState([]);

const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
} = useDropzone({
    maxFiles: 6, 
    accept: {'text/csv': []}  
});
// const  [headers,...rows] = array;

const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
}), [
    isFocused,
    isDragAccept,
    isDragReject
]);

useMemo(() =>{
    setUploadedFiles(acceptedFiles);
},[acceptedFiles]);




useEffect(()=>{
    if(csvData.length >0)
    {
        const [csvHeaders, ...csvRows] = csvData;
        setHeaders(csvHeaders);
        setRows(csvRows);
        console.log("csvdata",csvData);
        console.log("headers",header)
        console.log("rows",rows)
    }
    else{

    }
},[csvData])

const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
    </li>
));

const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
            {errors.map(e => <li key={e.code}>{e.message}</li>)}
        </ul>
    </li>
));


function showing () 
{
    setShowTabel(true);
    setShowDrop(false);
    uploadedFiles.forEach(file => { 
        Papa.parse(file, {
            delimiter:";",
            skipEmptyLines: true,
            complete: function(results) {         
                console.log('Parsed CSV data:', results.data);

                
                // setcsvData(prevResult => [...prevResult, results.data]);   
                setcsvData(results.data.map(row =>compact(row))); //nu kan ik niet meerdere array in csvData stoppen
            } 
        });
    });

};

function hiding ()
{
    setShowTabel(false);
    setShowDrop(true);
}

return(
    <div>
        {showdrop &&
        <div>
        <section className="container">
                    <h1>Test</h1>
                    <div {...getRootProps({style})}>
                        <input {...getInputProps()} />
                        <p>Klik hier om 1 of meer bestanden te selecteren</p>
                        <em>(Je kunt maximaal 6 bestanden hier neerzetten)</em>
                    </div>
                    <aside>
                        <h4>Geaccepteerde bestanden</h4>
                        <ul>{acceptedFileItems}</ul> 
                        <h4>Afgewezen bestanden</h4>
                        <ul>{fileRejectionItems}</ul>
                    </aside>
                </section>
                <button onClick={showing}>verder</button>
        </div>
        }
        <div>
            {showTabel && 
            <div>
                <div>
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                {/* Render table headers */}
                <TableRow>
                    <TableCell sx={{ fontWeight:'bold' }} > 
                        eerste regel 
                    </TableCell>
                    {header.map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight:'bold' }} >
                        {header}
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {/* Render table rows */}
                {rows.filter(row => row.length > 0, _.remove(rows, row => row.length === 0))
                .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell> 
                            <input type="radio" name="group" /> 
                        </TableCell>
                    {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                            {cell}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <button onClick={hiding}>terug</button>
    <button >naar database</button>
                </div>
            </div>
            }
        </div>
    </div> 

       
)}


export default Test;