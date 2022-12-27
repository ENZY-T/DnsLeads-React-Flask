import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
	const [authState, setAuthState] = useState({ isLogged: true });
	const [isError, setIsError] = useState(null);

	useEffect(() => {
		if (isError) {
			setTimeout(() => {
				setIsError(null);
			}, 1000);
		}
	}, [isError]);

	return (
		<AppContext.Provider value={{ authState, setAuthState, isError, setIsError }}>{props.children}</AppContext.Provider>
	);
};
