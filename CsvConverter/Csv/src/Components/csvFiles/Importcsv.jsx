import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import axios from 'axios';


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

function Importcsv() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [csvData, setcsvData] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showImport, setShowImport] = useState(false);
    
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

useEffect(() => {
  console.log("send to export data",csvData);
  console.log("send to export files",acceptedFiles)
  if(csvData.length > 0)
  {
    setShowExport(true);
    setShowImport(false);
  }
  else{
    setShowExport(false);
    setShowImport(true);
  }
}, [csvData])


  useMemo(() =>{
    setUploadedFiles(acceptedFiles);
  },[acceptedFiles]);
  
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

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => <li key={e.code}>{e.message}</li>)}
      </ul>
    </li>
  ));

  const resetAll = () => {
    setUploadedFiles([]);
    setcsvData([]);
  }

   const handleParseCSV = () => {
    setSubmitting(true);
     uploadedFiles.forEach(file => { 
      Papa.parse(file, {
        delimiter:";",
        skipEmptyLines,
        header,
        complete: function(results) {         
          console.log('Parsed CSV data:', results.data);
          setcsvData(prevResult => [...prevResult, results.data]);    
        } 
      });
    });
  };

   //   navigate('export'); //
    //de waardes naar een controler sturen en daar weer uit halen om een table te gaan maken
        //nog checken dat het een header heeft
        //const merged =  merge(results); //dit nog fixen ik moet 2 values meegeven
        // console.log('merged data',merged);
  
  return (
    <div>
  {showImport && ( 
    <section className="container">
      <h1>Upload je CSV bestand</h1>
      <div {...getRootProps({style})}>  { /* hier zijn de dropzones handles */ }
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
  )}
     {showImport && (
    <button onClick={handleParseCSV} >Klik hier om te uploaden</button>
     )}
        {/* {showExport && <Exportcsv test={csvData} />} */}
        {showExport &&(
          <div>
            test
          <button onClick={resetAll}>click</button>
          </div>
          
        )}
      
    </div>
  );
}
{{ /* button onclick()
const [uploadedFiles, setUploadedFiles] = useState([]);
const [csvData, setcsvData] = useState([]);
leeg maken */ }}
export default Importcsv