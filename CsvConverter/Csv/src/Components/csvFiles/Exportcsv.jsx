import axios from "axios";
import React, { useEffect, useState } from "react";

function Exportcsv() {
    const [disabledTds, setDisabledTds] = useState([]);
    const [currentDataIndex, setCurrentDataIndex] = useState(0);
    const [getData, setGetData] = useState([]);
    const dataArray = [
        ['tekst','hallo', 'dit', 'is', 'een', 'test'],
        ['nummers','1', '2', '3', '4', '5'],
        ['fruit','apple', 'banana', 'orange', 'grape', 'kiwi'],
        ['voertuig','auto','bus','fiets','trein','vliegtuig'],
        ['dier','hond','kat','konijn','paard','vogel'],
    ];

    const count = dataArray.length;
//     useEffect(() =>{
//         axios.get('http://127.0.0.1:8000/api/getcsv')
//         .then(response => {
//             setGetData(response.data.getData);
//             console.log('getdata',getData);
//         })
//         .catch(error => {
//             console.error('Error fetching CSV data', error);
//         });
// }, []);
//eerst wel alle array van elkaar weer splitten
const toggleData = (direction) => {
    if (direction === 'next') {
        if (currentDataIndex === count - 1) {  
        }
        setCurrentDataIndex(prevIndex => prevIndex + 1);
    } else if (direction === 'prev') {
        if (currentDataIndex === 0) {
        }
        setCurrentDataIndex(prevIndex => prevIndex - 1);
    }
};
function check(index)
    {
  const newDisabledTds = [];
  for (let i = 0; i < index; i++) {
      newDisabledTds.push(i);
  }
  setDisabledTds(newDisabledTds);

        // if (!disabledTds.includes(index)) {
        //     setDisabledTds([index -1]);
    
    }

    return (
        <div> 
            <table>
                <thead>
                    <tr>
                        <th>eerste product regel</th>
                        <th>Column</th>
                    </tr>
                </thead>
                <tbody>
                    {dataArray[currentDataIndex].map((item, index) => (
                        <tr key={index}>
                          <td> <input type="radio" name="group" id="selected" onClick={() => check(index)}></input></td>
                          <td style={{ color: disabledTds.includes(index) ? 'gray' : 'black' }}>{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => toggleData('prev')} disabled={currentDataIndex === 0 }>vorige file</button>
            <button onClick={() => toggleData('next')} disabled={currentDataIndex === count -1}>volgende file</button>
        </div>
    );
}
export default Exportcsv;