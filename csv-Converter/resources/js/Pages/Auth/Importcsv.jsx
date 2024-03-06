import React, { useMemo,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// Definieer je stijlen
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
  cursor: 'pointer', // Voeg cursor pointer toe voor betere UX
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

export default function Importcsv() {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
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
    <form>
    <button >Klik hier om te uploaden</button>
    </form>
    </div>
    );
}