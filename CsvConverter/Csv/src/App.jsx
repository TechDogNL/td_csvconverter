import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Importcsv from "./Components/csvFiles/Importcsv";
import Exportcsv from "./Components/csvFiles/Exportcsv";
import Csv from "./Components/csvFiles/csv";
import Test from "./Components/test";
import Tabel from "./Components/csvFiles/Tabel";
import { ToastContainer } from 'react-toastify';
import Results from "./Components/csvFiles/Results";



function App() {
  return(
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/import" element={<Importcsv/>} ></Route>
        <Route path="/" element={<Exportcsv/>} ></Route>
        <Route path="/test" element={<Test/>}  ></Route>
        <Route path="/tabel" element={<Tabel/>}  ></Route>
        <Route path="/result" element={<Results/>} ></Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer limit={3}/>
    </>
  );
}

export default App;
