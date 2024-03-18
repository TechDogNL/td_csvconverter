import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { merge, result } from 'lodash';
import axios from 'axios';
import { DefaultDelimiter } from 'react-papaparse';
import { useNavigate } from 'react-router-dom';
import converter from '../API/CsvConverter';

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
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

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

const SendAll = async () => {
  
      try {
        const response = await converter.post('sendcsv',csvData);
        console.log(response.data);
      } catch (error) {
        console.warn(error);
      }
  
}

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

   const handleParseCSV = () => {
    setSubmitting(true);
    uploadedFiles.forEach(file => { 
      Papa.parse(file, {
        delimiter:";",
        complete: function(results) {
          
          console.log('Parsed CSV data:', results.data);
          setcsvData(prevResult => [...prevResult, results.data]); 
        //   navigate('export'); //
          SendAll();
        }
        //de waardes naar een controler sturen en daar weer uit halen om een table te gaan maken
        //nog checken dat het een header heeft
        //const merged =  merge(results); //dit nog fixen ik moet 2 values meegeven
        // console.log('merged data',merged);
      });
    });
  };

  
  return (
    <div>
    <section className="container">
      <h1>Upload je CSV bestand</h1>
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
    <button onClick={handleParseCSV} >Klik hier om te uploaden</button>
    </div>
    );
}

export default Importcsv