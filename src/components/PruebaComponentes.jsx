import * as React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab/DatePicker';

export default function FirstComponent(){
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker />
    </LocalizationProvider>
  );
}