import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import { authToken, getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { userOnlyWrap } from '../components/wraps';
import axios from 'axios';
import { GlobalData } from '../GlobalData';

function JobCard({ job }) {
    const history = useHistory();
    const moreDetails = () => {
        history.push(`/quick-jobs/${job.job_id}`);
    };
    return (
        <div className="job-card-container">
            <div className="job-card p-4">
                <h3>{job.job_name}</h3>
                <div>
                    <CalendarMonthIcon /> <p>Date : {job.job_date}</p>
                </div>
                <div>
                    <ScheduleIcon /> <p>Time : {job.job_start_time}</p>
                </div>
                <Button size="large" variant="contained" className="my-3" onClick={moreDetails}>
                    Details
                </Button>
            </div>
        </div>
    );
}

function QuickJobs() {
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

    const [quickJobList, setQuickJobList] = useState([]);

    async function getAllQuickJobs() {
        const result = await axios.get(GlobalData.baseUrl + '/api/get-all-quick-jobs', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setQuickJobList(result.data);
            console.log(result.data);
        }
    }

    useEffect(() => {
        getAllQuickJobs();
    }, []);

    return (
        <div className="container py-5">
            <h1>Quick Jobs</h1>
            <div className="jobs-container">
                {quickJobList ? quickJobList.map((quickJob, indx) => <JobCard key={indx} job={quickJob} />) : ''}
            </div>
        </div>
    );
}

export default userOnlyWrap(QuickJobs);
