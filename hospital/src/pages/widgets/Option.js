import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function Option() {
  return (
    <div>
        <FormControl fullWidth>
        <InputLabel>Age</InputLabel>
        <Select>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        </FormControl>
    </div>
  )
}

export default Option