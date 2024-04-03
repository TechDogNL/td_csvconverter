import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button} from "@mui/material";
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

const [disableTable,setDisableTable] = useState(false);
const [disabledRows,setDisabledRows] = useState([]);
const [enabledRows,setEnabledRows] = useState([]);
const [selectedRow, setSelectedRow] = useState(null);

const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3","barcode"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions, setCurrentOptions] = useState(Array.from({ length: options.length }, () => ''));
const [inputValues, setInputValues] = useState(options.map(() => ''));

// const [enabledColumn,setEnabledColumn] = useState([]);

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
    }
    else{
        setShowTabel(false);
        setShowDrop(true);
    }
    console.log("disabled options", disabledOptions)
   

},[disabledOptions,mainArray])

useEffect(()=>{
    settingDisableTable();
},[showTabel,index,options,])

const settingDisableTable = () => {
    if(showTabel)
    {
        setDisableTable(true);
    }
}

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
                const validRows = convertedData.filter(row => Array.isArray(row) && row.length > 0);
                setMainArray(prevArray =>[...prevArray,validRows]);
            
                
                console.table(mainArray);
                // setCurrentArray(mainArray[index])
            }
        });
    });
};


const  reset = (index) =>
{
    setMainArray([]);
    setUploadedFiles([]);
    setCurrentArray([]);
    setDisableTable([]);
    setDisabledRows([]);
    setEnabledRows([]);
    setIndex(0);
    setSelectedRow(null);
    setDisabledOptions([]);
    setInputValues('');
}

function check(index,rowIndex){
   
    setSelectedRow(rowIndex);

    const newDisabledRows = [];
    const newEnabledRows = [];
    for(let i = 0; i <mainArray[index].length; i++)
        if (i < rowIndex) {
            newDisabledRows.push(i);
        } else if (i => rowIndex) {
            newEnabledRows.push(i);
        }
    setDisabledRows(newDisabledRows);
    setEnabledRows(newEnabledRows);

}


const toggleTable =(direction)=>{
    if(direction === 'next' && index < count -1)
        {
            setIndex(index + 1);
            setSelectedRow(null);
            setDisabledOptions([])
            //de enabledrows of iets anders in een array zetten en zo houden
            //eerst in een andere array zetten en dan pas resetten

            setDisabledRows([])
            setEnabledRows([])
            setInputValues('');
        }
    
    else if (direction === 'prev' && index > 0)
        {
            setIndex(index - 1);   
            setSelectedRow(null);
            setDisabledOptions([])
            setDisabledRows([])
            setEnabledRows([])
            setInputValues('');
        }
}

const handleChange = (event,newValue,index) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue || '';
    setInputValues(updatedInputValues);
    setDisableTable(false);
    console.log("current options",currentOptions)
      if (newValue) {
        if (currentOptions[index]) {
            setDisabledOptions(prevOptions => prevOptions.filter(option => option !== currentOptions[index]));
        }
        setDisabledOptions(prevOptions => [...prevOptions, newValue]);
        setCurrentOptions(prevOptions => {
            const newOptions = [...prevOptions];
            newOptions[index] = newValue;
            return newOptions;
        });
    }
 
    // if (newValue && !disabledOptions.includes(newValue)) {
    //     const newdisabledoptions = disabledOptions.filter(option =>option !== '');
    //     setDisabledOptions(prevOptions =>[...newdisabledoptions,newValue]);
    //         if(newValue)
    //         {
    //             //if the value is in the same textfield make it enabled, but disabled for other textfields
    //         }
    // }
};

const Overslaan = (index) => {
    const clearedValue = inputValues[index];
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = '';
    setInputValues(updatedInputValues);
    
    setDisabledOptions(prevOptions => prevOptions.filter(opt => opt !== clearedValue));
    setCurrentOptions(prevOptions => {
        const newOptions = [...prevOptions];
        newOptions[index] = '';
        return newOptions;
    });
};

const settingDisabledOptions = (event,index) =>{


    // const newValue = inputValues[index];
    // //zolang je in dezelfde textfield zit dan moet de option blijven
    // if (newValue && !disabledOptions.includes(newValue)) {
    //     const newdisabledoptions = disabledOptions.filter(option =>option !== '');
    //     setDisabledOptions(prevOptions =>[...newdisabledoptions,newValue]);
    // }
}


const cellStyle = (disableTable,disabledRows,rowIndex) => {
    if (disableTable){
        return {
            color: 'gray',
            backgroundColor: '#f0f0f0'
        }
    } else {
        return {
            color: disabledRows.includes(rowIndex) ? 'gray' : 'black',
            backgroundColor: disabledRows.includes(rowIndex) ? '#f0f0f0' : 'transparent'
        }
    }
}


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
                    {mainArray[index] && mainArray[index][0].map((array, index) => (
                    <TableCell key={index} sx={{ fontWeight:'bold' }} >
                        <div>
                        <Autocomplete
                            id={`keuzesInput_${index}`}
                            options={options}
                            value={inputValues[index] || null}
                            disableClearable
                            onChange={(event,newValue,) => handleChange(event,newValue,index)}
                            getOptionDisabled={(option => disabledOptions.includes(option))}
                            renderInput={(params) => (
                                <TextField {...params} label="Kolom matchen of overslaan" variant="outlined" style={{ width: 200 }}   
                                    InputProps={{
                                    ...params.InputProps,           
                                    }} 
                                />
                                )}
                            />
                            
                            <Button variant="text" onClick={()=> Overslaan(index)} style={{  marginLeft: 45 }}> {/* ik wil hier de value meegeven dat in de textfield */}
                            Overslaan
                            </Button>                           
                        </div>
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
                                <TableCell key={cellIndex} style={cellStyle(disableTable,disabledRows,rowIndex)} > 
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