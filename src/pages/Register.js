import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bankList } from '../GlobalData';
import axios from 'axios';

function UploadBox({ label, name }) {
    const [filename, setFilename] = useState('Upload types : .jpg, .jpeg, .png, .pdf');

    const showFileName = (e) => {
        setFilename(e.target.files[0].name);
    };

    return (
        <div className="upload-document-box">
            <label htmlFor={name} className="upload-label">
                {label}
            </label>
            <input type="file" className="input-file" id={name} accept=".jpg, .jpeg, .png, .pdf" name={name} onChange={showFileName} />
            <small>
                <i>{filename}</i>
            </small>
        </div>
    );
}

function Register() {
    const [selectedBank, setBank] = useState('');
    const [selectedAccType, setAccType] = useState('');

    const registerHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let x = 0; x < 19; x++) {
            let obj = e.target[x];
            if (
                obj.name === 'address_proof_img' ||
                obj.name === 'passport_img' ||
                obj.name === 'police_check_img' ||
                obj.name === 'children_check_img' ||
                obj.name === 'agreement_img'
            ) {
                formData.append(obj.name, obj.files[0]);
            } else {
                formData.append(obj.name, obj.value);
            }
        }
        const result = await axios.post('/api/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        console.log(result);
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-container">
                    <div className="register-card py-5">
                        <h1 className="text-center mb-3">Register</h1>
                        <div className="register-form px-4">
                            <h4>User Details</h4>
                            <hr />
                            <form onSubmit={registerHandler}>
                                <TextField className="w-100 my-2" variant="filled" label="Full Name" name="name" />
                                <TextField className="w-100 my-2" variant="filled" label="Address" name="address" />
                                <TextField className="w-100 my-2" variant="filled" label="Zip Code" name="zip_code" />
                                <TextField className="w-100 my-2" variant="filled" label="Contact Number" name="contact_no" />
                                <TextField className="w-100 my-2" variant="filled" label="Email" name="email" />
                                <TextField className="w-100 my-2" variant="filled" label="ABN Number" name="abn" />
                                <TextField className="w-100 my-2" variant="filled" label="Passport Number" name="passport_number" />
                                <h4 className="mt-5">Bank Details</h4>
                                <hr />
                                <FormControl variant="filled" className="w-100 my-2">
                                    <InputLabel id="select-bank">Select Bank</InputLabel>
                                    <Select
                                        labelId="select-bank"
                                        id="demo-simple-select-filled"
                                        value={selectedBank}
                                        onChange={(e) => setBank(e.target.value)}
                                        name="bank_name"
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
                                        name="account_type"
                                    >
                                        <MenuItem value="">
                                            <em>Select Account Type</em>
                                        </MenuItem>
                                        <MenuItem value={'Savings account'}>{'Savings account'}</MenuItem>
                                        <MenuItem value={'Trust account'}>{'Trust account'}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField className="w-100 my-2" variant="filled" label="Account Name" name="account_name" />
                                <TextField
                                    className="w-100 my-2"
                                    type="number"
                                    variant="filled"
                                    label="Account Number"
                                    name="account-number"
                                />
                                <TextField className="w-100 my-2" type="number" variant="filled" label="BSB Number" name="bsb" />
                                <TextField className="w-100 my-2" type="password" variant="filled" label="Password" name="password" />
                                <TextField
                                    className="w-100 my-2"
                                    type="password"
                                    variant="filled"
                                    label="Confirm Password"
                                    name="password_confirm"
                                />
                                <div className="upload-document-container">
                                    <UploadBox label={'Upload Passport Image'} name={'passport_img'} />
                                    <UploadBox label={'Upload Address proof document'} name={'address_proof_img'} />
                                    <UploadBox label={'Upload police check'} name={'police_check_img'} />
                                    <UploadBox label={'Upload children check'} name={'children_check_img'} />
                                    <UploadBox label={'Upload signed contract agreement'} name={'agreement_img'} />
                                </div>
                                <Button variant="contained" className="w-100 my-4 bg-theme" type="submit">
                                    Register
                                </Button>
                            </form>
                            <p>
                                Already have an account? <Link to="/login">Login</Link>{' '}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
