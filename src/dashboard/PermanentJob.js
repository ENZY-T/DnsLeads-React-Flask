import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TimeTable } from './MyJob';
import { Button } from '@mui/material';
import { permanentJob } from './PermanentJobs';
import { authToken } from '../allFuncs';

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
	const goBack = () => {
		history.goBack();
	};

	return (
		<div className='container py-5'>
			<span className='go-back' onClick={goBack}>
				<ArrowBackIcon /> Go Back
			</span>
			<h1 className='my-4'>{permanentJob.topic}</h1>
			<h4>Time Duration : {permanentJob.duration}hr</h4>
			<h4>Start Time : {permanentJob.time}</h4>
			<h4>Per hour : A${permanentJob.phr}.00</h4>
			<TimeTable daysToWork={daysToWork} />
			<h4>Job Details</h4>
			<p>{permanentJob.details}</p>
			{permanentJob.location}
			<Button variant='contained' size='medium'>
				Enroll for Job
			</Button>
		</div>
	);
}

export default PermanentJob;
