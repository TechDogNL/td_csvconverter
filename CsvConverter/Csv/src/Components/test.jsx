import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete} from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import _, { compact } from 'lodash';
import converter from "./API/CsvConverter";
import TextField from '@mui/material/TextField';


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

const [rows,setRows] = useState([]);
const [mainArray,setMainArray] = useState([]);
const [index, setIndex] = useState(0)
const [currentArray,setCurrentArray] = useState([]);
const [disabledRow,setDisabledRow] = useState([]);
const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3"]);
const [selectedRow, setSelectedRow] = useState(null);
const [disableColumn, setDisableColumn] = useState([]);

const count = mainArray.length

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
    if(mainArray.length > 0)
    {
        setShowTabel(true);
        setShowDrop(false);
        console.log("length",mainArray.length);
        
    }
    else{
        setShowTabel(false);
        setShowDrop(true);
    }
    console.log("mainArray",mainArray);
    console.log("disabledrow",disabledRow);
    console.log("selectedrow",selectedRow)
},[mainArray,disabledRow,selectedRow,])

useEffect(()=>{
    if(showTabel)
    {
        const initialDisabledRow = mainArray && mainArray[index] ?
                Array.from({ length: mainArray[index].length }, (_, index) => index) : [];
                setDisabledRow(initialDisabledRow)
   
    }
},[showTabel,index])


const acceptedFileItems = uploadedFiles.length > 0 ?(
 acceptedFiles.map(file => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
    </li>
 ))
) : (
    <li>No files uploaded</li>
)

const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
            {errors.map(e => <li key={e.code}>{e.message}</li>)}
        </ul>
    </li>
));


function handleCSV () 
{
    uploadedFiles.forEach(file => { 
        Papa.parse(file, {
            delimiter:";",
            skipEmptyLines: true,
            dynamicTyping:true,
            complete: function(results) {
                console.log('Parsed CSV data:', results.data);    
                const convertedData = results.data.map(row =>
                   compact(row).map(cell => {
                        if (typeof cell === 'string' && !isNaN(parseFloat(cell))) {
                            return parseFloat(cell.replace(',', '.'));
                        } else {
                            return cell;
                        }
                    })
                );

                setMainArray(prevArray =>[...prevArray,convertedData]);

                
                console.table(mainArray);
                setCurrentArray(mainArray[index])
    
            }
        });
    });

};


function reset ()
{
    setMainArray([]);
    setUploadedFiles([]);
    setCurrentArray([]);
    setDisabledRow([]);
    setIndex(0);
}

function check(index,rowIndex){
    setSelectedRow(rowIndex);

    const newDisabledRow = [];
    for(let i = 0; i< rowIndex; i++)
    {
        newDisabledRow.push(i)
    }
    setDisabledRow(newDisabledRow);
}

const toggleTable =(direction)=>{
    if(direction === 'next' && index < count -1)
        {
            setIndex(index + 1);
            setSelectedRow(null);
        }
    
    else if (direction === 'prev' && index > 0)
        {
            setIndex(index - 1);   
            setSelectedRow(null);
        }
}

const handleChange = (event,newValue) => {
    
    //only enable that column
};

async function toDatabase (){
//  const response = await converter.post('sendcsv', {csvData:csvData}); //het verstuurd maar 1 array,miss alles op 1 lijn zetten
//de column moet we kloppen met elkaar dus barcode bij barcode
 console.log("response data",response);
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
                <button onClick={handleCSV}>verder</button>
        </div>
        }
        <div>
            {showTabel && 
            <div>
                <div>
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                {/* headers */}
                <TableRow>
                    <TableCell sx={{ fontWeight:'bold' }} > 
                        eerste regel product
                    </TableCell>
                    {mainArray[index] && mainArray[index][0].map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight:'bold' }} >
                        <Autocomplete
                            id="keuzesInput"
                            options={options}
                            onChange={(event,newValue) => handleChange(event,newValue,index)}
                            // getOptionDisabled={disableOption}
                            renderInput={(params) => (
                            <TextField {...params} label="Kolom matchen of overslaan" variant="outlined" style={{ width: 200 }} />
                            )}
                            />
                    </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {/* rows */}
                {mainArray[index] && mainArray[index]
                .filter(row=>row.length > 0, _.remove(rows, row => row.length === 0))
                .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell> 
                                <input type="radio" name="group" id="selected" checked={selectedRow === rowIndex} onChange={()=> check(index,rowIndex)} />                    
                            </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} style={{color : disabledRow.includes(rowIndex)? 'gray' : 'black'}} > 
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <button onClick={reset}>terug</button>
    <button onClick={()=>toggleTable('prev')} disabled={index === 0}>vorige file</button>
    <button onClick={()=>toggleTable('next')} disabled={index === count -1}>volgende file</button>
    <button onClick={toDatabase}>naar database</button>
    
                </div>
            </div>
            }
        </div>
    </div> 

       //disabledRow niet andersom doen? dus enabledrows met alle data daar in 
)}


export default Test;