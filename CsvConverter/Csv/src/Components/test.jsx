import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button,Switch,FormControlLabel,Modal,Box,Dialog,DialogTitle,LinearProgress,Typography } from "@mui/material";
import {Accordion,AccordionDetails,AccordionSummary,Divider } from '@mui/material';
import _, { compact, first, isEmpty } from 'lodash';
import converter from "./API/CsvConverter";
import TextField from '@mui/material/TextField';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DataGrid } from "@mui/x-data-grid";

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

      const boxClickStyle = {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        borderTop: '1px solid #ccc',
        paddingTop: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
      };
     
      
const [showTabel,setShowTabel] = useState(false);
const [showdrop,setShowDrop] = useState(true);
const [showResult,setShowResult] = useState(false);
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

const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3","barcode","kleur"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions,setCurrentOptions] = useState([])
const [inputValues, setInputValues] = useState(options.map(() => ''));

const [currentEnabledColumns,setCurrentEnabledColumns] = useState([]); //dit doen voor de tableconfigs zodat het de current als een static heeft
const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [processedData, setProcessedData] = useState({});
const [finalData,setFinaldata] = useState([]); //hier alle processedData inzetten?
const [enabledSwitch,setEnabledSwitch] = useState(false)
const [tableConfig,setTableConfig] = useState([]); //hier alle gegevens van een tabel zetten dus enabledrows en enabledcolumns dus de config van een tabel

const [openDialog,setOpenDialog] = useState(false);
const [colorArray,setColorArray] = useState([]);
const [atributes,setAtributes] = useState(["appel","peer","banaan"]);
const [logs,setLogs] = useState([]);
const [progress,setProgress] =useState(0);

const date = new Date();
const day = String(date.getDate()).padStart(2,0);
const month = date.toLocaleString('default', { month: 'long' });
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2,0);
const minutes = String(date.getMinutes()).padStart(2,0);

const time = `${day}/${month}/${year} - ${hours}:${minutes}`;

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

{/* this is the final data thats getting send to the database. I have to change this for v2 */}
useMemo(() => {
    if (mainArray.length === 0) {
        setProcessedData({})
        return;
    }
    const newData = enabledRows.map((rowIndex) => {
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
    
        return newRow;
    });
    

    setProcessedData(newData);
},[enabledRows,disabledRows,enabledColumns,currentOptions])


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
    console.log("switch state",enabledSwitch);
    // console.log("tableconfigs",tableConfig);
    console.log("color array",colorArray)
    console.log("showresultsState",showResult)
    console.log("uploaded files",uploadedFiles)
    console.log("logs",logs);
    console.log("mainarray",mainArray);
    console.log("currentarray",currentArray);
    console.log('disabledrows',disabledRows)
},[showTabel,index,enabledColumns, disabledColumns, currentArray, processedData,enabledRows,currentOptions,enabledSwitch,tableConfig,colorArray,showResult,logs,mainArray,currentArray,disabledRows])

useEffect(()=>{
    settingDisableTable();
},[showTabel])
const settingDisableTable = () => {
    if(showTabel) {
        setDisableTable(true);
    }
}

useEffect(() => {
    if (currentArray.length > 0 && currentArray[0].length > 0) {
      setCurrentOptions(Array.from({ length: currentArray[0].length }, () => ''));
    }
  }, [currentArray]);

  {/* for progress bar */}
useEffect(() =>{
    //delen door enabledrows
    //logs voor elke row terugkrijgen?
    //als het veel bestanden zijn dan sneller maken if enabledRows.length > 200 percenteagerow 50/enabledrows.length
    if(showResult == true) {
const interval = 500;
let percentagePerRow;
if(enabledRows.length > 100)
{
    percentagePerRow = 50/enabledRows.length
} else{
    percentagePerRow = 100/enabledRows.length;
}
const timer =setInterval(() => {
    setProgress((prevProgress) =>{
        if(enabledRows.length === 0){
            return 0;
        }
        const newProgress = prevProgress + percentagePerRow;
        return newProgress >= 100 ? 100: newProgress;
        
    })
}, interval);

console.log(progress)
return () => clearInterval(timer);
}})

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
    setEnabledSwitch(false);
    setProgress(0);
    setShowResult(false);
}


{/* for selecting rows */}
function check(index,rowIndex){
    setSelectedRow(rowIndex);
    const newDisabledRows = [];
    const newEnabledRows = [];
    const totalRows = mainArray[index].length
    for(let i = 0; i <totalRows; i++)
        if (i < rowIndex) {
            newDisabledRows.push(i);
        } else {
            newEnabledRows.push(i);
        }
    setDisabledRows(newDisabledRows);
    setEnabledRows(newEnabledRows); 
    
}
const debounceCheck = _.debounce(check,200)
function handleClick(index, rowIndex) {
    debounceCheck(index, rowIndex);
}

{/* this is for navigating the table */} //when you go next, set the tableconfig, so when you go prev it holds that value and shows it
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
        setTableConfig(prevTable =>prevTable.slice(0,-1));

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
const cellStyle1 = (disableTable,disabledRows,rowIndex,currentOptions,processedData,columnIndex) => {
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
{/* opens a new window where you can set your options, it also gets the values from column 'kleur' */}
 //hier alle kleuren pakken van de kolom kleuren if enabledcolumns contains 'kleur' get all colors from that column else 'selecteer een kolom met kleur'
 //ook alleen maar de kleur 1 keer toevoegen
function advancedOptions (){
    setOpenDialog(true);
    const colorColumnIndex = currentOptions.indexOf('kleur');
    if(colorColumnIndex !== -1) {
        const colorSet = new Set();
        enabledRows.map((rowIndex) =>{
        const color = currentArray[rowIndex][colorColumnIndex];
        colorSet.add(color);
        })        
        const uniqueColors = Array.from(colorSet)
        setColorArray(uniqueColors)
    } else{
        //selecteer een kolom met kleur
        setColorArray([])
    }
    
}
const closeDialog = () =>{
    setOpenDialog(false);
}
function colorClick (color){
    //set the processedData column kleur, all to the color provided/ or update it later before sending it to the database
    //hold the state on if button gavanceerde opties is clicked, then check if it is true
    //als je op ok drukt in advancedoptions make the changes so usestate
    console.log(color)
}

async function toResult() {
    setShowTabel(false);
    setShowDrop(false);
    setShowResult(true);
    const response = await converter.get('logs'); 
    console.log("response data from logs",response);
    const logData = response.data;
    const jsonDataIndex = logData.indexOf('[{');
    const jsonData = JSON.parse(logData.substring(jsonDataIndex));

    const extractedData = jsonData.map(entry => ({
        time: entry.time,
        value: entry.value,
        status: entry.status,
        action: entry.action,
    }));
    // const logs = extractedData
    setLogs(extractedData);
    //logs en usestate van maken de row values naast elkaar of apart op een row?
}

{/* sending the data to the database */}
async function toDatabase (){
    // if (currentOptions.includes('productnummer') && currentOptions.includes('productnaam')) {
        const sendData = ({
            data: processedData,
            enabledSwitch: enabledSwitch
        }); 
        try {
            const response = await converter.post('upload', sendData);
            console.log("response data", response);
            const successMessage = 'Data succesfully sent to the database!'; 
            toast.success(successMessage, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                theme: "light",
            });
            if (response.data.updatedrows &&  response.data.updatedrows.length > 0) {
                const updatedRows = response.data.updatedrows;
                const updatedRowNumbers = updatedRows.join(', ');
                toast.success(`Rows updated: ${updatedRowNumbers}`, {
                  position: "top-right",
                  autoClose: 5000,
                  closeOnClick: true,
                  theme: "light",
                });
              } 
            setTimeout(() =>{
                toResult();
                
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
// } else{
//     toast.error("Error: productnaam and productnummer is required",{
//         position: "top-right",
//         autoClose: 5000,
//         closeOnClick: true,
//         theme: "light",
//     })
// }
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
                    <Button variant="contained" size="small" startIcon={<SettingsIcon/>} onClick={advancedOptions}>Geavanceerde Opties </Button>
                       <Dialog onClose={closeDialog} open={openDialog} >
                            <Box sx={{ width: '600px',height: '600px' }}>
                                <DialogTitle sx={{ borderBottom: '1px solid #ccc',paddingBottom: '10px' }}>Geavanceerde Opties</DialogTitle>
                                <Autocomplete
                                // value={}
                                options={atributes}
                                renderInput={(params) => (
                                    <TextField {...params} label="Kies een attribuut" variant="filled"
                                        InputProps={{
                                        ...params.InputProps,           
                                        }} 
                                    />
                                    )}
                                />
                                <Accordion sx={{margin: 'auto'}}>
                                    <AccordionSummary id="panel1" expandIcon={<ArrowDropDownIcon/>} sx={{ margin: 'auto' }}>
                                        kleur
                                    </AccordionSummary>
                                        <AccordionDetails sx={{ margin: 'auto' }}>
                                        {colorArray.length === 0 ? (
                                        <p>Kies een kolom met kleur</p>
                                            ) : (
                                                <ul>
                                                {colorArray.map((color, index) => (
                                                    <li key={index}>
                                                    <button onClick={() => colorClick(color)}>{color}</button>    
                                                    </li>
                                                ))}
                                                </ul>
                                            )}
                                        </AccordionDetails> {/* moet de values pakken van currentarray */}
                                </Accordion>
                                    <Box sx={boxClickStyle}>
                                    <Button onClick={closeDialog}>Annuleer</Button>
                                    <Button>Oke</Button>
                                </Box>
                            </Box>
                       </Dialog>
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
                                <input type="radio" name="group" id="selected" checked={selectedRow === rowIndex} onChange={()=> handleClick(index,rowIndex)} />                    
                            </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} style={{textAlign: 'center', ...cellStyle1(disableTable,disabledRows,rowIndex,currentOptions,processedData,cellIndex)}} > 
                                    {cell ?? ''} 
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
    <button onClick={toResult}>showresult</button>
                </div>
            </div>
            
            }
            {showResult &&
            <div style={{ alignItems: 'center',alignContent: 'center',paddingLeft: '20%' }}>
              <h2>Importeer details</h2>
                <p> <span style={{ fontWeight: 'bold' }}>taak percentage:</span></p>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Box sx={{ width: '80%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: '7px',bgcolor: 'green', '& .MuiLinearProgress-bar': {backgroundColor: 'lightgreen', height: '10px', },}}/>
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ width: '80%',height: '5px' }}/>
                <div id="outer" style={{ display: 'flex',justifyContent: 'space-between', }}>
                 
                    <div id="inner-left" style={{ flex: '1' }}>
                        <p>Type: Product</p>
                        <p>Door Wie: user</p>
                    </div>
                    <div id="inner-right" style={{ flex: '1 ',textAlign: 'left',paddingRight: '10%',}}>
                        <p> wanneer gestart: {time}</p>
                        <p> slagingspercentage</p>
                        <p> Download:</p>
        
                        <ul>
                            {uploadedFiles.map((file,index) => (
                                <li key={index}>
                                    <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                                </li>
                            ))}
                        </ul>
                        <p>importbestand</p>
                        <p> update:{enabledSwitch ? 'bestaande producten updaten' : 'bestaande producten niet updaten'}</p>
                        <p>instellingen</p>
                    </div>
                </div>
                <div style={{ width: '80%',height: '600px' }}>
                    <h2>logs</h2>
                    <DataGrid columns={[
                        { field: 'id', headerName: 'ID', flex: 1 },
                        { field: 'time', headerName: 'Time', flex: 1 },
                        { field: 'value', headerName: 'Value', flex: 1 },
                        { field: 'status', headerName: 'Status', flex: 1 },
                        { field: 'action', headerName: 'Action', flex: 1 },
                        ]}
                        rows={logs.map((entry, index) => ({
                            id: index + 1,
                            ...entry
                        }))}
                        pageSize={5}
                    />
                    <button onClick={reset}>terug</button>
                </div>
            </div>      
            }         
        </div>
    </div> 
)}

export default Test;