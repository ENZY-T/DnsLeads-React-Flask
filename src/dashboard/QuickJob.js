import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { quickJob } from './QuickJobs';
import { authToken } from '../allFuncs';

function QuickJob(props) {
    const jobID = props.match.params.jobID;
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };
    useEffect(() => {
        authToken(history);
    }, []);
    return (
        <div className="container py-5">
            <span className="go-back" onClick={goBack}>
                <ArrowBackIcon /> Go Back
            </span>
            <h1 className="my-4">{quickJob.topic}</h1>
            <h4>Start Time : {quickJob.time}</h4>
            <h4>Per hour : A${quickJob.phr}.00</h4>
            <h3>Job Details</h3>
            <p>{quickJob.details}</p>
            {quickJob.location}
            <Button variant="contained" size="medium">
                Enroll for Job
            </Button>
        </div>
    );
}

export default QuickJob;
