import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TimeTable } from './MyJob';
import { Button } from '@mui/material';
import { permanentJob } from './PermanentJobs';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { AppContext } from '../Context/AppContext';
import { userOnlyWrap } from '../components/wraps';

const daysToWork = [
    {
        time: '07:00-08:00',
        days: ['Mo', 'Tu', 'We', 'Th', 'Fr', '', ''],
    },
    {
        time: '14:30-15:30',
        days: ['', '', '', '', '', 'Sa', 'Su'],
    },
];

function PermanentJob(props) {
    const jobID = props.match.params.jobID;
    const history = useHistory();
    const { authState } = useContext(AppContext);
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);
    const [isRequested, setIsRequested] = useState(false);

    const goBack = () => {
        history.goBack();
    };

    const [JobData, setJobData] = useState({});

    async function getPermanentJob() {
        const result = await axios.post(
            GlobalData.baseUrl + `/api/get-permanent-job`,
            { user_id: authState.loggedUser.id, job_id: jobID },
            {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            }
        );

        if (result.status === 200) {
            if (result.data.status === 'enrolled') {
                history.push(`/my-jobs/${result.data.job_id}`);
            } else if (result.data.status === 'not-available') {
                history.push(`/permanent-jobs`);
            } else {
                setJobData(result.data);
            }
        }
    }

    async function reqForJob() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/req-for-permanent-job',
            { job_id: jobID, user_id: authState.loggedUser.id },
            {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            }
        );

        if (result.status === 200) {
            if (result.data === 'done') {
                setIsRequested(true);
            } else {
                setIsRequested(false);
            }
        }
    }

    async function checkIsRequested() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/check-is-req-for-permanent-job',
            { job_id: jobID, user_id: authState.loggedUser.id },
            {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            }
        );

        if (result.status === 200) {
            if (result.data.status === 'not-enrolled') {
                setIsRequested(false);
            } else if (result.data.status === 'enrolled') {
                setIsRequested(true);
            }
        }
    }

    useEffect(() => {
        getPermanentJob();
        checkIsRequested();
    }, []);

    return (
        <div>
            {JobData ? (
                <div className="container py-5">
                    <span className="go-back" onClick={goBack}>
                        <ArrowBackIcon /> Go Back
                    </span>
                    <h1 className="my-4">{JobData.job_name}</h1>
                    <h4>Per Fortnight : A${JobData.job_payment_for_fortnight}</h4>
                    {JobData.job_timetable ? <TimeTable daysToWork={JobData.job_timetable} /> : ''}
                    <h4>Job Details</h4>
                    <p>{JobData.job_desc}</p>
                    {/* {permanentJob.location} */}
                    {isRequested ? (
                        <div className="alert alert-warning my-3" role="alert">
                            You have already request for the job. Waiting for admin to decide.
                        </div>
                    ) : (
                        <Button variant="contained" size="medium" className="my-3" onClick={reqForJob}>
                            Request for Job
                        </Button>
                    )}
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

export default userOnlyWrap(PermanentJob);
