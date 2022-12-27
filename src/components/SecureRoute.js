import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';

const SecureRoute = ({ component: Component, ...rest }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		axios.post();
	}, []);
	return (
		<Route
			{...rest}
			render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)}
		></Route>
	);
};

export default SecureRoute;
