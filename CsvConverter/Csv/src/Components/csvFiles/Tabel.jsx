import React, {useEffect, useMemo, useState, } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button,Switch,FormControlLabel,Box,Dialog,DialogTitle, IconButton, OutlinedInput } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import {Accordion,AccordionDetails,AccordionSummary,Divider,InputAdornment,FormControl,InputLabel } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";
import _, { compact, first, isEmpty } from 'lodash';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import converter from "../API/CsvConverter";
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

function Tabel({csvData,setResultsRows,downloadfiles}) {
  
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
 


const [mainArray,setMainArray] = useState([]);
const [index, setIndex] = useState(0)
const [currentArray,setCurrentArray] = useState([]);

const [disableTable,setDisableTable] = useState(false);
const [disabledRows,setDisabledRows] = useState([]);
const [enabledRows,setEnabledRows] = useState([]);
const [selectedRow, setSelectedRow] = useState(null);
const [rows,setRows] = useState([]);


const [options,setOptions ] = useState(["* productnaam","* productnummer", "order1", "order2", "order3","barcode","kleur"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions,setCurrentOptions] = useState([])
const [inputValues, setInputValues] = useState(options.map(() => ''));

const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [enabledSwitch,setEnabledSwitch] = useState(false)
const [processedData, setProcessedData] = useState({});

const [openIndex, setOpenIndex] = useState(null);  
const [tableName,setTableName] = useState([]);


const [batchId,setBatchId] = useState('');
const [tabelId,setTabelId] = useState('');

const count = mainArray.length;
const navigate = useNavigate();
const tableId = 1;

{/* this is the final data thats getting send to the database.*/}
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
    
            if (['* productnaam', 'order1', 'order2'].includes(columnName)) {
                if (!newRow.products) {
                    newRow.products = {};
                }
                newRow.products[columnName.replace('* ', '')] = columnValue;
            } else {
                if (!newRow.temps) {
                    newRow.temps = {};
                }
                newRow.temps[columnName.replace('* ', '')] = columnValue;
            }
        });
    
        return newRow;
    });
    
    setResultsRows(enabledRows);
    setProcessedData(newData);

},[enabledRows,disabledRows,enabledColumns,currentOptions]);


useEffect(()=>{
console.log("mainarray",mainArray);
console.log(['disabledrows',disabledRows],['enabledrows',enabledRows]);
console.log("procssedData",processedData);
console.log("index",index);
console.log("enabled columns",enabledColumns);
console.log("selectedrow",selectedRow);
console.log(["batchId->",batchId],["tabelId->",tabelId]);
},[mainArray,csvData,disabledColumns,enabledColumns,processedData,enabledRows,index,selectedRow,batchId,tabelId]);

{/* get the csvData from import */}
useEffect(()=>{
    if (csvData && csvData.length > 0) {
        const newArray = [...csvData]
        setMainArray(newArray);
        setCurrentArray(newArray[index]);
        const fileNames = downloadfiles.map(file => file.name.replace('.csv',''));
        setTableName(fileNames)
        
    }
},[csvData,downloadfiles,index]);

{/* make the columns the same length as the currentarray */}
useEffect(()=>{
    if(mainArray.length > 0)
    {
        const initialDisabledColumns = Array.from({ length: mainArray[index][0].length }, (_, index) => index);
        setDisabledColumns(initialDisabledColumns);
        const initialEnabledColumns = Array.from({ length: mainArray[index][0].length }, () => '');
        setEnabledColumns(initialEnabledColumns);
    }
    else{

    }
},[mainArray,index]);

{/* set the length of the options on the currentarray */}
useEffect(() => {
    if (currentArray.length > 0 && currentArray[0].length > 0) {
      setCurrentOptions(Array.from({ length: currentArray[0].length }, () => ''));
    }
  }, [currentArray]);

{/* generating a uniqueId for the batchId */}
  useEffect(()=>{
    setBatchId(Date.now().toString(16) + Math.random().toString(16).substring(2, 5)) 
    setTabelId(Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0))
  },[]);

  {/* this is for navigating the table */} 
const toggleTable =(direction)=>{
    let newIndex = index;
    if(direction === 'next' && index < count -1){
        newIndex = index + 1;
    }
     else if (direction === 'prev' && index > 0 ){
        newIndex = index -1;
    } //dit kan weg
    
    
    setIndex(newIndex);
    setCurrentArray(mainArray[newIndex]);
    setSelectedRow(null);
    setDisabledOptions([]); 
    setDisabledRows([]); 
    setEnabledRows([]); 
    setInputValues('');
    setCurrentOptions([]);
    setEnabledColumns([]);
    setDisabledColumns([]);   
    setEnabledSwitch(false);
};



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
    
};

{/* this happens when you change the value in autocomplete, it sets the options as a input value and it adds that column as enabled  otherwise it stays empty */}
const handleChange = (event,newValue,index) => {
    const clearedValue = inputValues[index];
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue || '';
    setInputValues(updatedInputValues);
    setDisableTable(false) //dit kan weg


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

        {/* looping through the current array for the column data add it in the array */}
        setEnabledColumns(prevColumns => {
            const updatedColumns = [...prevColumns];
            updatedColumns[index] = index; 
            return updatedColumns;
        });

        setDisabledColumns(prevColumns => prevColumns.filter(colIndex => colIndex !== index));
      } else{
        skip(index);
      }
};


{/* remove the value out of textfield and out of disabledoptions */}
const skip = (index) => {
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
    {/* removing the column data with the coresponding button, returns a empty array */}
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

{/* this is for the textfield, when you press tab it opens the options underneath that */}
const handleFocus = (index) => {
    setOpenIndex(index); // Set the index of the focused Autocomplete
};

{/* for button annuleren */}
function reset(){
    setMainArray([]);
    setIndex(0);
    setCurrentArray([]);
    navigate('/import');
};

function overslaan () {
    toggleTable('next');
    setTabelId(Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0))
  };


async function toDatabase () {
    const toastStyle = {
        position: "top-right",
        autoClose: 5000,
        closeOnClick:true,
        theme: "light",
    };

    if(!processedData || processedData.length === 0 || Object.keys(processedData[0]).length === 0) {
        toast.error("Select a row and column",toastStyle)
        return false;
    } else{
    const firstData = processedData[0];
    if((!firstData || !firstData.temps || !firstData.temps.hasOwnProperty('productnummer')) &&
        (!firstData || !firstData.products || !firstData.products.hasOwnProperty('productnaam'))) {
        toast.error("productnummer and productnaam is required",toastStyle);
        return false
    }
   else if(!firstData || !firstData.temps || !firstData.temps.hasOwnProperty('productnummer')) {
        toast.error("productnummer is required",toastStyle);
        return false
    }
   else if(!firstData|| !firstData.products || !firstData.products.hasOwnProperty('productnaam')) {
        toast.error("productnaam is required",toastStyle);
        return false
    }

    else{
        setTabelId(Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0)) //weer een nieuwe tableId aanmaken
    const sendData = ({
        data: processedData,
        enabledSwitch: enabledSwitch,
        batchId: batchId,
        tabelId: tabelId
    }); 
   
    try {
        const response = await converter.post('upload', sendData);
        console.log("response data", response);

        const successMessage = 'Data succesfully sent to the database!'; 
        toast.success(successMessage,toastStyle);

        if (response.data.updatedrows && response.data.updatedrows.length > 0) {
            const updatedRows = response.data.updatedrows;
            const updatedRowNumbers = updatedRows.join(', ');
            toast.success(`Rows updated: ${updatedRowNumbers}`,toastStyle);
          } 
          return true;
           
} catch (error) {
    console.log(error);
    toast.error('Error sending data to the database', toastStyle);
            } 
        }
    }
};

{/* cellstyle for the table*/}
const cellStyle = (disabledRows,rowIndex,currentOptions,processedData,columnIndex) => {
        if (disabledColumns.includes(columnIndex)) {
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

  return (
    <div>
      <div>
          <div>
                <div>
                <p>bestandsnaam: {tableName[index]}</p>
                    <div style={{display:'flex',alignItems: 'center', gap: '10px'}}>
                    <FormControlLabel control={<Switch checked={enabledSwitch} onChange={()=> setEnabledSwitch(!enabledSwitch)} />} label="Bestaande producten updaten" />
                    </div>
                </div>
    {/* the table */}
    <TableContainer component={Paper} style={{ maxHeight: 900, overflowY: 'auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead style={{ position: 'static', top: 0 }}>
                {/* textfields and buttons in the header */}
                <TableRow >
                    <TableCell sx={{ fontWeight:'bold' }} > 
                        eerste regel product
                    </TableCell>
                    {mainArray[index] && mainArray[index][0].map((array, index) => (
                    <TableCell key={index} style={{ fontWeight:'bold', textAlign: 'center' }} >
                        <div>
                        <Autocomplete
                            id={`keuzesInput_${index}`}
                            options={options}
                            open={openIndex === index}
                            onOpen={() => setOpenIndex(index)}
                            onClose={() => setOpenIndex(null)}
                            value={inputValues[index] || null}
                            onChange={(event,newValue,) => handleChange(event,newValue,index)}
                            getOptionDisabled={(option => disabledOptions.includes(option))}
                            autoSelect={true}
                            renderInput={(params) => (
                                <TextField {...params} label="Kolom matchen of overslaan" variant="filled" style={{ width: 200 }} 
                                    InputProps={{
                                    ...params.InputProps,           
                                    }} 
                                    onFocus={() => handleFocus(index)}
                                />
                                )}
                            />
                            
                            <Button variant="contained" onClick={()=> skip(index)} style={{  marginTop:10 }}  tabIndex={-1}> 
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
                .slice(0,10)
                .filter(row=>row.length > 0, _.remove(rows, row => row.length === 0))
                .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell> 
                                <input type="radio" name="group" id="selected" checked={selectedRow === rowIndex} onChange={()=> check(index,rowIndex)} />                    
                            </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} style={{textAlign: 'center', ...cellStyle(disabledRows,rowIndex,currentOptions,processedData,cellIndex)}} > 
                                    {cell ?? ''} 
                                </TableCell>
                            ))}
                        </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button onClick={reset}>annuleren</button>
                        <button onClick={async() =>{
                            if(index + 1 < mainArray.length){
                                try{
                                    const succes = await toDatabase();
                                    if(succes){
                                      toggleTable('next')
                                    }                        
                                } catch (error) {
                                    console.log("fout");
                                }
                            } else{
                                const succes = await toDatabase();
                                if(succes){
                                    navigate("/result"); 
                                }   
                               
                            }
                        }}>{index + 1 < mainArray.length ? 'verwerk en ga naar het volgende bestand' : 'verwerk'}</button>
                        {mainArray.length > 1 && (
                            <button onClick={overslaan} disabled={index === count -1}>Overslaan</button>
                        )}
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Tabel;
