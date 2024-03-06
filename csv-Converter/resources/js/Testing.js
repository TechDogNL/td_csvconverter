import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./Components/NotFound/NotFound";


function Testing(){
    return(
        <BrowserRouter>
         <Routes>
          <Route path="/*" element={<NotFound />}></Route>


         </Routes>
        </BrowserRouter>
    );
}

export default Testing;