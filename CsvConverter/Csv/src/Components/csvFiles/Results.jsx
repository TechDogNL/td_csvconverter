import React, {useEffect, useMemo, useState, } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,LinearProgress,Typography,Divider } from "@mui/material";
function Results() {

    const [logs,setLogs] = useState([]);
    const [progress,setProgress] =useState(0);
    const [uploadedFiles,setUploadedFiles] = useState([]);
    const [enabledSwitch,setEnabledSwitch] = useState(false);

    const date = new Date();
    const day = String(date.getDate()).padStart(2,0);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2,0);
    const minutes = String(date.getMinutes()).padStart(2,0);
    
    const time = `${day}/${month}/${year} - ${hours}:${minutes}`;


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
        
                        {/* <ul>
                            {uploadedFiles.map((file,index) => (
                                <li key={index}>
                                    <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                                </li>
                            ))}
                        </ul> */}
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