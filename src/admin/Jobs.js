import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { adminHomeData } from './AdminHome';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';
import { useReactToPrint } from 'react-to-print';
import WarningIcon from '@mui/icons-material/WarningRounded';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { adminOnlyWrap } from '../components/wraps';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import GoBackArrow from '../components/GoBackArrow';
import NewInvoice from '../components/NewInvoice';
import { AppContext } from '../Context/AppContext';
import { useHistory } from 'react-router-dom';

export function JobDataTable({ jobData }) {
    return (
        <div>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Done By</th>
                            <th>Start Time - End Time</th>
                            {/* <th>Duration</th> */}
                            <th>Pay-C/day</th>
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
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span>{jobRow.start_time}</span>
                                            <a href={jobRow.job_started_location} target="_blank" className="mx-3">
                                                location
                                            </a>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            {jobRow.ended_time === 'pending' ? '--:--:--' : `${jobRow.end_time}`}
                                            {jobRow.job_ended_location === '' ? (
                                                <span className="txt-yellow mx-3">Pending</span>
                                            ) : (
                                                <a href={jobRow.job_ended_location} target="_blank" className="mx-3">
                                                    location
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {/* <td>
                                    {jobRow.job_duration} / {jobRow.must_time.duration}
                                </td> */}
                                <td>A$ {jobRow.job_payment_for_day.split('-')[0]}</td>
                                <td>A$ {jobRow.job_payment_for_day.split('-')[1]}</td>
                                <td>
                                    {jobRow.job_status === 'done' ? (
                                        parseInt(jobRow.job_counts_per_day) === 0 ? (
                                            <span className="txt-green">Done</span>
                                        ) : (
                                            <span className="txt-yellow">{jobRow.job_counts_per_day} Pending</span>
                                        )
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
        <FormControl variant="filled" className={`w-100 my-4`}>
            <InputLabel id="select-bank">{inputLabel}</InputLabel>
            <Select
                labelId="select-bank"
                id="demo-simple-select-filled"
                value={selectedData}
                onChange={(e) => {
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

export function UsersTable({ usersData = [], addOrRemoveUser, jobID }) {
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
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
    const result = await axios.get(GlobalData.baseUrl + `/api/admin/get-permanent-jobs/${jobID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (result.status === 200) {
        setJobData(result.data);
        setWorkingSubContractorsInThisJob(result.data.job_enrolled_ids);
        setLoadingJob(false);
    }
}

export function RequestedRow({
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
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

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
    const [allContractorsList, setAllContractorsList] = useState([]);

    async function addOrRemoveUser(jobID, method, added_id, added_name) {
        const sendData = {
            id: jobID,
            method: method,
            added_id: added_id,
            added_name: added_name,
        };
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/add-or-remove-user-to-permanent-job', sendData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/get-contractors',
            { jobID: jobID },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (result.status === 200) {
            setUserData(result.data);
            setLoadingContractors(false);
        }
    }

    async function getAllContractorsList() {
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-all-sub-contractors', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setAllContractorsList(result.data);
        }
    }

    async function getAllCompletedJobData() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place',
            {
                job_id: jobID,
                year: currentYear,
                month: currentMonth + 1,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (result.status === 200) {
            setCompletedJobData(result.data);
        }
    }

    async function getAllCompletedJobDataOnChangeMonth(newMonth) {
        const sendData = {
            job_id: jobID,
            year: selectedYear,
            month: newMonth,
        };
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place', sendData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/get-done-jobs-by-place', sendData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setCompletedJobData(result.data);
        }
    }

    async function getAllReqUsers() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/get-all-req-users',
            { job_id: jobID },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (result.status === 200) {
            setAllReqUsers(result.data);
        }
    }

    const invoiceRef = useRef();
    const [data, setData] = useState({
        invoice_number: '',
        to_name: '',
        to_address: '',
        sub_total: '',
        gst: '',
        total: '',
        duration: '',
    });

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    const [isPdf, setIsPdf] = useState(false);
    const { setInvoiceDataForPDF, invoiceData } = useContext(AppContext);
    const history = useHistory();

    async function downloadPdf() {
        const sendData = {
            job_id: jobID,
            year: selectedYear,
            month: selectedMonth,
        };
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/req-invoice-data', sendData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            console.log(result.data);
            setInvoiceDataForPDF(result.data);
            setTimeout(() => {
                history.push(`/invoice`);
            }, 1000);
        } else {
            alert(result.data.msg);
        }
    }

    const [m_payForMe, m_setPayForMe] = useState();
    const [m_payForCleaner, m_setPayForCleaner] = useState();
    const [m_dateTine, m_setDateTime] = useState();
    const [m_doneBy, m_setDoneBy] = useState();

    const manualAddFormRef = useRef();

    async function addNewRecord() {
        if (window.confirm('Do you want to add manual record?')) {
            const data = {
                m_payForMe: m_payForMe,
                m_payForCleaner: m_payForCleaner,
                m_dateTine: m_dateTine,
                m_doneBy: m_doneBy,
                job_id: jobID,
            };
            const result = await axios.post(GlobalData.baseUrl + '/api/admin/manual-record-add', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (result.status === 200) {
                window.location.reload();
            } else {
                alert(result.data.msg);
            }
        }
    }

    useEffect(() => {
        getJobdata(setLoadingJob, setJobData, jobID, setWorkingSubContractorsInThisJob);
        getAllContractors(setUserData, setLoadingContractors, jobID);
        getAllContractorsList();
        getAllCompletedJobData();
        getAllReqUsers();
    }, []);

    return (
        <div>
            {isPdf ? <NewInvoice invoiceRef={invoiceRef} data={data} /> : ''}

            <GoBackArrow />
            <h2 className="mt-3">{jobData.job_name}</h2>
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
            <div className="d-flex" style={{ alignItems: 'center' }}>
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
                <span style={{ width: '10px' }}></span>
                <Button onClick={downloadPdf} variant="contained" color="primary" style={{ height: '50px' }}>
                    Download Invoice
                </Button>
            </div>
            <div className="my-3">
                <h4>Enter record manualy</h4>
                <form style={{ display: 'flex', width: '100%', flexDirection: 'column' }} ref={manualAddFormRef}>
                    <input type="text" className="form-control my-2" name="pay_for_me" placeholder="Payment for me/day" />
                    <input type="text" className="form-control my-2" name="pay_for_cleaner" placeholder="Payment for cleaner/day" />
                    <input type="datetime-local" className="form-control my-2" name="date" />
                    <SelectOptions
                        setSelectedData={m_setDoneBy}
                        selectedData={m_doneBy}
                        inputLabel="Done By"
                        dropList={allContractorsList}
                        emptyVal={true}
                    />
                    <Button variant="contained" onSubmit={addNewRecord} color="primary" className="my-2" style={{ width: '350px' }}>
                        Add New Record
                    </Button>
                </form>
            </div>
            {completedJobData ? <JobDataTable jobData={completedJobData} /> : ''}
        </div>
    );
}

export default adminOnlyWrap(adminWrap(Jobs));
