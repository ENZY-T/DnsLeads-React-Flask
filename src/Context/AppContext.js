import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
	const [authState, setAuthState] = useState({ isLogged: false });

	return <AppContext.Provider value={{ authState, setAuthState }}>{props.children}</AppContext.Provider>;
};
