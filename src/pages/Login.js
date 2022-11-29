import { TextField, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="login-page">
            <div className="container">
                <div className="login-card-container">
                    <div className="login-card py-4 px-4">
                        <h1 className="text-center my-4">Login</h1>
                        <TextField className="w-100 my-3" label="EMAIL" variant="filled" />
                        <br />
                        <TextField className="w-100 my-3" label="PASSWORD" variant="filled" />
                        <Button className="my-3 bg-theme w-100" variant="contained">
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
