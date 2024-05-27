import React, {useEffect, useMemo, useState, } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,LinearProgress,Typography,Divider } from "@mui/material";
import converter from "../API/CsvConverter";
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Results({resultsRows,downloadfiles,tableIdsProp}) {

    const [logs,setLogs] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [progress,setProgress] =useState(0);
    const [uploadedFiles,setUploadedFiles] = useState([]);
    const [enabledSwitch,setEnabledSwitch] = useState(false);
    const [enabledRows,setEnabledRows] = useState();

    const [currentIndex,setCurrentIndex] = useState(0);
    const [time,setTime] = useState();

    const navigate = useNavigate();
   

    const { tableId } = useParams(); //dit is voor id

useEffect(()=>{
console.log("logs",logs);
console.log("tableid",tableId)
console.log("resultdata",resultData)
console.log("enabledrows",enabledRows);
console.log("tableidprops",tableIdsProp)
},[logs,tableId,resultData,enabledRows,tableIdsProp]);

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

{/* getting data from database */}
useEffect(()=>{
    async function getResults () {
        try{
        const response = await converter.get(`/result/${tableId}`);
        console.log("response from results",response)
        const data = response.data;


        const rows = data.flatMap(entry => {
            const enabledRowsArray = JSON.parse(entry.enabledRows);
            const resultsTime = (entry.created_at);
            const rows = [];
            // Loop through each entry
            for (const key in entry) {
                // Skip non-value keys like id, unique_identifier, batch_id, etc.
                if (!['id', 'unique_identifier', 'batch_id', 'table_id','action','status', 'enabledRows', 'updated_at', 'created_at'].includes(key)) {
                    const value = entry[key];
                    if (value !== null && value !== undefined && value !== '') {
                        rows.push({ key: key, value: value, time: entry.created_at, action: entry.action, status: entry.action });
                    }
                }
            }
            setTime(resultsTime);
            setEnabledRows(enabledRowsArray);
            return rows;
        });
        setResultData(rows);
        } catch(error) {
    console.error("error")
    }
}
    getResults();
},[tableId])

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

const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tableIdsProp.length); //tableIds als prop doorgeven
    if (currentIndex < tableIdsProp.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextTableId = tableIdsProp[nextIndex];
        navigate(`/result/${nextTableId}`);
        setCurrentIndex(nextIndex); // Update the current index
    }
};

async function getLogs(){
    try{
    const response = await converter.get('logs'); //of hier moet met id. kijken bij donate
    console.log("response data from logs",response);
    const logData = response.data;
        
    const extractedData = logData.map(innerArray => (
        innerArray.map(entry => ({
            time: entry.time,
            value: entry.value,
            status: entry.action,
            action: entry.action,
        }))
    ));
    setLogs(extractedData);
    } catch(error) {
        console.error("error fetching logs",error)
    }
};

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
                    {resultData && resultData.length > 0 ? (
                        <>
                    <DataGrid 
                    columns={[
                        { field: 'id', headerName: 'ID', flex: 1 },
                        { field: 'time', headerName: 'Time', flex: 1 },
                        // { field: 'key', headerName: 'key', flex: 1 },
                        { field: 'value', headerName: 'Value', flex: 1 },
                        { field: 'status', headerName: 'Status', flex: 1 },
                        { field: 'action', headerName: 'Action', flex: 1 },
                    ]}
                    
                    rows={resultData.map((entry, index) => ({
                        id: index + 1,
                        ...entry
                    }))}
                        pageSize={5}
                    />
                    <button onClick={next} disabled={currentIndex === tableIdsProp.length -1}>Volgende</button> {/* hierbij moet je naar de volgende result/id gaan */}
                    </>
                     ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>        
    )
}
export default Results;