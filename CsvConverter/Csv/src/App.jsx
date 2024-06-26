import {React,useState,useEffect} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Importcsv from "./Components/csvFiles/Importcsv";
import Exportcsv from "./Components/csvFiles/Exportcsv";
import Csv from "./Components/csvFiles/csv";
import Test from "./Components/test";
import Tabel from "./Components/csvFiles/Tabel";
import { ToastContainer } from 'react-toastify';
import Results from "./Components/csvFiles/Results";



function App() {
  const [csvData,setCsvData] = useState([]);
  const [downloadfiles,setDownloadFiles] = useState([]);
  
  return(
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/import" element={<Importcsv setCsvData={setCsvData} setDownloadFiles={setDownloadFiles}/>} ></Route>
        <Route path="/" element={<Exportcsv/>} ></Route>
        <Route path="/test" element={<Test/>} ></Route>
        <Route path="/tabel" element={<Tabel csvData={csvData} downloadfiles={downloadfiles} />}  ></Route>
        {/* <Route path="/result" element={<Results downloadfiles={downloadfiles}/>} ></Route> */}
        <Route path="/result/:tableId" element={<Results  downloadfiles={downloadfiles}/>} ></Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer limit={2}/>
    </>
  );
}

export default App;
