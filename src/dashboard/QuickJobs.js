import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import { authToken } from '../allFuncs';
import { userOnlyWrap } from '../components/wraps';

export const quickJob = {
    id: '2a694fef-39fa-460f-9caf-ce9ff2889e71',
    topic: 'This is Job Title',
    date: '2022/11/25',
    time: '15:30',
    phr: '24',
    details:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae cupiditate quisquam veritatis id quidem blanditiis     accusantium sapiente veniam pariatur esse provident qui nulla, voluptate earum sint commodi numquam! Necessitatibus impedit     cupiditate quidem. Tempore unde quod aliquam ducimus magni deserunt ipsam eum est ut, numquam earum odit aut eveniet perferendis suscipit. Alias eos consequuntur minima quis mollitia repellendus aliquam, praesentium ut, molestiae quo assumenda placeat eius quisquam, ullam voluptatum! Odit aliquid quia id fugit veniam a architecto dignissimos modi neque laborum! Minus exercitationem eligendi asperiores consequatur praesentium aliquam consequuntur, eius voluptates nisi incidunt? Veritatis amet iste, animi fuga incidunt eaque quae?',
    location: (
        <iframe
            className="my-4"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10080.220071635733!2d138.550944177516!3d-35.00402248812222!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0da8273bf39c5%3A0xca0c1f147b50d354!2sMarion%20Hotel%20%26%20Cellars!5e0!3m2!1sen!2sau!4v1670128841151!5m2!1sen!2sau"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    ),
};

function JobCard({ job }) {
    const history = useHistory();
    const testID = uuidV4();
    const moreDetails = () => {
        history.push(`/quick-jobs/${testID}`);
    };
    return (
        <div className="job-card-container">
            <div className="job-card p-4">
                <h3>{job.topic}</h3>
                <div>
                    <CalendarMonthIcon /> <p>Date : {job.date}</p>
                </div>
                <div>
                    <ScheduleIcon /> <p>Time : {job.time}</p>
                </div>
                <div>
                    <PaidIcon /> <p>Per Hour : A${job.phr}.00</p>
                </div>
                <Button size="large" onClick={moreDetails}>
                    Details
                </Button>
            </div>
        </div>
    );
}

function QuickJobs() {
    return (
        <div className="container py-5">
            <h1>Quick Jobs</h1>
            <div className="jobs-container">
                <JobCard job={quickJob} />
                <JobCard job={quickJob} />
                <JobCard job={quickJob} />
                <JobCard job={quickJob} />
                <JobCard job={quickJob} />
            </div>
        </div>
    );
}

export default userOnlyWrap(QuickJobs);
