import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import PaidIcon from '@mui/icons-material/Paid';

import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { authToken } from '../allFuncs';

export const permanentJob = {
    id: '2d0b0064-90c0-42aa-82fb-8daa8c9a7a2e',
    topic: 'Job Topic',
    daysCount: '5',
    duration: '2',
    time: '22:30',
    phr: '24',
    details:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae cupiditate quisquam veritatis id quidem blanditiis accusantium sapiente veniam pariatur esse provident qui nulla, voluptate earum sint commodi numquam! Necessitatibus impedit cupiditate quidem. Tempore unde quod aliquam ducimus magni deserunt ipsam eum est ut, numquam earum odit aut eveniet perferendis suscipit. Alias eos consequuntur minima quis mollitia repellendus aliquam, praesentium ut, molestiae quo assumenda placeat eius quisquam, ullam voluptatum! Odit aliquid quia id fugit veniam a architecto dignissimos modi neque laborum! Minus exercitationem eligendi asperiores consequatur praesentium aliquam consequuntur, eius voluptates nisi incidunt? Veritatis amet iste, animi fuga incidunt eaque quae?',
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
    daysToWork: [
        {
            time: '07:00-08:00',
            days: ['Mo', 'Tu', 'We', 'Th', 'Fr', '', ''],
        },
        {
            time: '14:30-15:30',
            days: ['', '', '', '', '', 'Sa', 'Su'],
        },
    ],
};

function JobCard({ job }) {
    const history = useHistory();
    const testID = uuidV4();
    const goToJob = () => {
        history.push(`/permanent-jobs/${testID}`);
    };

    return (
        <div className="job-card-container">
            <div className="job-card p-4">
                <h3 className="txt-theme">{job.topic}</h3>
                <div>
                    <CalendarMonthIcon /> <p>{job.daysCount} days for a week</p>
                </div>
                <div>
                    <ScheduleIcon /> <p>Duration : {job.duration}hr</p>
                </div>
                <div>
                    <FlagIcon /> <p>Start Time : {job.time}</p>
                </div>
                <div>
                    <PaidIcon /> <p>A${job.phr}.00/hr</p>
                </div>
                <Button variant="contained" className="my-3" onClick={() => goToJob()}>
                    See Details
                </Button>
            </div>
        </div>
    );
}

function PermanentJobs() {
    const history = useHistory();
    useEffect(() => {
        authToken(history);
    }, []);
    return (
        <div className="permanent-jobs container py-5">
            <h1>Permanent Jobs</h1>
            <div className="jobs-container">
                <JobCard job={permanentJob} />
                <JobCard job={permanentJob} />
                <JobCard job={permanentJob} />
                <JobCard job={permanentJob} />
                <JobCard job={permanentJob} />
            </div>
        </div>
    );
}

export default PermanentJobs;
