import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button,Switch,FormControlLabel} from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import _, { compact, first, isEmpty } from 'lodash';
import converter from "./API/CsvConverter";
import TextField from '@mui/material/TextField';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const [table,setTable] = useState(["products","temps"]);
const [currentTables,setCurrentTables] = useState(Array.from({}) )
const [inputValuesTable,setInputValuesTable] = useState(table.map(()=> ''))

const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3","barcode","test"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions,setCurrentOptions] = useState([])
const [inputValues, setInputValues] = useState(options.map(() => ''));

const [currentEnabledColumns,setCurrentEnabledColumns] = useState([]); //dit doen voor de tableconfigs zodat het de current als een static heeft
const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [processedData, setProcessedData] = useState({});
const [finalData,setFinaldata] = useState([]); //hier alle processedData inzetten?
const [compareProductNumber,setCompareProductNumber] = useState([]);
const [enabledSwitch,setEnabledSwitch] = useState(false)
const [tableConfig,setTableConfig] = useState([]); //hier alle gegevens van een tabel zetten dus enabledrows en enabledcolumns dus de config van een tabel



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

{/* this is the final data thats getting send to the database */}
useMemo(() => {
    if (mainArray.length === 0) {
        setProcessedData({})
        return;
    }
    const newData = [];
    
    
    //foreach enabledrow make a object and store its values to the assiocated columnname
    const rowsLength = enabledRows.length;
    console.log("rowslength",rowsLength);
     //voor elke row een object aanmaken
     enabledRows.forEach((rowIndex) => {
        const newRow = {};

        enabledColumns.forEach((columnIndex) => {
            const columnName = currentOptions[columnIndex];
            if (!columnName) return; // Skip if columnName is undefined

            const columnValue = currentArray[rowIndex][columnIndex];
            
            if (['productnaam', 'order1', 'order2'].includes(columnName)) {
                if (!newRow.products) {
                    newRow.products = {};
                }
                newRow.products[columnName] = columnValue;
            } else {
                if (!newRow.temps) {
                    newRow.temps = {};
                }
                newRow.temps[columnName] = columnValue;
            }
        });

        newData.push(newRow)
    });

    setProcessedData(newData);
},[enabledRows,disabledRows,enabledColumns,currentOptions,compareProductNumber,table])


useEffect(()=>{
    if(mainArray.length > 0)
    {
        setShowTabel(true);
        setShowDrop(false);
        const initialDisabledColumns = Array.from({ length: mainArray[index][0].length }, (_, index) => index);
        setDisabledColumns(initialDisabledColumns);
        const initialEnabledColumns = Array.from({ length: mainArray[index][0].length }, () => '');
        setEnabledColumns(initialEnabledColumns);
    }
    else{
        setShowTabel(false);
        setShowDrop(true);
    }
},[mainArray,index])

useEffect(()=>{
    console.log("enabled columns",enabledColumns);
    console.log("enabled rows",enabledRows);
    console.log("current options",currentOptions);
    console.log("processeddata",processedData);
    console.log("compare",compareProductNumber);
    console.log("switch state",enabledSwitch);
    console.log("tableconfigs",tableConfig);
},[showTabel,index,enabledColumns, disabledColumns, currentArray, processedData,enabledRows,currentOptions,enabledSwitch,compareProductNumber,tableConfig])

useEffect(()=>{
    settingDisableTable();
},[showTabel])
const settingDisableTable = () => {
    if(showTabel) {
        setDisableTable(true);
    }
}

useEffect(()=>{
checkProductNumber()
},[enabledSwitch,currentOptions,enabledRows])

useEffect(() => {
    if (currentArray.length > 0 && currentArray[0].length > 0) {
      setCurrentOptions(Array.from({ length: currentArray[0].length }, () => ''));
    }
  }, [currentArray]);

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
    setDisabledColumns([])
    setProcessedData([]);
}
{/* for selecting rows */}
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

{/* this is for navigating the table */} //wehn you go next set the tableconfig so when you go prev it holds that value and shows it
const toggleTable =(direction)=>{
    let newIndex = index;
    if(direction === 'next' && index < count -1){
        newIndex = index + 1;
        if(Object.keys(processedData).length !== 0){
            // setTableConfig(prevTable =>[...prevTable,processedData]);
            setTableConfig(prevconfig => [...prevconfig,{currentOptions,disabledRows}]); //alleen maar de indexes meegven als je inlaad die indexes laden dan ook in. van currentoptions weet je ook wel columns enabled zijn

        //if tabledata > 0 load that data in otherwise empty everything
        }
      
    }
     else if (direction === 'prev' && index > 0 ){
        newIndex = index -1;
        // setTableConfig(prevTable =>prevTable.slice(0,-1));

    }
    
    
    setIndex(newIndex);
    setCurrentArray(mainArray[newIndex]);
    setSelectedRow(null);
    setDisabledOptions([]); 
    setDisabledRows([]); // een nieuwe array aanmaken voor een nieuw rows als 'prev' niks mee doen
    setEnabledRows([]); 
    setInputValues('');
    setCurrentOptions([]);
    setEnabledColumns([]);
    setDisabledColumns([]);   
}
{/* this happens when you change the value in autocomplete, it sets the options as a input value otherwise it stays empty and it adds that column as enabled */}
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

       
        {/* looping through the current array for the column data add it in the array */}
        const columnData = currentArray.map(row => row[index]);
        setEnabledColumns(prevColumns => {
            const updatedColumns = [...prevColumns];
            updatedColumns[index] = index; 
            return updatedColumns;
        });

        setDisabledColumns(prevColumns => prevColumns.filter(colIndex => colIndex !== index));
      }
};

{/* remove the value out of textfield and out of disabledoptions */}
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
    {/* removing the column data with the coresponding button returns a empty array */}
    setEnabledColumns(prevColumns => {
        prevColumns[index] = '';
        return prevColumns;
    });

    setDisabledColumns(prevColumns => {
        if (!prevColumns.includes(index)) {
            return [...prevColumns, index]; // Add the column index back if it's not already included
        }
        return prevColumns; // Otherwise, return the previous state without modification
    });

    
};

{/* cellstyle */}
const cellStyle = (disableTable,disabledRows,rowIndex,currentOptions,processedData,columnIndex) => {
        if (disableTable || disabledColumns.includes(columnIndex)) {
            return {
                color: 'gray',
                backgroundColor: '#f0f0f0'
            }
        } else {
            if(currentOptions || processedData)
            {
            return { 
                backgroundColor: disabledRows.includes(rowIndex) ? '#f0f0f0' : 'transparent'
            }
        }
    }
}  
{/* checks where productnummer is and gets the value from that column */}
const checkProductNumber = (()=> {
        if(currentOptions.includes('productnummer')) {
            const productnummerIndex = currentOptions.indexOf('productnummer');
            const productnummerColumn = enabledColumns[productnummerIndex];
            const numbers = currentArray.filter((_, rowIndex) => enabledRows.includes(rowIndex))
            .map((row) => row[productnummerColumn])
            // const numbers = productnummerColumn.map(row => row[enabledRows]);
            setCompareProductNumber(numbers);
        }
        else{
            setCompareProductNumber([]);
        }
    }  
)


{/* sending the data to the database */}
async function toDatabase (){
    // const jsonString = JSON.stringify(processedData)
        const sendData = ({data: processedData});
        // const sendData = processedData;
        if (isEmpty(processedData) ) {
            toast.warning('Select data to send', { 
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "light",
            });
        } else {
            try {
            const response = await converter.post('upload', sendData);
            console.log("response data", response);
            toast.success('Data successfully sent to the database!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "light",
            });
            setTimeout(() =>{
                reset();
                },1000)
        
    } catch (error) {
        console.log(error);
        toast.error('Error sending data to the database', {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            theme: "light",
        });
    }
}
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
                    <div>
                    <FormControlLabel control={<Switch checked={enabledSwitch} onChange={()=> setEnabledSwitch(!enabledSwitch)} />} label="Bestaande producten updaten" />
                    </div>
    <TableContainer component={Paper} style={{ maxHeight: 600, overflowY: 'auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead style={{ position: 'sticky', top: 0 }}>
                {/* components */}
                <TableRow>
                    <TableCell sx={{ fontWeight:'bold' }} > 
                        eerste regel product
                    </TableCell>
                    {mainArray[index] && mainArray[index][0].map((array, index) => (
                    <TableCell key={index} sx={{ fontWeight:'bold', textAlign: 'center' }} >
                        <div>
                        <Autocomplete
                            id={`keuzesInput_${index}`}
                            options={options}
                            value={inputValues[index] || null}
                            disableClearable
                            onChange={(event,newValue,) => handleChange(event,newValue,index)}
                            getOptionDisabled={(option => disabledOptions.includes(option))}
                            renderInput={(params) => (
                                <TextField {...params} label="Kolom matchen of overslaan" variant="filled" style={{ width: 200 }} 
                                    InputProps={{
                                    ...params.InputProps,           
                                    }} 
                                />
                                )}
                            />
                            
                            <Button variant="contained" onClick={()=> Overslaan(index)} style={{  marginTop:10 }}> 
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
                                <TableCell key={cellIndex} style={{textAlign: 'center', ...cellStyle(disableTable,disabledRows,rowIndex,currentOptions,processedData,cellIndex)}} > 
                                    {cell}  {/* misschien een placeholder als het empty is */}
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