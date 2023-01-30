import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { adminOnlyWrap, userOnlyWrap } from '../components/wraps';
import { adminWrap } from './component/adminWrap';

export function TimeTable({ daysToWork }) {
    return (
        <div className="table-container my-3">
            <div className="header">
                <div className="cell">Time</div>
                <div className="cell">Mo</div>
                <div className="cell">Tu</div>
                <div className="cell">We</div>
                <div className="cell">Th</div>
                <div className="cell">Fr</div>
                <div className="cell">Sa</div>
                <div className="cell">Su</div>
            </div>
            <div className="table-body">
                {daysToWork.map((obj, indx) => (
                    <div className="table-row" key={indx}>
                        <div className="cell">{obj.time}</div>
                        {obj.days.map((day, index) => (
                            <div className="cell" key={index}>
                                {day !== '' ? <CheckIcon className="txt-green" /> : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminMyJob(props) {
    const jobID = props.match.params.jobID;
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);
    const [jobData, setJobData] = useState({});
    const [jobStarted, setJobStarted] = useState();
    const history = useHistory();
    const { authState, setCurrentPermanentJobID } = useContext(AppContext);
    // console.log(authState);

    const goBack = () => {
        history.goBack();
    };

    async function loadJobData() {
        const result = await axios.get(GlobalData.baseUrl + `/api/get-permanent-jobs/${jobID}`, {
            headers: {
                Authorization: `Bearer ${authTokenData}`,
            },
        });
        if (result.status === 200) {
            setJobData(result.data);
            setJobStarted(
                authState.loggedUser.current_job_id === 'empty' ? false : authState.loggedUser.current_job_id === jobID ? true : false
            );
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
        loadJobData();
    }, []);

    return (
        <div className="container py-4">
            {jobData ? (
                <div>
                    <span className="go-back" onClick={goBack}>
                        <ArrowBackIcon /> Go Back
                    </span>
                    <h1 className="my-3">{jobData.job_name}</h1>
                    <h4>Per Fortnight : A${jobData.job_payment_for_fortnight}0</h4>
                    <div className="d-flex">
                        {authState.loggedUser.current_permanent_job_row_id !== 'empty' ? (
                            <Button variant="contained" className="bg-theme" onClick={finishJob}>
                                Finished
                            </Button>
                        ) : (
                            <Button variant="contained" className="m-3" onClick={startJob}>
                                Start
                            </Button>
                        )}
                    </div>
                    {jobData.job_timetable ? <TimeTable daysToWork={jobData.job_timetable} /> : ''}

                    <h3 className="my-3">Job Details</h3>
                    <p>{jobData.job_desc}</p>
                    {/* <div className="w-100 my-3">{jobData.map}</div> */}
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default adminOnlyWrap(adminWrap(AdminMyJob));
