import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import { authToken, getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { userOnlyWrap } from '../components/wraps';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import GoBackArrow from '../components/GoBackArrow';
import { AppContext } from '../Context/AppContext';

function QuickJob(props) {
    const jobID = props.match.params.jobID;
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
    const { authState } = useContext(AppContext);

    const [quickJob, setQuickJob] = useState({});
    const history = useHistory();
    const [isRequested, setIsRequested] = useState(false);

    async function getQuickJObData() {
        const result = await axios.get(GlobalData.baseUrl + `/api/quick-job-data/${jobID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.data.status === 'error') {
            history.push('/quick-jobs');
        }
        if (result.status === 200) {
            setQuickJob(result.data);
        }
    }

    useEffect(() => {
        getQuickJObData();
    }, []);

    async function reqForJob() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/req-for-permanent-job',
            { job_id: jobID, user_id: authState.loggedUser.id },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        // console.log(result.data);
        if (result.status === 200) {
            if (result.data === 'done') {
                setIsRequested(true);
            } else {
                setIsRequested(false);
            }
        }
    }

    return (
        <div className="container py-5">
            <GoBackArrow />
            <h1 className="my-4">{quickJob.job_name}</h1>
            <h4>Job Date : {quickJob.job_date}</h4>
            <h4>Start Time : {quickJob.job_start_time}</h4>
            <h3>Job Details</h3>
            <p>{quickJob.job_desc}</p>
            <Button size="medium" className="my-3">
                <a href={quickJob.job_location} target="_blank" rel="noopener noreferrer">
                    location
                </a>
            </Button>
            <br />
            <br />
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
    );
}

export default userOnlyWrap(QuickJob);
