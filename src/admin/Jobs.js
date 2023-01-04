import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { adminHomeData } from './AdminHome';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

import WarningIcon from '@mui/icons-material/WarningRounded';
import axios from 'axios';
import { GlobalData } from '../GlobalData';

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
                    <MenuItem value={itm.id ? itm.id : itm.val} key={index}>
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

function UserTableRow({ row, addOrRemoveUser, jobID }) {
    async function removeUserFromJob() {
        addOrRemoveUser(jobID, 'remove', row.id, row.name);
    }

    return (
        <tr>
            <td>{row.name}</td>
            <td>
                <Button variant="contained" color="error" onClick={removeUserFromJob}>
                    Remove
                </Button>
            </td>
        </tr>
    );
}

function UsersTable({ usersData = [], addOrRemoveUser, jobID }) {
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
                            <UserTableRow key={indx} row={row} addOrRemoveUser={addOrRemoveUser} jobID={jobID} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

async function getJobdata(setLoadingJob, setJobData, jobID, setWorkingSubContractorsInThisJob) {
    const result = await axios.get(GlobalData.baseUrl + `/api/admin/get-permanent-jobs/${jobID}`);
    if (result.status === 200) {
        setJobData(result.data);
        setWorkingSubContractorsInThisJob(result.data.job_enrolled_ids);
        setLoadingJob(false);
    }
}

function Jobs(props) {
    const jobID = props.match.params.jobID;
    const [jobData, setJobData] = useState({});
    const [loadingJob, setLoadingJob] = useState(true);

    const [loadingContractors, setLoadingContractors] = useState(true);
    const [userData, setUserData] = useState([]);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState((currentMonth + 1).toString().padStart(2, '0'));
    const [selectedUser, setSelectedUser] = useState('');

    const [workingSubContractorsInThisJob, setWorkingSubContractorsInThisJob] = useState([]);

    async function addOrRemoveUser(jobID, method, added_id, added_name) {
        const sendData = {
            id: jobID,
            method: method,
            added_id: added_id,
            added_name: added_name,
        };
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/add-or-remove-user-to-permanent-job', sendData);
        if (result.status === 200) {
            setWorkingSubContractorsInThisJob(result.data);
            getAllContractors(setUserData, setLoadingContractors, jobID);
        }
    }

    function addUserToJob() {
        if (selectedUser !== '') {
            const addedUser = userData.filter((usrs) => usrs.id === selectedUser)[0];
            addOrRemoveUser(jobID, 'add', addedUser.id, addedUser.name);
        }
    }

    async function getAllContractors(setUserData, setLoadingContractors, jobID) {
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-contractors', { jobID: jobID });
        if (result.status === 200) {
            setUserData(result.data);
            setLoadingContractors(false);
        }
    }

    useEffect(() => {
        getJobdata(setLoadingJob, setJobData, jobID, setWorkingSubContractorsInThisJob);
        getAllContractors(setUserData, setLoadingContractors, jobID);
    }, []);

    return (
        <div>
            <h2>{jobData.job_name}</h2>
            <UsersTable usersData={workingSubContractorsInThisJob} addOrRemoveUser={addOrRemoveUser} jobID={jobID} />
            <div className="d-flex p-3" style={{ alignItems: 'center' }}>
                <SelectOptions
                    setSelectedData={setSelectedUser}
                    selectedData={selectedUser}
                    inputLabel="All Users"
                    dropList={userData}
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
