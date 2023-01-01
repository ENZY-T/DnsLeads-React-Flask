import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { adminHomeData } from './AdminHome';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

import WarningIcon from '@mui/icons-material/WarningRounded';

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

function UsersTable({ usersData = [] }) {
    return (
        <div className="table-responsive">
            {usersData.length === 0 ? (
                <div className="alert alert-danger">
                    <h5 style={{ textAlign: 'center' }}>
                        <WarningIcon /> No Sub-Contractors has enrolled for this job
                    </h5>
                </div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((row, indx) => (
                            <tr key={indx}>
                                <td>{row.name}</td>
                                <td>{row.actionBtn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function Jobs(props) {
    const jobID = props.match.params.jobID;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState((currentMonth + 1).toString().padStart(2, '0'));
    const [selectedUser, setSelectedUser] = useState('');

    const [workingSubContractorsInThisJob, setWorkingSubContractorsInThisJob] = useState([
        {
            id: '546513',
            name: 'Kavindu Harshitha',
            actionBtn: (
                <Button variant="contained" color="error" onClick={() => removeUserFromJob('546513')}>
                    Remove
                </Button>
            ),
        },
    ]);

    const [allUsers, setAllUsers] = useState([
        {
            val: '546513',
            name: 'Kavindu Harshitha',
        },
        {
            val: '598913',
            name: 'Chathura Vinod',
        },
        {
            val: '598919',
            name: 'Adam Levine',
        },
    ]);

    function removeUserFromJob(id) {
        console.log(workingSubContractorsInThisJob);
        const currentArr = [...workingSubContractorsInThisJob];
        // console.log(currentArr);
        setWorkingSubContractorsInThisJob(workingSubContractorsInThisJob.filter((item) => item.id !== id));
    }

    function addUserToJob() {
        if (selectedUser !== '') {
            const addedUser = allUsers.filter((usrs) => usrs.val === selectedUser)[0];
            const newStateToAdd = {
                id: addedUser.val,
                name: addedUser.name,
                actionBtn: (
                    <Button variant="contained" color="error" onClick={() => removeUserFromJob(addedUser.val)}>
                        Remove
                    </Button>
                ),
            };
            setWorkingSubContractorsInThisJob([...workingSubContractorsInThisJob, newStateToAdd]);
            setSelectedUser('');
            console.log(workingSubContractorsInThisJob);
        }
    }

    return (
        <div>
            <h2>This is the Job Title</h2>
            <UsersTable usersData={workingSubContractorsInThisJob} />
            <div className="d-flex p-3" style={{ alignItems: 'center' }}>
                <SelectOptions
                    setSelectedData={setSelectedUser}
                    selectedData={selectedUser}
                    inputLabel="All Users"
                    dropList={allUsers}
                    emptyVal={true}
                />
                <span style={{ width: '10px' }}></span>
                <Button variant="contained" color="primary" size="small" style={{ width: '180px', height: '50px' }} onClick={addUserToJob}>
                    Add User To Job
                </Button>
            </div>
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
