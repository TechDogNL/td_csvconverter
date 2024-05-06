import React, {useEffect, useMemo, useState, } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, colors, Autocomplete,Button,Switch,FormControlLabel,Modal,Box,Dialog,DialogTitle,LinearProgress,Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import {Accordion,AccordionDetails,AccordionSummary,Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
function Tabel() {
  
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
 

const [rows,setRows] = useState([]);
const [mainArray,setMainArray] = useState([]);
const [index, setIndex] = useState(0)
const [currentArray,setCurrentArray] = useState([]);

const [disableTable,setDisableTable] = useState(false);
const [disabledRows,setDisabledRows] = useState([]);
const [enabledRows,setEnabledRows] = useState([]);
const [selectedRow, setSelectedRow] = useState(null);


const [options,setOptions ] = useState(["productnaam","productnummer", "order1", "order2", "order3","barcode","kleur"]);
const [disabledOptions,setDisabledOptions] = useState([]);
const [currentOptions,setCurrentOptions] = useState([])
const [inputValues, setInputValues] = useState(options.map(() => ''));

const [currentEnabledColumns,setCurrentEnabledColumns] = useState([]); //dit doen voor de tableconfigs zodat het de current als een static heeft
const [enabledColumns,setEnabledColumns] =  useState([]);
const [disabledColumns,setDisabledColumns] = useState([]);

const [enabledSwitch,setEnabledSwitch] = useState(false)

const [openDialog,setOpenDialog] = useState(false);
const [colorArray,setColorArray] = useState([]);
const [atributes,setAtributes] = useState(["appel","peer","banaan"]);

const count = 0;
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
function reset(){

}
function toDatabase () {

}
function toResult () {
  
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
                                <TableCell key={cellIndex} style={{textAlign: 'center', ...cellStyle(disableTable,disabledRows,rowIndex,currentOptions,processedData,cellIndex)}} > 
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
    </div>
  )
}

export default Tabel;
