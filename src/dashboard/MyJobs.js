import React, { useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import { authToken, getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { userOnlyWrap } from '../components/wraps';
import GoBackArrow from '../components/GoBackArrow';

function QuickJobCard({ job }) {
    const { authState, setCurrentQuickJobID } = useContext(AppContext);
    const [jobStarted, setJobStarted] = useState();
    const [jobData, setJobData] = useState();
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);

    const jobID = job.job_id;
    const date = new Date();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let today = `${date.getFullYear()}-${month}-${day}`;

    async function getMyJobCardData() {
        const result = await axios.get(GlobalData.baseUrl + `/api/quick-job-data/${jobID}`, {
            headers: {
                Authorization: `Bearer ${authTokenData}`,
            },
        });
        if (result.status === 200) {
            setJobData(result.data);
        }
    }

    async function startJob() {
        if (window.confirm('Do you want to start the job?') === true) {
            let latitude = '';
            let longitude = '';
            axios
                .post(
                    GlobalData.baseUrl + '/api/start-quick-job',
                    { user_id: authState.loggedUser.id, job_id: jobID, start_location: `${latitude},${longitude}` },
                    {
                        headers: {
                            Authorization: `Bearer ${authTokenData}`,
                        },
                    }
                )
                .then((result) => {
                    if (result.status === 200) {
                        const data = result.data;
                        alert(data.msg);
                        setCurrentQuickJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                    }
                });
            // navigator.geolocation.getCurrentPosition(
            //     (position) => {
            //         latitude = position.coords.latitude;
            //         longitude = position.coords.longitude;

            //     },
            //     (error) => {
            //         alert(error);
            //     }
            // );
        }
    }
    async function finishJob() {
        if (window.confirm('Do you want to finish the job?') === true) {
            let latitude = '';
            let longitude = '';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    axios
                        .post(
                            GlobalData.baseUrl + '/api/stop-quick-job',
                            {
                                user_id: authState.loggedUser.id,
                                row_id: authState.loggedUser.current_quick_job_row_id,
                                finish_location: `${latitude},${longitude}`,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authTokenData}`,
                                },
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                const data = result.data;
                                setCurrentQuickJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                            }
                        });
                },
                (error) => {
                    alert(error);
                }
            );
        }
    }

    useEffect(() => {
        getMyJobCardData();
        setJobStarted(
            authState.loggedUser.current_job_id === 'empty' ? false : authState.loggedUser.current_job_id === job.job_id ? true : false
        );
    }, []);

    return (
        <div className="job-card">
            <div className="inner p-4">
                <h3>
                    <Link className="txt-theme" to={`/my-jobs/${job.job_id}`}>
                        {job.job_name}
                    </Link>
                </h3>
                <h5>
                    <LocationOnIcon />{' '}
                    <a href={job.job_location} target="_blank">
                        {job.job_name}
                    </a>
                </h5>
                {/* <h5>
                    <CalendarMonthIcon /> {job.nextWorkDate}
                </h5> */}
                {/* <h5>
                    <ScheduleIcon /> Duration : {job.job_duration}
                </h5> */}
                <h5>
                    <FlagIcon /> Job times :
                    <br />
                    {`${jobData ? jobData.job_date : ''} - ${jobData ? jobData.job_start_time : ''}`}
                </h5>
                {jobData ? (
                    jobData.job_date === today ? (
                        authState.loggedUser.current_quick_job_id === job.job_id ? (
                            <Button variant="contained" className="bg-theme" onClick={finishJob}>
                                Finished
                            </Button>
                        ) : (
                            <Button variant="contained" className="m-3" onClick={startJob}>
                                Start
                            </Button>
                        )
                    ) : (
                        <span className="txt-yellow">You don't have work today</span>
                    )
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

function JobCard({ job }) {
    const { authState, setCurrentPermanentJobID } = useContext(AppContext);
    const [jobStarted, setJobStarted] = useState();
    const [jobData, setJobData] = useState();
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);

    const jobID = job.job_id;

    async function getMyJobCardData() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/get-duration-start-time',
            { user_id: authState.loggedUser.id, job_id: jobID },
            {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            }
        );
        console.log(result.data);
        if (result.status === 200) {
            setJobData(result.data);
        }
    }

    async function startJob() {
        if (window.confirm('Do you want to start the job?') === true) {
            let latitude = '';
            let longitude = '';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    axios
                        .post(
                            GlobalData.baseUrl + '/api/start-permanent-job',
                            { user_id: authState.loggedUser.id, job_id: jobID, start_location: `${latitude},${longitude}` },
                            {
                                headers: {
                                    Authorization: `Bearer ${authTokenData}`,
                                },
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                const data = result.data;
                                alert(data.msg);
                                setCurrentPermanentJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                            }
                        });
                },
                (error) => {
                    alert(error);
                }
            );
        }
    }
    async function finishJob() {
        if (window.confirm('Do you want to finish the job?') === true) {
            let latitude = '';
            let longitude = '';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    axios
                        .post(
                            GlobalData.baseUrl + '/api/stop-permanent-job',
                            {
                                user_id: authState.loggedUser.id,
                                row_id: authState.loggedUser.current_permanent_job_row_id,
                                finish_location: `${latitude},${longitude}`,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authTokenData}`,
                                },
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                const data = result.data;
                                setCurrentPermanentJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                            }
                        });
                },
                (error) => {
                    alert(error);
                }
            );
        }
    }

    useEffect(() => {
        getMyJobCardData();
        setJobStarted(
            authState.loggedUser.current_job_id === 'empty' ? false : authState.loggedUser.current_job_id === job.job_id ? true : false
        );
    }, []);

    return (
        <div className="job-card">
            <div className="inner p-4">
                <h3>
                    <Link className="txt-theme" to={`/my-jobs/${job.job_id}`}>
                        {job.job_name}
                    </Link>
                </h3>
                <h5>
                    <LocationOnIcon />{' '}
                    <a href={job.job_location} target="_blank">
                        {job.job_name}
                    </a>
                </h5>
                {/* <h5>
                    <CalendarMonthIcon /> {job.nextWorkDate}
                </h5> */}
                {/* <h5>
                    <ScheduleIcon /> Duration : {job.job_duration}
                </h5> */}
                <h5>
                    <FlagIcon /> Job times :{' '}
                    {jobData ? (
                        jobData.length > 0 ? (
                            jobData.map((tm, indx) => (
                                <span key={indx}>
                                    {tm}
                                    <br />
                                </span>
                            ))
                        ) : (
                            <span className="txt-yellow">
                                <br />
                                You don't have work today
                            </span>
                        )
                    ) : (
                        ''
                    )}
                </h5>
                {jobData ? (
                    jobData.length > 0 ? (
                        authState.loggedUser.current_permanent_job_id === job.job_id ? (
                            <Button variant="contained" className="bg-theme" onClick={finishJob}>
                                Finished
                            </Button>
                        ) : (
                            <Button variant="contained" className="m-3" onClick={startJob}>
                                Start
                            </Button>
                        )
                    ) : (
                        ''
                    )
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

function MyJobs() {
    const { authState } = useContext(AppContext);
    return (
        <div className="container py-4">
            <h1 className="p-4">My Jobs</h1>
            {authState.loggedUser.quick_jobs ? (
                authState.loggedUser.quick_jobs.length > 0 ? (
                    <>
                        <div className="jobs-card-container">
                            {authState.loggedUser.quick_jobs ? (
                                authState.loggedUser.quick_jobs.length > 0 ? (
                                    authState.loggedUser.quick_jobs.map((job, index) => <QuickJobCard job={job} key={index} />)
                                ) : (
                                    <h3 className="px-4">You haven't assign for any job</h3>
                                )
                            ) : (
                                <h3 className="px-4">You haven't assign for any job</h3>
                            )}
                        </div>
                    </>
                ) : (
                    ''
                )
            ) : (
                ''
            )}
            {authState.loggedUser.quick_jobs ? authState.loggedUser.quick_jobs.length > 0 ? <hr /> : '' : ''}
            <div className="jobs-card-container">
                {authState.loggedUser.permanent_jobs ? (
                    authState.loggedUser.permanent_jobs.length > 0 ? (
                        authState.loggedUser.permanent_jobs.map((job, index) => <JobCard job={job} key={index} />)
                    ) : (
                        <h3 className="px-4">You haven't assign for any job</h3>
                    )
                ) : (
                    <h3 className="px-4">You haven't assign for any job</h3>
                )}
            </div>
        </div>
    );
}

export default userOnlyWrap(MyJobs);
