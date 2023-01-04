import React, { useEffect } from 'react';
import { myJobs } from './MyJobs';
import { Button } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import { authToken } from '../allFuncs';

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

function MyJob(props) {
    const jobID = props.match.params.jobID;

    const jobData = myJobs.find((jb) => jb.id === jobID);
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="container py-4">
            <span className="go-back" onClick={goBack}>
                <ArrowBackIcon /> Go Back
            </span>
            <h1 className="my-3">{jobData.topic}</h1>
            <h4>Time Duration : {jobData.duration}</h4>
            <div className="d-flex">
                {jobData.started ? (
                    <Button variant="contained" className="bg-theme">
                        Finished
                    </Button>
                ) : (
                    <Button variant="contained" className="m-3">
                        Start
                    </Button>
                )}
            </div>
            <TimeTable daysToWork={jobData.daysToWork} />
            <h3 className="my-3">Job Details</h3>
            <p>{jobData.details}</p>
            <div className="w-100 my-3">{jobData.map}</div>
        </div>
    );
}

export default MyJob;
