import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import axios from 'axios';
import { compact } from 'lodash';

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

function Csv() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [csvData, setcsvData] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showImport, setShowImport] = useState(false);

    {{ /* exportcsv */ }}
    const [optionDisabled, setOptionDisabled] = useState(false);
    const [handleSelectChange,setHandleSelectChange] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [disabledTds, setDisabledTds] = useState([]);
    const [currentDataIndex, setCurrentDataIndex] = useState(0);

    const count = csvData.length;
 
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

    useEffect(() => {
        if (showExport) {
            const initialDisabledTds = csvData && csvData[currentDataIndex] ?
                Array.from({ length: csvData[currentDataIndex].length }, (_, index) => index) :
                [];
            setDisabledTds(initialDisabledTds);
            console.log("csv data from import", csvData);
        }
    }, [currentDataIndex,showExport]);

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
                delimiters: [",",";"],
                skipEmptyLines: true,
                complete: function(results) {         
                    console.log('Parsed CSV data:', results.data);
                    setcsvData(prevResult => [...prevResult, results.data.map(row =>compact(row))]);    
                } 
            });
        });
    };

    const toggleData = (direction) => {
        if (direction === 'next') {
            if (currentDataIndex === count - 1) {  
            }
            setCurrentDataIndex(prevIndex => prevIndex + 1);
            document.getElementById("selected").checked = false;
            setSelectedOption("")
            setOptionDisabled(false);
        } else if (direction === 'prev') {
            if (currentDataIndex === 0) {
            }
            setCurrentDataIndex(prevIndex => prevIndex - 1);
            document.getElementById("selected").checked = false;
            setSelectedOption("")
            setOptionDisabled(false);
        }
    };

    function check(index) {
        if (selectedOption) {
            const newDisabledTds = [];
            for (let i = 0; i < index; i++) {
                newDisabledTds.push(i);
            }
            setDisabledTds(newDisabledTds);
        }
    }

    const handleSelectChangeHandler = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        setDisabledTds([]);
        document.getElementById("selected").checked = false;
        setOptionDisabled(true);
    }

    return (
        <div>
            {showImport && ( 
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
            )}
            {showImport && (
                <button onClick={handleParseCSV} >Klik hier om te uploaden</button>
            )}
            {showExport && (
                <div> 
                    <select value={selectedOption} onChange={handleSelectChangeHandler}>
                        <option value=""  disabled hidden >Kies je optie</option>
                        <option value="1" disabled={optionDisabled}>Productnaam</option>
                        <option value="2">Productnummer</option>
                    </select>
                    <table style={{  border: '1px solid black', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>eerste product regel</th>
                            </tr>
                            <tr>
                           {csvData && csvData[currentDataIndex] && csvData[currentDataIndex][0].map((header, index) => (
                            <th key={index} style={{ border: '1px solid black', width: '100%' }}> {header} </th>
                        ))}
                            </tr>
                        </thead>
                    <tbody>
                    {csvData && csvData[currentDataIndex] && csvData[currentDataIndex].slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                            <td style={{ border: '1px solid black', width: '100%' }}> <input type="radio" name="group" id="selected" onClick={() => check(rowIndex)} />
                            </td>
                            {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={{ border: '1px solid black', width: '100%' ,  color: disabledTds.includes(rowIndex) ? 'gray' : 'black'  }}> {cell} </td>
                             ))}
                             </tr>
                        ),null)}
                    </tbody>
                    </table>
                    <button onClick={() => toggleData('prev')} disabled={currentDataIndex === 0 }>vorige file</button>
                    <button onClick={() => toggleData('next')} disabled={currentDataIndex === count -1}>volgende file</button>
                    <button onClick={resetAll}>click</button>
                </div>
            )}
        </div>
    );
}

export default Csv;