import axios from "axios";
import React, { useEffect, useState } from "react";

function Exportcsv(props) {
    const [optionDisabled, setOptionDisabled] = useState(false);
    const [handleSelectChange,setHandleSelectChange] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
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
    const testArray = [
        ['weer','een','kleine','test'],
        ['6','7','8','9'],
        ['watermeloen','grapefruit'],
        ['boot','brommer'],
        ['leeuw','giraf'],
        
    ];

    // const count = dataArray.length;
    const count = props.test.length;
    useEffect(() =>{
        const initialDisabledTds = props.test && props.test[currentDataIndex] ? 
        Array.from({ length: props.test[currentDataIndex].length }, (_, index) => index) :
        [];
        setDisabledTds(initialDisabledTds);
        console.log("csv data from import",props.test);
        // axios.get('https://csv-converter.techdogcloud.com/api/getcsv')
        // .then(response => {
        //     setGetData(response.data.getData);
        //     console.log('getdata',getData);
        // })
        // .catch(error => {
        //     console.error('Error fetching CSV data', error);
        // });
}, [currentDataIndex,props.test]);
//eerst wel alle array van elkaar weer splitten


//dit zijn voor de 2 buttons onderaan
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
function check(index)
    {
 //voor selecteren welke regel
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
    setDisabledTds([]);//hierdoor worden alle items weer enabled
    document.getElementById("selected").checked = false;

    setOptionDisabled(true);
    // if (value === "1") {
    //     setOptionDisabled(prevState => ({
    //         ...prevState,
    //         "1": true         
    //     }));
    // } else {
    //     setOptionDisabled(prevState => ({
    //         ...prevState,
    //         "1": false
    //     }));
    // }
}
    return (
        <div> 
            <select value={selectedOption} onChange={handleSelectChangeHandler}>
                <option value="" disabled  hidden >Kies je optie</option>
                <option value="1" disabled={optionDisabled}>Productnaam</option>
                <option value="2">Productnummer</option>
            </select>
            <table style={{  border: '1px solid black' }}>
                <thead>
                    <tr>
                        <th>Eerste product regel</th>
                        <th>Kolom</th>
                        <th>kolom2</th>
                    </tr>
                </thead>
                <tbody>
                    {props.test && props.test[currentDataIndex] ?
                    props.test[currentDataIndex].map((item, index) => (
                        <tr key={index} >
                          <td style={{  border: '1px solid black' }}> <input type="radio" name="group" id="selected" onClick={() => check(index)}></input></td>
                          <td style={{  border:'1px solid black' ,color: disabledTds.includes(index) ? 'gray' : 'black' }}>{item}</td>
                          <td style={{  border: '1px solid black', color: disabledTds.includes(index) ? 'gray' : 'black' }}>{props.test[currentDataIndex][index]}</td>
                        </tr>
                    
                    )): null} 
                </tbody>
            </table>
            <button onClick={() => toggleData('prev')} disabled={currentDataIndex === 0 }>vorige file</button>
            <button onClick={() => toggleData('next')} disabled={currentDataIndex === count -1}>volgende file</button>
            <button>terug naar kiezen</button>
        </div>
    );
}
export default Exportcsv;