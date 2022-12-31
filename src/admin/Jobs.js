import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { adminHomeData } from './AdminHome';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

function SelectOptions({ setSelectedData, selectedData, inputLabel, dropList = [], name = '', emptyVal = false }) {
    return (
        <FormControl variant="filled" className={`w-100 my-2`}>
            <InputLabel id="select-bank">{inputLabel}</InputLabel>
            <Select
                labelId="select-bank"
                id="demo-simple-select-filled"
                value={selectedData}
                onChange={(e) => setSelectedData(e.target.value)}
                name={name}
                required={true}
            >
                {emptyVal ? (
                    <MenuItem value="">
                        <em>{inputLabel}</em>
                    </MenuItem>
                ) : (
                    ''
                )}

                {dropList.map((itm, index) => (
                    <MenuItem value={itm.val} key={index}>
                        {itm.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

let allYears = [];
let allMonths = [
    {
        name: 'January',
        val: '01',
    },
    {
        name: 'February',
        val: '02',
    },
    {
        name: 'March',
        val: '03',
    },
    {
        name: 'April',
        val: '04',
    },
    {
        name: 'May',
        val: '05',
    },
    {
        name: 'June',
        val: '06',
    },
    {
        name: 'July',
        val: '07',
    },
    {
        name: 'August',
        val: '08',
    },
    {
        name: 'September',
        val: '09',
    },
    {
        name: 'October',
        val: '10',
    },
    {
        name: 'November',
        val: '11',
    },
    {
        name: 'December',
        val: '12',
    },
];

for (let i = 2022; i < 2100; i++) {
    allYears.push({ name: i, val: i });
}

function Jobs(props) {
    const jobID = props.match.params.jobID;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth + 1);

    return (
        <div>
            <h2>This is the Job Title</h2>
            <div className="d-flex">
                <SelectOptions setSelectedData={setSelectedYear} selectedData={selectedYear} inputLabel="Year" dropList={allYears} />
                <span style={{ width: '10px' }}></span>
                <SelectOptions setSelectedData={setSelectedMonth} selectedData={selectedMonth} inputLabel="Month" dropList={allMonths} />
                {/* <span style={{ width: '10px' }}></span> */}
                {/* <Button>Download </Button> */}
            </div>
            <GenTable tableData={adminHomeData} />
        </div>
    );
}

export default adminWrap(Jobs);
