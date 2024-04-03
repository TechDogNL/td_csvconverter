import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

function Tabel() {
  const options = ["Option 1", "Option 2", "Option 3"];
  const [localDisabledOptions, setLocalDisabledOptions] = useState([]);
  const [globalDisabledOptions, setGlobalDisabledOptions] = useState([]);


  
  const handleChange = (event, newValue) => {
    if (newValue) {
      // Enable the selected option in the current textfield
      setLocalDisabledOptions((prevOptions) =>
        prevOptions.filter((option) => option !== newValue)
      );
    }
  };

  const handleBlur = (event, newValue) => {
    if (newValue) {
      // Disable the selected option globally
      setGlobalDisabledOptions((prevOptions) => [...prevOptions, newValue]);
    }
  };


  return (
    <div>
        <Autocomplete
      options={options}
      onChange={handleChange}
      onBlur={handleBlur}
      getOptionDisabled={(option) =>
        globalDisabledOptions.includes(option) ||
        localDisabledOptions.includes(option)
      }
      renderInput={(params) => (
        <TextField {...params} label="Select an option" variant="outlined" />
      )}
    />
    </div>
  );
}

export default Tabel;
