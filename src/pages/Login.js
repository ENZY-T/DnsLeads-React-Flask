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
	const { setIsError, setLogged, setLoggedOut, setAuthState } = useContext(AppContext);
	const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);

	const handleAlreadyLoggedIn = (response) => {
		setLogged(response.data.user);
		history.push('/dashboard');
	};

	useEffect(() => {
		if (accessToken) {
			axios
				.get(GlobalData.baseUrl + '/api/user', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => handleAlreadyLoggedIn(response))
				.catch((error) => {
					removeItemFromLocalStorage(localStoreKeys.authKey);
				});
		}
	}, []);

	//#region Handles
	const handleLoginSuccess = (result) => {
		if (result.data.access_token) {
			setItemToLocalStorage(localStoreKeys.authKey, result.data.access_token);
			setLogged(result.data.user);
			setAuthState((prev) => ({
				...prev,
				accessToken: result.data.access_token,
			}));
			if (result.data.user.role === 'admin') {
				history.push('/admin');
			} else {
				history.push('/dashboard');
			}
		}
	};

	const handleLoginError = (error) => {
		setIsError(error.response.data);
		setLoggedOut();
	};

	const handleLogin = async () => {
		if (email !== '' && pw !== '') {
			axios
				.post(GlobalData.baseUrl + '/api/auth/login', { email: email, password: pw })
				.then((result) => handleLoginSuccess(result))
				.catch((error) => handleLoginError(error));
		}
	};

	//#endregion

	return (
		<div className='login-page'>
			<div className='container'>
				<div className='login-card-container'>
					<div className='login-card py-4 px-4'>
						<h2 className='text-center my-4'>Sub-Contractor Login</h2>
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
