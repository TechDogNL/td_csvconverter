import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button} from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import _, { compact, first, isEmpty } from 'lodash';
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

const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [processedData, setProcessedData] = useState([]);


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

useMemo(() => {
    const newData = [];
    
    for (let i = 0; i < enabledColumns.length; i++) {
        // Slice enabledColumns with disabledRows
        const columnData = enabledColumns[i].filter((_, rowIndex) => !disabledRows.includes(rowIndex));
        
        // Push the processed column data to the newProcessedData array
        newData.push(columnData);
    }  
    setProcessedData(newData);  
},[enabledRows,disabledRows,enabledColumns])

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
    console.log("column enabled",enabledColumns)
    console.log("processeddata",processedData)
    console.log("enabledrows",enabledRows)
    console.log("disabledrows",disabledRows)
},[disabledOptions,mainArray,enabledColumns,disabledColumns,processedData,enabledRows,disabledRows])

useEffect(()=>{
    settingDisableTable();
},[showTabel,index,options,])

const settingDisableTable = () => {
    if(showTabel) {
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

{/* handling converting csv to an multidimensional array */}
function handleCSV () 
{
    uploadedFiles.forEach(file => { 
        Papa.parse(file, {
            delimiter:";",
            skipEmptyLines: true,
            dynamicTyping:true,
            encoding: "UTF-8",
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

                const convertedToString = convertedData.map(row =>
                    row.map(cell => String(cell))
                );
                const validRows = convertedToString.filter(row => Array.isArray(row) && row.length > 0);
                
                setMainArray(prevArray => {
                    const newArray = [...prevArray, validRows];
                    setCurrentArray(newArray[index]);
                    return newArray;
                })
            }
        });
    });
};

{/*//nog een array inmaken? 
//array
// array
// array
//array misschien dan wel in useeffect of als het kan usememo */}
{/* makes everything empty when you press 'terug' */}
const  reset = () =>
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
    setCurrentOptions([]);
    setEnabledColumns([]);
    setProcessedData([]);
}
{/* for selecting rows */}
function check(index,rowIndex){
   //deze ook veranderen naar currentaray?
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

{/* this is for navigating the table */}
const toggleTable =(direction)=>{
    let newIndex = index;
    if(direction === 'next' && index < count -1){
        newIndex = index + 1;
    } else if (direction === 'prev' && index > 0 ){
        newIndex = index -1;
    }
    setIndex(newIndex);
    setCurrentArray(mainArray[newIndex]);
    setSelectedRow(null);
    setDisabledOptions([]); 
    setDisabledRows([]); // een nieuwe array aanmaken voor een nieuw rows als 'prev' niks mee doen
    setEnabledRows([]);
    setInputValues('');
    setCurrentOptions([]);

}
{/* this happens when you change the value in autocomplete, it sets the options as a input value otherwise it stays empty */}
const handleChange = (event,newValue,index) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue || '';
    setInputValues(updatedInputValues);
    setDisableTable(false)

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
        console.log("index",index)

        {/* looping through the current array for the column */}
        if (!currentOptions[index]) {
        const enabledColumn = currentArray.map(row => row[index]);
        setEnabledColumns(prevColumns => [...prevColumns, enabledColumn]);
        }

    }
};

{/* remove the value out of autocomplete and out of disabledoptions */}
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
    {/* removing the column with the coresponding button */}
    const columnToRemove = currentArray.map(row => row[index]);
    setEnabledColumns(prevColumns => prevColumns.filter(column => !column.every((value, i) => value === columnToRemove[i])));
};

{/* cellstyle */}
const cellStyle = (disableTable,disabledRows,rowIndex,currentOptions,) => {
        if (disableTable) {
            return {
                color: 'gray',
                backgroundColor: '#f0f0f0'
            }
        } else {
            if(currentOptions || processedData)
            {
            return {
                // color: disabledRows.includes(rowIndex) ? 'gray' : 'black',
                // color: enabledColumn.includes(itemsAtIndex) ? 'black' : 'gray'
                // color: processedData.includes(rowIndex,index) ? 'black' : 'gray', 
                backgroundColor: disabledRows.includes(rowIndex) ? '#f0f0f0' : 'transparent'
            }
        }
    }
}  

// const processedData = (enabledColumns, disabledRows) => {
//     const newProcessedData = [];

//     for (let i = 0; i < enabledColumns.length; i++) {
//         const columnData = enabledColumns[i].filter((_, rowIndex) => !disabledRows.includes(rowIndex));
//         newProcessedData.push(columnData);
//     }

//     return newProcessedData;
// };
//dit moet ik apart doen voor elke currentArray

{/* sending the data to the database */}
async function toDatabase (){
    // const sendData = processedData(enabledColumns, disabledRows);
    // console.log(sendData);
//  const response = await converter.post('sendcsv', {csvData:csvData});
//de column moet we kloppen met elkaar dus barcode bij barcode
//  console.log("response data",response);
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
                {/* components */}
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
                            
                            <Button variant="text" onClick={()=> Overslaan(index)} style={{  marginLeft: 45 }}> 
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
                                <TableCell key={cellIndex} style={cellStyle(disableTable,disabledRows,rowIndex,currentOptions,)} > 
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
)}

export default Test;