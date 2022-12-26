import { TextField, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { setItemToLocalStorage, localStoreKeys, getItemFromLocalStorage, removeItemFromLocalStorage } from '../allFuncs';

function Login({ loginState, setLoginState }) {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const history = useHistory();

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
                }
            )
            .then((response) => {
                userID = response.data;
                history.push('/dashboard');
            })
            .catch((error) => {
                removeItemFromLocalStorage(localStoreKeys.authKey);
            });
    }

function Login() {
    const getfromBackend = async () => {
        const result = await axios.get('/api/auth/login');
        console.log(result);
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="login-card-container">
                    <div className="login-card py-4 px-4">
                        <h1 className="text-center my-4">Login</h1>
                        <TextField className="w-100 my-3" label="EMAIL" variant="filled" />
                        <br />
                        <TextField className="w-100 my-3" label="PASSWORD" variant="filled" />
                        <Button className="my-3 bg-theme w-100" variant="contained" onClick={getfromBackend}>
                            Login
                        </Button>
                        <p className="my-3">
                            Don't you have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
