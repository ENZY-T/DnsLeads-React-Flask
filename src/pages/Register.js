import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bankList } from '../GlobalData';
import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

function UploadBox({ label, name }) {
	const [filename, setFilename] = useState('Upload types : .jpg, .jpeg, .png, .pdf');

	const showFileName = (e) => {
		setFilename(e.target.files[0].name);
	};

	return (
		<div className='upload-document-box'>
			<label htmlFor={name} className='upload-label'>
				{label}
			</label>
			<input
				type='file'
				required={true}
				className='input-file'
				id={name}
				accept='.jpg, .jpeg, .png, .pdf'
				name={name}
				onChange={showFileName}
			/>
			<small>
				<i>{filename}</i>
			</small>
		</div>
	);
}

let testusers = [
	{
		id: uuid4(),
		name: 'kavindu',
		address: 'test address',
		zip_code: '5092',
		contact_no: '0451570655',
		email: 'test5@email.com',
		abn: 'test ABN number 5',
		passport_number: 'N9070656',
		bank_name: 'commonwealth',
		account_type: 'saving account',
		account_name: 'kavindu harshitha',
		account_number: '64649505540',
		bsb: '065000',
		address_proof_img: 'img/path',
		passport_img: 'img/path',
		police_check_img: 'img/path',
		children_check_img: 'img/path',
		agreement_img: 'img/path',
		verified: 'True',
		password: 'asdf1234',
	},
	{
		id: uuid4(),
		name: 'kavindu harshitha',
		address: 'test address',
		zip_code: '5092',
		contact_no: '0451570615',
		email: 'test1@email.com',
		abn: 'test ABN number 8',
		passport_number: 'N9070681',
		bank_name: 'commonwealth',
		account_type: 'saving account',
		account_name: 'kavindu harshitha',
		account_number: '64649805541',
		bsb: '065000',
		address_proof_img: 'img/path',
		passport_img: 'img/path',
		police_check_img: 'img/path',
		children_check_img: 'img/path',
		agreement_img: 'img/path',
		verified: 'True',
		password: 'asdf1234',
	},
	{
		id: uuid4(),
		name: 'kavindu boss',
		address: 'test address',
		zip_code: '5092',
		contact_no: '0451570625',
		email: 'test2@email.com',
		abn: 'test ABN number 9',
		passport_number: 'N9070626',
		bank_name: 'commonwealth',
		account_type: 'saving account',
		account_name: 'kavindu harshitha',
		account_number: '64649805542',
		bsb: '065000',
		address_proof_img: 'img/path',
		passport_img: 'img/path',
		police_check_img: 'img/path',
		children_check_img: 'img/path',
		agreement_img: 'img/path',
		verified: 'True',
		password: 'asdf1234',
	},
];

function Register() {
	const [selectedBank, setBank] = useState('');
	const [selectedAccType, setAccType] = useState('');

	const registerHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		for (let x = 0; x < 19; x++) {
			let obj = e.target[x];
			if (
				obj.name === 'address_proof_img' ||
				obj.name === 'passport_img' ||
				obj.name === 'police_check_img' ||
				obj.name === 'children_check_img' ||
				obj.name === 'agreement_img'
			) {
				formData.append(obj.name, obj.files[0]);
				console.log(obj.files[0]);
			} else {
				formData.append(obj.name, obj.value);
			}
		}
		console.log(formData);
		const result = await axios.post('/api/auth/register', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		console.log(result);
	};

	return (
		<div className='register-page'>
			<div className='container'>
				<div className='register-container'>
					<div className='register-card py-5'>
						<h1 className='text-center mb-3 display-6'>REGISTER</h1>
						<div className='register-form px-4'>
							<h4>User Details</h4>
							<hr />
							<form onSubmit={registerHandler}>
								<div className='row'>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='Full Name'
											name='name'
										/>
									</div>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='Email'
											name='email'
										/>
									</div>
								</div>
								<TextField
									size='small'
									required={true}
									className='w-100 my-2'
									variant='filled'
									label='Address'
									name='address'
								/>
								<div className='row'>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='Zip Code'
											name='zip_code'
										/>
									</div>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='Contact Number'
											name='contact_no'
										/>
									</div>
								</div>
								<div className='row'>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='ABN Number'
											name='abn'
										/>
									</div>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											variant='filled'
											label='Passport Number'
											name='passport_number'
										/>
									</div>
								</div>

								<h4 className='mt-5'>Bank Details</h4>
								<hr />
								<div className='row'>
									<div className='col'>
										<FormControl variant='filled' className='w-100 my-2'>
											<InputLabel id='select-bank'>Select Bank</InputLabel>
											<Select
												labelId='select-bank'
												id='demo-simple-select-filled'
												value={selectedBank}
												onChange={(e) => setBank(e.target.value)}
												name='bank_name'
												required={true}
											>
												<MenuItem value=''>
													<em>Select Bank</em>
												</MenuItem>
												{bankList.map((bank, index) => (
													<MenuItem value={bank} key={index}>
														{bank}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</div>
									<div className='col'>
										<FormControl variant='filled' className='w-100 my-2'>
											<InputLabel id='bank-account-type'>Account Type</InputLabel>
											<Select
												labelId='bank-account-type'
												id='demo-simple-select-filled'
												value={selectedAccType}
												onChange={(e) => setAccType(e.target.value)}
												name='account_type'
												required={true}
											>
												<MenuItem value=''>
													<em>Select Account Type</em>
												</MenuItem>
												<MenuItem value={'Savings account'}>{'Savings account'}</MenuItem>
												<MenuItem value={'Trust account'}>{'Trust account'}</MenuItem>
											</Select>
										</FormControl>
									</div>
								</div>

								<TextField
									size='small'
									required={true}
									className='w-100 my-2'
									variant='filled'
									label='Account Name'
									name='account_name'
								/>
								<TextField
									size='small'
									required={true}
									className='w-100 my-2'
									type='number'
									variant='filled'
									label='Account Number'
									name='account_number'
								/>
								<TextField
									size='small'
									required={true}
									className='w-100 my-2'
									type='number'
									variant='filled'
									label='BSB Number'
									name='bsb'
								/>
								<div className='row'>
									<div className='col'>
										<TextField
											size='small'
											required={true}
											className='w-100 my-2'
											type='password'
											variant='filled'
											label='Password'
											name='password'
										/>
									</div>
									<div className='col'>
										<TextField
											size='small'
											className='w-100 my-2'
											type='password'
											variant='filled'
											label='Confirm Password'
											name='password_confirm'
											required={true}
										/>
									</div>
								</div>

								<hr />
								<div className='upload-document-container'>
									<UploadBox label={'Upload Passport Image'} name={'passport_img'} />
									<UploadBox label={'Upload Address proof document'} name={'address_proof_img'} />
									<UploadBox label={'Upload police check'} name={'police_check_img'} />
									<UploadBox label={'Upload children check'} name={'children_check_img'} />
									<UploadBox label={'Upload signed contract agreement'} name={'agreement_img'} />
								</div>
								<div className='d-flex justify-content-center'>
									<Button variant='contained' className='my-4 rounded-0 px-4 bg-theme' type='submit'>
										Register
									</Button>
								</div>
							</form>
							<div className='d-flex justify-content-center'>
								<p>
									Already have an account? <Link to='/login'>Login</Link>{' '}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
