import { TextField, Button } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
	setItemToLocalStorage,
	localStoreKeys,
	getItemFromLocalStorage,
	removeItemFromLocalStorage,
} from '../allFuncs';
import { AppContext } from '../Context/AppContext';
import { GlobalData } from '../GlobalData';

function Login() {
	const [email, setEmail] = useState('');
	const [pw, setPw] = useState('');
	const history = useHistory();
	const { setIsError } = useContext(AppContext);
	const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

	let userID = undefined;
	if (accessToken) {
		axios
			.post(
				'/api/auth/authorization-token',
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			)
			.then((response) => {
				userID = response.data;
				history.push('/dashboard');
			})
			.catch((error) => {
				removeItemFromLocalStorage(localStoreKeys.authKey);
			});
	}
	const handleLogin = async () => {
		if (email !== '' && pw !== '') {
			axios
				.post(GlobalData.baseUrl + '/api/auth/login', { email: email, password: pw })
				.then((result) => {
					if (result.data.access_token) {
						setItemToLocalStorage(localStoreKeys.authKey, result.data.access_token);
						history.push('/dashboard');
					}
				})
				.catch((err) => {
					setIsError(err.response.data);
				});
		}
	};

	return (
		<div className='login-page'>
			<div className='container'>
				<div className='login-card-container'>
					<div className='login-card py-4 px-4'>
						<h1 className='text-center my-4'>Login</h1>
						<TextField
							className='w-100 my-3'
							label='EMAIL'
							type='email'
							variant='filled'
							onChange={(e) => setEmail(e.target.value)}
						/>
						<br />
						<TextField
							className='w-100 my-3'
							label='PASSWORD'
							type='password'
							variant='filled'
							onChange={(e) => setPw(e.target.value)}
						/>
						<Button className='my-3 bg-theme w-100' variant='contained' onClick={handleLogin}>
							Login
						</Button>
						<p className='my-3'>
							Don't you have an account? <Link to='/register'>Register</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
