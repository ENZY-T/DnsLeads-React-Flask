import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';

function JobCard({ job }) {
    const jobID = job.job_id;
    const history = useHistory();

    return (
        <div className="quick-job-card">
            <div className="inner">
                <h3 className="txt-theme">{job.job_name}</h3>
                <Button variant="contained" className="my-3" onClick={() => history.push(`/admin/quick-job-data/${jobID}`)}>
                    See Details
                </Button>
            </div>
        </div>
    );
}

function QuickJobsData() {
    const [allJobData, setAllJobData] = useState([]);
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
    async function getAllQuickJobs() {
        const result = await axios.get(GlobalData.baseUrl + '/api/admin/get-quick-jobs', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setAllJobData(result.data);
        }
    }
    useEffect(() => {
        getAllQuickJobs();
    }, []);
    return (
        <div>
            <h3>Quick Jobs Data</h3>
            <div className="quick-job-container">{allJobData ? allJobData.map((job, indx) => <JobCard key={indx} job={job} />) : ''}</div>
        </div>
    );
}

export default adminOnlyWrap(adminWrap(QuickJobsData));
