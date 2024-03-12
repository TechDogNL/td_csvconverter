import React,{useState} from "react"

import { BrowserRouter,Routes,Route } from "react-router-dom";
import Importcsv from "./Components/csvFiles/Importcsv";
import Exportcsv from "./Components/csvFiles/Exportcsv";


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="import" element={<Importcsv/>} ></Route>
        <Route path="export" element={<Exportcsv/>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
