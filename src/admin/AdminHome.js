import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';

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

	const [reqCount, setReqCount] = useState(0);

	async function getReqCount() {
		const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
		const result = await axios.post(
			GlobalData.baseUrl + '/api/admin/get-req-count',
			{ job_id: jobID },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		if (result.status === 200) {
			// console.log(result.data);
			setReqCount(result.data);
		}
	}

	useEffect(() => {
		getReqCount();
	}, []);

	return (
		<div className='job-card'>
			<div className='inner-card p-3' onClick={goTo}>
				<h3>{jobTitle}</h3>
				{reqCount > 0 ? (
					<h6 className='txt-red'>
						<b>Job Requests {reqCount}</b>
					</h6>
				) : (
					''
				)}
			</div>
		</div>
	);
}

async function get_all_jobs(setLoadingJobs, setAllJobs) {
	const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
	const result = await axios.get(GlobalData.baseUrl + '/api/admin/get-permanent-jobs', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	if (result.status === 200) {
		setAllJobs(result.data);
		setLoadingJobs(false);
	}
	return [];
}

// Job places data
function AdminHome() {
	const [allJobs, setAllJobs] = useState([]);
	const [loadingJobs, setLoadingJobs] = useState(true);

	useEffect(() => {
		get_all_jobs(setLoadingJobs, setAllJobs);
	}, []);

	return (
		<div className='all-jobs-cards-container py-3'>
			{loadingJobs ? '' : allJobs.map((job, indx) => <JobCard key={indx} jobID={job.job_id} jobTitle={job.job_name} />)}
		</div>
	);
}

export default adminOnlyWrap(adminWrap(AdminHome));
