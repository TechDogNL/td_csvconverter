import React, {useEffect, useMemo, useState, } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button,Switch,FormControlLabel,Box,Dialog,DialogTitle } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import {Accordion,AccordionDetails,AccordionSummary,Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";
import _, { compact, first, isEmpty } from 'lodash';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import converter from "../API/CsvConverter";


function Tabel({csvData,setResultsRows}) {
  
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


const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3","barcode","kleur"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions,setCurrentOptions] = useState([])
const [inputValues, setInputValues] = useState(options.map(() => ''));

const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [enabledSwitch,setEnabledSwitch] = useState(false)
const [processedData, setProcessedData] = useState({});

const [openDialog,setOpenDialog] = useState(false);
const [colorArray,setColorArray] = useState([]);
const [atributes,setAtributes] = useState(["appel","peer","banaan"]);


const count = mainArray.length;
const navigate = useNavigate();


{/* this is the final data thats getting send to the database. I have to change this for v2 to contain multiple arrays*/}
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
    
    setResultsRows(enabledRows);
    setProcessedData(newData);
},[enabledRows,disabledRows,enabledColumns,currentOptions]);

useEffect(()=>{
console.log("mainarray",mainArray);
console.log(['disabledrows',disabledRows],['enabledrows',enabledRows]);
console.log("prcossedData",processedData)

},[mainArray,csvData,disabledColumns,enabledColumns,processedData,enabledRows]);

useEffect(()=>{
    if (csvData && csvData.length > 0) {
        const newArray = [...csvData]
        setMainArray(newArray);
        setCurrentArray(newArray[index]);

        
    }
},[csvData]);

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

{/* Options for the currentArray */}
useEffect(() => {
    if (currentArray.length > 0 && currentArray[0].length > 0) {
      setCurrentOptions(Array.from({ length: currentArray[0].length }, () => ''));
    }
  }, [currentArray]);


  {/* this is for navigating the table */} 
const toggleTable =(direction)=>{
    let newIndex = index;
    if(direction === 'next' && index < count -1){
        newIndex = index + 1;
    }
     else if (direction === 'prev' && index > 0 ){
        newIndex = index -1;
    }
    
    
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

const debounceCheck = _.debounce(check,200)
function handleClick(index, rowIndex) {
    debounceCheck(index, rowIndex);
};

{/* this happens when you change the value in autocomplete, it sets the options as a input value otherwise it stays empty and it adds that column as enabled */}
const handleChange = (event,newValue,index) => {
    const clearedValue = inputValues[index];
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
        // const columnData = currentArray.map(row => row[index]);
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

{/* opens a new window where you can set your options, it also gets the values from column 'kleur' */}
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
    
};

const closeDialog = () =>{
    setOpenDialog(false);
};

function colorClick (color){
    //set the processedData column kleur, all to the color provided/ or update it later before sending it to the database
    //hold the state on if button gavanceerde opties is clicked, then check if it is true
    //als je op ok drukt in advancedoptions make the changes so usestate
    console.log(color)
};

function reset(){
    setMainArray([]);
    setIndex(0);
    setCurrentArray([]);
    navigate('/import');
};

async function toDatabase () {
    //if else hier maken
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
            navigate('/result')
            
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
};

function overslaan () {
  navigate('/result');
};

{/* cellstyle */}
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
                                        </AccordionDetails> 
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
                            // disableClearable
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
                .filter(row=>row.length > 0, _.remove(rows, row => row.length === 0))
                .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell> 
                                <input type="radio" name="group" id="selected" checked={selectedRow === rowIndex} onChange={()=> handleClick(index,rowIndex)} />                    
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
                        <button onClick={reset}>terug</button>
                        <button onClick={()=>toggleTable('next')} disabled={index === count -1}>volgende file</button>
                        <button onClick={toDatabase}>naar database</button>
                        <button onClick={overslaan}>Overslaan</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Tabel;
