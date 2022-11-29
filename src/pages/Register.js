import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { bankList } from '../GlobalData';

function Register() {
    const [selectedBank, setBank] = useState('');
    const [selectedAccType, setAccType] = useState('');

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-container">
                    <div className="register-card py-5">
                        <h1 className="text-center mb-3">Register</h1>
                        <div className="register-form px-4">
                            <h4>User Details</h4>
                            <hr />
                            <TextField className="w-100 my-2" variant="filled" label="Full Name" />
                            <TextField className="w-100 my-2" variant="filled" label="Address" />
                            <TextField className="w-100 my-2" variant="filled" label="Zip Code" />
                            <TextField className="w-100 my-2" variant="filled" label="Contact Number" />
                            <TextField className="w-100 my-2" variant="filled" label="Email" />
                            <TextField className="w-100 my-2" variant="filled" label="ABN Number" />
                            <TextField className="w-100 my-2" variant="filled" label="Passport Number" />
                            <div className="upload-document-container">
                                <div className="upload-document-box">
                                    <label htmlFor="passport-upload" className="upload-label">
                                        Upload Passport Image
                                    </label>
                                    <input type="file" className="input-file" id="passport-upload" accept=".jpg, .jpeg, .png, .pdf" />
                                    <small>
                                        <i>Upload types : .jpg, .jpeg, .png, .pdf</i>
                                    </small>
                                </div>
                                <div className="upload-document-box">
                                    <label htmlFor="adress-proof-upload" className="upload-label">
                                        Upload Address proof document
                                    </label>
                                    <input type="file" className="input-file" id="adress-proof-upload" accept=".jpg, .jpeg, .png, .pdf" />
                                    <small>
                                        <i>Upload types .jpg, .jpeg, .png, .pdf</i>
                                    </small>
                                </div>
                            </div>
                            <h4 className="mt-5">Bank Details</h4>
                            <hr />
                            <FormControl variant="filled" className="w-100 my-2">
                                <InputLabel id="select-bank">Select Bank</InputLabel>
                                <Select
                                    labelId="select-bank"
                                    id="demo-simple-select-filled"
                                    value={selectedBank}
                                    onChange={(e) => setBank(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select Bank</em>
                                    </MenuItem>
                                    {bankList.map((bank, index) => (
                                        <MenuItem value={bank} key={index}>
                                            {bank}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="filled" className="w-100 my-2">
                                <InputLabel id="bank-account-type">Account Type</InputLabel>
                                <Select
                                    labelId="bank-account-type"
                                    id="demo-simple-select-filled"
                                    value={selectedAccType}
                                    onChange={(e) => setAccType(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select Account Type</em>
                                    </MenuItem>
                                    <MenuItem value={'Savings account'}>{'Savings account'}</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField className="w-100 my-2" variant="filled" label="Account Name" />
                            <TextField className="w-100 my-2" type="number" variant="filled" label="Account Number" />
                            <TextField className="w-100 my-2" type="number" variant="filled" label="BSB Number" />
                            <Button variant="contained" className="w-100 mt-4">
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
