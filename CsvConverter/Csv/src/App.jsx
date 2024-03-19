import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Importcsv from "./Components/csvFiles/Importcsv";
import Exportcsv from "./Components/csvFiles/Exportcsv";
import Csv from "./Components/csvFiles/csv";


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Importcsv/>} ></Route>
        <Route path="/" element={<Exportcsv/>} ></Route>
        {/* <Route path="/csv" element={<Csv/>}    ></Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
