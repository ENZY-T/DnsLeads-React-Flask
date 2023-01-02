import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
	const [authState, setAuthState] = useState({ isLogged: true, loggedUser: null, accessToken: null });
	const [isError, setIsError] = useState(null);

	const setLogged = (user) => {
		setAuthState((prev) => ({ ...prev, isLogged: true, loggedUser: user }));
	};

	const setLoggedOut = () => {
		setAuthState((prev) => ({ ...prev, isLogged: false, loggedUser: null, accessToken: null }));
	};

	useEffect(() => {
		if (isError) {
			setTimeout(() => {
				setIsError(null);
			}, 1000);
		}
	}, [isError]);

	return (
		<AppContext.Provider value={{ authState, setAuthState, isError, setIsError, setLogged, setLoggedOut }}>
			{props.children}
		</AppContext.Provider>
	);
};
