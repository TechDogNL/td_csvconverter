import React, {useEffect, useMemo, useState, } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,LinearProgress,Typography,Divider } from "@mui/material";
import converter from "../API/CsvConverter";
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Results({}) {

    const [logs,setLogs] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [progress,setProgress] =useState(0);
    const [uploadedFiles,setUploadedFiles] = useState('');
    const [enabledSwitch,setEnabledSwitch] = useState(false);
    const [enabledRows,setEnabledRows] = useState();
    const [tableids,setTableIds] = useState([]);
    const [currentIndex,setCurrentIndex] = useState(0);
    const [time,setTime] = useState();
    const [fileNameCsv,setFileNameCsv] = useState();

    const navigate = useNavigate();
    const { tableId } = useParams(); 

useEffect(()=>{
console.log("logs",logs);
console.log("tableid",tableId)
console.log("resultdata",resultData)
console.log("enabledrows",enabledRows);
console.log("uploadedfiles",uploadedFiles)
console.log("tableids",tableids)
console.log("tableids.length",tableids.length);
},[logs,tableId,resultData,enabledRows,tableids,uploadedFiles]);


{/* getting data from database */}
useEffect(()=>{
    async function getResults () {
        try{
        const response = await converter.get(`/result/${tableId}`);
        console.log("response from results",response)
        const tableData = response.data[0]; //data for Datagrid
        const data = (response.data[1]); 
        setTableIds(data.original); //tableIds for navigating results from the same batchId
{/* modifying the data to include in datagrid */}
        const rows = tableData.flatMap(entry => {
            const enabledRowsArray = JSON.parse(entry.enabledRows);
            const resultsTime = (entry.created_at);
            const rows = [];
            // Loop through each entry
            for (const key in entry) {
                // Skip non-value keys like id, unique_identifier, batch_id, etc.   . the value in the row push are shown in the datagri
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

useEffect(()=>{
    async function getFileName () {
        try {
            const responseFileName = await converter.get(`/files/${tableId}`);
            console.log("response from results for fileName",responseFileName)

            if (responseFileName.data && responseFileName.data.length > 0) {
                const url = responseFileName.data[0];
                const parts = url.split('/');
                const filenameWithExtension = parts[parts.length - 1]; // Get the last part of the URL (e.g., '1-dummy data 2.csv')
                const filename = filenameWithExtension.split('.')[0]; // Remove the file extension (e.g., '1-dummy data 2')
                setFileNameCsv(filename);
                console.log("Filename:", filename);
            }
        } catch(error) {

        }
    }

    getFileName();
},[tableId])

{/* navigate through multiple results  */}
const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tableids.length); 
    if (currentIndex < tableids.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextTableId = tableids[nextIndex];
        navigate(`/result/${nextTableId}`);
        setCurrentIndex(nextIndex); // Update the current index
    }
};

// async function getLogs(){
//     try{
//     const response = await converter.get('logs'); //of hier moet met id. kijken bij donate
//     console.log("response data from logs",response);
//     const logData = response.data;
        
//     const extractedData = logData.map(innerArray => (
//         innerArray.map(entry => ({
//             time: entry.time,
//             value: entry.value,
//             status: entry.action,
//             action: entry.action,
//         }))
//     ));
//     setLogs(extractedData);
//     } catch(error) {
//         console.error("error fetching logs",error)
//     }
// };


{/* this is for downloading the url that i get back from files/{$tableId} */}
const handleDownloadClick = async (event) => {
    event.preventDefault();
    try {
        const response = await converter.get(`/files/${tableId}`)
        console.log("response from files",response);
        if (response.data && response.data.length > 0) {
            setUploadedFiles(response.data[0]);
            const downloadUrl = response.data[0] ; 
            const link = document.createElement('a');  
            link.href = downloadUrl;
            link.setAttribute('download', '');   
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error("No URLs found in the response");
        }
    } catch(error) {
    
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
                        Download: <a href="#" onClick={handleDownloadClick}>{fileNameCsv}</a>
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
                        // { field: 'key', headerName: 'key', flex: 1 }, dit is de header van de table dus de opties
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
                    { tableids.length > 1 && (
                    <button onClick={next} disabled={currentIndex === tableids.length -1}>Volgende</button> 
                    )}
                    </>
                     ) : (
                        <p>No logs available</p>
                    )}
                </div>
            </div>        
    )
}
export default Results;