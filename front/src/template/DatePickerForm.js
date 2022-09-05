import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function JalaliDatePicker() {
    const [value, setValue] = React.useState(new Date());

    return (

        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                openTo="year"
                label='생년월일'
                inputFormat="yyyy-MM-dd"
                views={['year', 'month', 'day']}
                disableFuture={true}
                value={value}
                onChange={(newValue) => { setValue(newValue); }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}
