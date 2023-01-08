import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { getItemFromLocalStorage, localStoreKeys, removeItemFromLocalStorage } from '../allFuncs';
import { AppContext } from '../Context/AppContext';
import { GlobalData } from '../GlobalData';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const SecureAdminRoute = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const history = useHistory();
    const { setIsError, authState, setLogged, setLoggedOut } = useContext(AppContext);
    const tokenRef = useRef(authState.accessToken);

    useEffect(() => {
        if (!tokenRef.current) {
            tokenRef.current = getItemFromLocalStorage(localStoreKeys.authKey);
        }
        AuthenticateAccessToken();
    }, []);

    const AuthenticateAccessToken = async () => {
        await axios
            .get(GlobalData.baseUrl + '/api/user', {
                headers: {
                    Authorization: `Bearer ${tokenRef.current}`,
                },
            })
            .then((res) => handleSuccessAuth(res))
            .catch((error) => handleUnauthorized(error));
    };

    const handleSuccessAuth = (res) => {
        setIsAuthenticated(true);
        // console.log('from');
        // console.log(res.data);
        // console.log('from');
        setLogged(res.data);
    };

    const handleUnauthorized = (error) => {
        removeItemFromLocalStorage(localStoreKeys.authKey);
        setIsAuthenticated(false);
        setLoggedOut();
    };

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated) {
                    return <Component {...props} />;
                } else if (isAuthenticated === null) {
                    return (
                        <Box sx={{ display: 'flex', minHeight: '60vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    );
                } else {
                    return <Redirect to="/login" />;
                }
            }}
        ></Route>
    );
};

export default SecureAdminRoute;
