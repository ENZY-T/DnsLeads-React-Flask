import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { getItemFromLocalStorage, localStoreKeys, removeItemFromLocalStorage } from '../allFuncs';
import { AppContext } from '../Context/AppContext';

const SecureRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const history = useHistory();
	const { setIsError } = useContext(AppContext);

	useEffect(() => {
		const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
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
				.then((res) => {
					// console.log(response);
				})
				.catch((error) => {
					history.push('/login');
					removeItemFromLocalStorage(localStoreKeys.authKey);
				});
		} else {
			setIsError('Please Login...');
			history.push('/login');
		}
	}, []);
	return (
		<Route
			{...rest}
			render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)}
		></Route>
	);
};

export default SecureRoute;
