import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { adminOnlyWrap } from '../components/wraps';
import { GlobalData } from '../GlobalData';
import { adminWrap } from './component/adminWrap';

function ShowDocument({ srcLink = '', imgName }) {
	let split_to_arr = srcLink.split('.');
	const extenssion = split_to_arr[split_to_arr.length - 1];
	return (
		<div>
			<h4>{imgName}</h4>
			{extenssion === 'pdf' ? (
				<a href={`${GlobalData.baseUrl}/${srcLink}`} target='_blank'>
					{imgName} is PDF Document Click here to Open
				</a>
			) : (
				<iframe src={`${GlobalData.baseUrl}/${srcLink}`} download='false' width='100%' style={{ height: '100vh' }}></iframe>
				// <img src={srcLink} alt='Pic' style={{ height: '100vh' }} />
			)}
		</div>
	);
}

function ApproveOrDisprove({ verified, userID, setData, data }) {
	const verifySubContractor = async (method) => {
		const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
		const result = await axios.post(
			GlobalData.baseUrl + '/api/admin/verify-user',
			{ id: userID, method: method },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		if (result.status === 200) {
			if (result.data === 'approve') {
				setData({ ...data, verified: 'true' });
			} else if (result.data === 'disprove') {
				setData({ ...data, verified: 'false' });
			}

			alert(result.data);
		}
	};

	return (
		<div>
			{verified ? (
				<div>
					<h3>
						Verified status :
						{verified === 'false' ? (
							<span className='txt-red'> Not Verified</span>
						) : (
							<span className='txt-green'> Verified</span>
						)}
					</h3>
					<div className='d-flex py-3'>
						{verified === 'true' ? (
							<Button
								variant='contained'
								color='error'
								className='mx-4'
								onClick={() => verifySubContractor('disprove')}
							>
								Disprove the Sub-Contractor
							</Button>
						) : (
							<Button
								variant='contained'
								color='success'
								className='mx-4'
								onClick={() => verifySubContractor('approve')}
							>
								Verify the Sub-Contractor
							</Button>
						)}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

function SubContractorPage({ data, setData, userID }) {
	const history = useHistory();
	async function removeSubContractor() {
		if (window.confirm('Do you wan to delete this sub-contractor?') === true) {
			const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
			const result = await axios.get(GlobalData.baseUrl + `/api/admin/remove-subcontractor/${userID}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (result.status === 200) {
				history.push('/admin/sub-contractors');
			}
		}
	}

	return (
		<div>
			<ApproveOrDisprove setData={setData} verified={data.verified} userID={userID} data={data} />
			<h2 style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				Sub-Contractor Details
				<Button variant='contained' color='error' onClick={removeSubContractor}>
					Remove Sub-Contractor
				</Button>
			</h2>
			<hr />

			<h5>
				<b>Name : </b>
				{data.name}
			</h5>
			<h5>
				<b>Email : </b>{' '}
				<a href={`mailto:${data.email}`} target='_blank'>
					{data.email}
				</a>{' '}
			</h5>
			<h5>
				<b>Address : </b>
				{data.address}, {data.zip_code}
			</h5>
			<h5>
				<b>Contract No : </b>
				{data.contact_no}
			</h5>
			<h5>
				<b>ABN No : </b>
				{data.abn}
			</h5>
			<h5>
				<b>Passport No : </b>
				{data.passport_number}
			</h5>
			<h2 className='mt-4'>Bank Details</h2>
			<hr />
			<h5>
				<b>Bank : </b>
				{data.bank_name}
			</h5>
			<h5>
				<b>Acc Type : </b>
				{data.account_type}
			</h5>
			<h5>
				<b>Acc Name : </b>
				{data.account_name}
			</h5>
			<h5>
				<b>Acc Number : </b>
				{data.account_number}
			</h5>
			<h5>
				<b>BSB No : </b>
				{data.bsb}
			</h5>
			<h2 className='mt-4'>Documents</h2>
			<hr />
			<ShowDocument srcLink={data.agreement_img} imgName='Agreement' />
			<ShowDocument srcLink={data.address_proof_img} imgName='Address Proof' />
			<ShowDocument srcLink={data.children_check_img} imgName='Children check' />
			<ShowDocument srcLink={data.passport_img} imgName='Passport' />
			<ShowDocument srcLink={data.police_check_img} imgName='Police check' />
		</div>
	);
}

function SubContractor(props) {
	const useID = props.match.params.userID;

	const [subContractor, setSubContractor] = useState({});

	async function getContractor() {
		const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
		const result = await axios.get(GlobalData.baseUrl + `/api/admin/get-contractor/${useID}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (result.status === 200) {
			setSubContractor(result.data);
		}
	}

	useEffect(() => {
		getContractor();
	}, []);

	return (
		<div>
			{subContractor ? (
				<SubContractorPage data={subContractor} setData={setSubContractor} userID={useID} />
			) : (
				<h5>Loading...</h5>
			)}
		</div>
	);
}

export default adminOnlyWrap(adminWrap(SubContractor));
