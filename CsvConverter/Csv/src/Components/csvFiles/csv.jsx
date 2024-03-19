import React, { useState } from "react";
import Importcsv from "./Importcsv";
import Exportcsv from "./Exportcsv";

function Csv() {
    const [show,setShow] = useState("");


    return(
    <div>
        <Importcsv/>

        <div>
        { show && <Exportcsv/> }
        </div>
    </div>
    )
}


export default Csv;