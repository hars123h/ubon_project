import * as React from 'react';
import {Radio, RadioGroup, FormControl, FormControlLabel, FormLabel} from '@material-ui/core';

export default function Status({value, setValue}) {
//   const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
        row
      >
        <FormControlLabel value="pending" control={<Radio />} label="pending" />
        <FormControlLabel value="confirmed" control={<Radio />} label="confirmed" />
        <FormControlLabel value="declined" control={<Radio />} label="declined" />
      </RadioGroup>
    </FormControl>
  );
}
