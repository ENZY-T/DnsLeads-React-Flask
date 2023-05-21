import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';

function SubContractorCard({ user }) {
	const history = useHistory();
	const redirectToDetails = () => {
		history.push(`/admin/sub-contractors/${user.id}`);
	};
	return (
		<div className='sub-contractor-card'>
			<div className='inner' onClick={redirectToDetails}>
				<h4>{user.name}</h4>
			</div>
		</div>
	);
}

function SubContractors() {
	const [allSubContractors, setAllSubContractors] = useState([]);

	async function getAllSubContractors() {
		const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
		const result = await axios.get(GlobalData.baseUrl + '/api/admin/get-all-sub-contractors', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (result.status === 200) {
			setAllSubContractors(result.data);
		}
	}

	useEffect(() => {
		getAllSubContractors();
	}, []);

	return (
		<div className='sub-contractors'>
			{allSubContractors ? (
				allSubContractors.map((sc, indx) => <SubContractorCard key={indx} user={sc} />)
			) : (
				<h3>No sub-contractors has registered</h3>
			)}
		</div>
	);
}

export default adminOnlyWrap(adminWrap(SubContractors));
