import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import GoBackArrow from '../components/GoBackArrow';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';
import { JobDataTable, RequestedRow, SelectOptions, UsersTable } from './Jobs';

function QuickJobDataPage(props) {
    const jobID = props.match.params.jobID;
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [quickJobData, setQuickJobData] = useState();
    const [workingSubContractorsInThisJob, setWorkingSubContractorsInThisJob] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [userData, setUserData] = useState([]);
    const [loadingContractors, setLoadingContractors] = useState(true);
    const [allReqUsers, setAllReqUsers] = useState([]);
    const [loadingJob, setLoadingJob] = useState(true);
    const [completedJobData, setCompletedJobData] = useState([]);

    async function getJobdata(setLoadingJob, setJobData, jobID, setWorkingSubContractorsInThisJob) {
        const result = await axios.get(GlobalData.baseUrl + `/api/admin/quick-job-data/${jobID}`, {
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

    async function getQuickJObData() {
        const result = await axios.get(GlobalData.baseUrl + `/api/admin/quick-job-data/${jobID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setQuickJobData(result.data);
        }
    }

    async function getAllCompletedJobData() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/get-done-quick-jobs-by-place',
            {
                job_id: jobID,
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

    async function getAllContractors(setUserData, setLoadingContractors, jobID) {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/get-contractors-quick-jobs',
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

    useEffect(() => {
        getAllCompletedJobData();
        getJobdata(setLoadingJob, setQuickJobData, jobID, setWorkingSubContractorsInThisJob);
        getAllContractors(setUserData, setLoadingContractors, jobID);
        getAllReqUsers();
    }, []);

    return (
        <div>
            <GoBackArrow />
            <h2 className="mt-3">{quickJobData ? quickJobData.job_name : ''}</h2>
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
            {completedJobData ? <JobDataTable jobData={completedJobData} /> : ''}
        </div>
    );
}

export default adminOnlyWrap(adminWrap(QuickJobDataPage));
