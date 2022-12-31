import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

export const adminHomeData = [
    ['ID', 'Date', 'Done By', 'Job Place', 'Duration', 'Pay to Sub-Con.'],
    ['0', '2022-12-26', 'Kavindu Harshitha', 'Garden Island', '1hr', 'A$25.00'],
    ['1', '2022-12-26', 'Kavindu Harshitha', 'Cafe Buongiorno', '1hr 45min', 'A$42.00'],
    ['2', '2022-12-27', 'Kavindu Harshitha', 'Garden Island', '1hr', 'A$25.00'],
    ['3', '2022-12-27', 'Kavindu Harshitha', 'Cafe Buongiorno', '1hr 45min', 'A$42.00'],
];
{
    /* <GenTable tableData={adminHomeData} /> */
}

function JobCard({ jobID, jobTitle }) {
    const history = useHistory();
    function goTo() {
        history.push(`/admin/jobs/${jobID}`);
    }
    return (
        <div className="job-card">
            <div className="inner-card p-3" onClick={goTo}>
                <h3>{jobTitle}</h3>
            </div>
        </div>
    );
}

// Job places data
function AdminHome() {
    return (
        <div className="all-jobs-cards-container py-3">
            <JobCard jobID={'216384'} jobTitle="Job 1" />
            <JobCard jobID={'215584'} jobTitle="Job 2" />
            <JobCard jobID={'295584'} jobTitle="Job 3" />
            <JobCard jobID={'266384'} jobTitle="Job 4" />
            <JobCard jobID={'216334'} jobTitle="Job 5" />
            <JobCard jobID={'212234'} jobTitle="Job 6" />
        </div>
    );
}

export default adminWrap(AdminHome);
