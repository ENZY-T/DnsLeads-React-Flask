import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { adminHomeData } from './AdminHome';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

import WarningIcon from '@mui/icons-material/WarningRounded';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { adminOnlyWrap } from '../components/wraps';

function JobDataTable({ jobData }) {
    return (
        <div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Done By</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Pay/day</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobData.map((jobRow, indx) => (
                            <tr key={indx}>
                                <td>{indx}</td>
                                <td>{jobRow.date}</td>
                                <td>{jobRow.user_name}</td>
                                <td>
                                    {jobRow.started_time}
                                    {` (${jobRow.must_time.start_time})`}
                                    <a href={jobRow.job_started_location} target="_blank" className="mx-3">
                                        location
                                    </a>
                                </td>
                                <td>
                                    {jobRow.ended_time === 'pending' ? '--:--:--' : `${jobRow.ended_time} (${jobRow.must_time.start_time})`}
                                    {jobRow.job_ended_location === '' ? (
                                        <span className="txt-yellow mx-3">Pending</span>
                                    ) : (
                                        <a href={jobRow.job_ended_location} target="_blank" className="mx-3">
                                            location
                                        </a>
                                    )}
                                </td>
                                <td>
                                    {jobRow.job_duration} / {jobRow.must_time.duration}
                                </td>
                                <td>A$ {jobRow.job_payment_for_day.split('.')[0]}.00</td>
                                <td>
                                    {jobRow.job_status === 'done' ? (
                                        <span className="txt-green">Done</span>
                                    ) : (
                                        <span className="txt-yellow">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function SelectOptions({
    setSelectedData,
    selectedData,
    inputLabel,
    dropList = [],
    name = '',
    emptyVal = false,
    ifOnChange = (test) => {},
}) {
    return (
        <FormControl variant="filled" className={`w-100 my-2`}>
            <InputLabel id="select-bank">{inputLabel}</InputLabel>
            <Select
                labelId="select-bank"
                id="demo-simple-select-filled"
                value={selectedData}
                onChange={(e) => {
                    // console.log(e.target.value);
                    setSelectedData(e.target.value);
                    ifOnChange(e.target.value);
                }}
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

export let allYears = [];
export let allMonths = [
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

function RequestedRow({
    jobID,
    row,
    indx,
    setAllReqUsers,
    allReqUsers,
    userData,
    setUserData,
    workingSubContractorsInThisJob,
    setWorkingSubContractorsInThisJob,
}) {
    ////////////////////////////////////////////////////////////////////////////////////////
    async function acceptJob() {
        const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/accept-req-job',
            {
                job_id: jobID,
                user_id: row.user_id,
                row_id: row.row_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (result.status === 200) {
            setAllReqUsers(allReqUsers.filter((rw) => rw.row_id !== row.row_id));
            setUserData(userData.filter((itm) => itm.id !== row.user_id));
            setWorkingSubContractorsInThisJob([...workingSubContractorsInThisJob, { id: row.user_id, name: row.user_name }]);
        }
    }

    async function rejectJob() {
        const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/reject-req-job',
            { row_id: row.row_id },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        setAllReqUsers(allReqUsers.filter((rw) => rw.row_id !== row.row_id));
    }
    ////////////////////////////////////////////////////////////////////////////////////////

    return (
        <tr>
            <td>{indx + 1}</td>
            <td>{row.user_name}</td>
            <td>
                <div className="d-flex">
                    <Button variant="contained" color="success" onClick={acceptJob}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" className="mx-2" onClick={rejectJob}>
                        Reject
                    </Button>
                </div>
            </td>
        </tr>
    );
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
    const [completedJobData, setCompletedJobData] = useState([]);
    const [allReqUsers, setAllReqUsers] = useState([]);

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

    async function getAllCompletedJobData() {
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place', {
            job_id: jobID,
            year: currentYear,
            month: currentMonth + 1,
        });
        if (result.status === 200) {
            console.log(result.data);
            setCompletedJobData(result.data);
        }
    }

    async function getAllCompletedJobDataOnChangeMonth(newMonth) {
        const sendData = {
            job_id: jobID,
            year: selectedYear,
            month: newMonth,
        };
        console.log(sendData);
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place', sendData);
        if (result.status === 200) {
            setCompletedJobData(result.data);
        }
    }

    async function getAllCompletedJobDataOnChangeYear(newYear) {
        const sendData = {
            job_id: jobID,
            year: newYear,
            month: selectedMonth,
        };
        console.log(sendData);
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place', sendData);
        if (result.status === 200) {
            setCompletedJobData(result.data);
        }
    }

    async function getAllReqUsers() {
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-all-req-users', { job_id: jobID });
        if (result.status === 200) {
            setAllReqUsers(result.data);
        }
    }

    useEffect(() => {
        getJobdata(setLoadingJob, setJobData, jobID, setWorkingSubContractorsInThisJob);
        getAllContractors(setUserData, setLoadingContractors, jobID);
        getAllCompletedJobData();
        getAllReqUsers();
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
            {allReqUsers ? (
                allReqUsers.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>User Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allReqUsers.map((row, indx) => (
                                    <RequestedRow
                                        jobID={jobID}
                                        row={row}
                                        indx={indx}
                                        key={indx}
                                        setAllReqUsers={setAllReqUsers}
                                        allReqUsers={allReqUsers}
                                        userData={userData}
                                        setUserData={setUserData}
                                        workingSubContractorsInThisJob={workingSubContractorsInThisJob}
                                        setWorkingSubContractorsInThisJob={setWorkingSubContractorsInThisJob}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    ''
                )
            ) : (
                ''
            )}
            <div className="d-flex">
                <SelectOptions
                    setSelectedData={setSelectedYear}
                    selectedData={selectedYear}
                    inputLabel="Year"
                    dropList={allYears}
                    ifOnChange={getAllCompletedJobDataOnChangeYear}
                />
                <span style={{ width: '10px' }}></span>
                <SelectOptions
                    setSelectedData={setSelectedMonth}
                    selectedData={selectedMonth}
                    inputLabel="Month"
                    dropList={allMonths}
                    ifOnChange={getAllCompletedJobDataOnChangeMonth}
                />
                {/* <span style={{ width: '10px' }}></span> */}
                {/* <Button>Download </Button> */}
            </div>
            {completedJobData ? <JobDataTable jobData={completedJobData} /> : ''}
        </div>
    );
}

export default adminOnlyWrap(adminWrap(Jobs));
