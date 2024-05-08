import React, {useEffect, useMemo, useState, } from "react";
import Papa from "papaparse";
import { useDropzone } from 'react-dropzone';
import _, { compact, first, isEmpty } from 'lodash';
import {useNavigate} from 'react-router-dom';

function Importcsv({setCsvData,setDownloadFiles}){
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

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

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
  setCsvData([]);
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
               
                setCsvData(prevArray => {
                    const newArray = [...prevArray, validRows];
                    return newArray;
                })              
               setDownloadFiles(uploadedFiles);
            }
        });
    });
    if(uploadedFiles.length > 0)
    {
      navigate('/tabel')
    } else{

    }
};

  return(
    <div>
    <section className="container">
                <h2>import</h2>
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
  )
}
export default Importcsv;