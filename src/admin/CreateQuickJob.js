import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useRef } from 'react';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';

function CreateQuickJob() {
    const formRef = useRef();
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

    async function createQuickJob(e) {
        e.preventDefault();
        const formdata = new FormData(formRef.current);
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/create-quick-job', formdata, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(result);
        alert(result.data.msg);
    }
    return (
        <div>
            <h3>Create Quick Job</h3>
            <form onSubmit={createQuickJob} ref={formRef}>
                <TextField required variant="outlined" className="w-100 my-3" label="Job Title" name="job_title" />
                <TextField required variant="outlined" className="w-100 my-3" label="Job Address" name="job_address" />
                <TextField
                    required
                    variant="outlined"
                    className="w-100 my-3"
                    label="Sub-Contractors Count for Job"
                    name="c_count_for_job"
                    type="number"
                />
                <TextField
                    required
                    variant="outlined"
                    className="w-100 my-3"
                    label="Pay for Hr for me"
                    name="pay_per_hr_for_me"
                    type="number"
                />
                <TextField
                    required
                    variant="outlined"
                    className="w-100 my-3"
                    label="Pay for Hr for Sub-Contractor"
                    name="pay_per_hr_for_c"
                    type="number"
                />
                <div className="d-flex">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h6>Job Date</h6>
                        <TextField required variant="outlined" className="my-1 w-100" name="job_date" type="date" />
                    </div>
                    <span style={{ width: '5px' }}></span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h6>Job Start Time</h6>
                        <TextField required variant="outlined" className="my-1 w-100" name="job_time" type="time" />
                    </div>
                </div>
                <TextField required variant="outlined" className="w-100 my-3" label="Job Description" name="job_desc" />
                <Button className="my-3" size="large" variant="contained" type="submit">
                    Create Quick Job
                </Button>
            </form>
        </div>
    );
}

export default adminOnlyWrap(adminWrap(CreateQuickJob));
