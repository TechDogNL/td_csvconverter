import React, {useEffect, useMemo, useState, } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,LinearProgress,Typography,Divider } from "@mui/material";
import converter from "../API/CsvConverter";

function Results({resultsRows,downloadfiles}) {

    const [logs,setLogs] = useState([]);
    const [progress,setProgress] =useState(0);
    const [uploadedFiles,setUploadedFiles] = useState([]);
    const [enabledSwitch,setEnabledSwitch] = useState(false);
    const [enabledRows,setEnabledRows] = useState(resultsRows);
    const showResult = true; 


    const date = new Date();
    const day = String(date.getDate()).padStart(2,0);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2,0);
    const minutes = String(date.getMinutes()).padStart(2,0);
    
    const time = `${day}/${month}/${year} - ${hours}:${minutes}`;


useEffect(()=>{
if(resultsRows && resultsRows.length > 0){
    setEnabledRows(resultsRows);
    getLogs();
    setUploadedFiles(downloadfiles);
    console.log("download in onload",downloadfiles);
    console.log("uploaded in onload",uploadedFiles);
}else{
    return;
}
},[resultsRows]);


     {/* for progress bar */}
useEffect(() =>{
    if(enabledRows &&enabledRows.length > 0) {
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


console.log('progressbar',progress)
return () => clearInterval(timer);
}else{
    return
}
})

async function getLogs(){
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
}
return (

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
                            {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file, index) => (
                                <li key={index}>
                                    <a href={URL.createObjectURL(file)} download={`(1) ${file.name}`}>{`(1) ${file.name}`}</a>
                                </li>
                            ))
                            ) : (
                                <li>
                                    <p>no uploaded files</p>
                                </li>
                            )}
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
                </div>
            </div>       
    )
}
export default Results;