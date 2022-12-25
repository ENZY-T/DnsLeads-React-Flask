import { TextField, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
	const getFromBackend = async () => {
		const result = await axios.get('/api/auth/login');
		console.log(result);
	};

	return (
		<div className='login-page'>
			<div className='container'>
				<div className='login-card-container'>
					<div className='login-card py-4 px-5'>
						<h1 className='text-center display-6 mt-4'>Log In</h1>
						<hr />
						<div>
							<TextField className='w-100 my-3' label='EMAIL' variant='filled' size='small' />
							<TextField className='w-100 my-3' label='PASSWORD' variant='filled' size='small' />
						</div>
						<div className='d-flex justify-content-center'>
							<Button className='my-3 bg-theme px-4 rounded-0' variant='contained' onClick={getFromBackend}>
								LOGIN
							</Button>
						</div>
						<p className='my-3'>
							Don't you have an account?{' '}
							<Link to='/register' className='text-decoration-none'>
								REGISTER
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
