import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext } from 'react';
import { useRef } from 'react';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { userOnlyWrap } from '../components/wraps';
import { AppContext } from '../Context/AppContext';
import { GlobalData } from '../GlobalData';

function Account() {
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);
    const { authState } = useContext(AppContext);
    console.log(authState.loggedUser);

    const pwchangeref = useRef();

    async function passwordChangeHandle(e) {
        e.preventDefault();
        if (window.confirm('Do you realy want to change the password?') === true) {
            const pwChange = new FormData(pwchangeref.current);
            pwChange.append('user_id', authState.loggedUser.id);
            const result = await axios.post(GlobalData.baseUrl + '/api/change-pw', pwChange, {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            });
            if (result.status === 200) {
                alert(result.data.msg);
                pwchangeref.current.reset();
            }
        }
    }

    return (
        <div className="container py-5 px-4">
            {authState ? (
                <div>
                    <h4>Sub-Contractor Details</h4>
                    <hr />
                    <h5>
                        <b>Name</b> : {authState.loggedUser.name}
                    </h5>
                    <h5>
                        <b>Email</b> : {authState.loggedUser.email}
                    </h5>
                    <h5>
                        <b>Address</b> : {authState.loggedUser.address}
                    </h5>
                    <h5>
                        <b>Zip Code</b> : {authState.loggedUser.zip_code}
                    </h5>
                    <h5>
                        <b>Contact Number</b> : {authState.loggedUser.contact_no}
                    </h5>
                    <h5>
                        <b>ABN Number</b> : {authState.loggedUser.abn}
                    </h5>
                    <h5>
                        <b>Passport Number</b> : {authState.loggedUser.passport_number}
                    </h5>
                    {/* ######################################################### */}
                    <h4 className="mt-5">Bank Details</h4>
                    <hr />
                    <h5>
                        <b>Bank</b> : {authState.loggedUser.bank_name}
                    </h5>
                    <h5>
                        <b>Account Type</b> : {authState.loggedUser.account_type}
                    </h5>
                    <h5>
                        <b>Account Name</b> : {authState.loggedUser.account_name}
                    </h5>
                    <h5>
                        <b>Account Number</b> : {authState.loggedUser.account_number}
                    </h5>
                    <h5>
                        <b>BSB Number</b> : {authState.loggedUser.bsb}
                    </h5>

                    <h4 className="mt-5">Change Password</h4>
                    <hr />
                    <form onSubmit={passwordChangeHandle} ref={pwchangeref}>
                        <TextField
                            type="password"
                            label="Current Password"
                            variant="filled"
                            className="w-100 my-2"
                            name="current_password"
                            required
                        />
                        <TextField
                            type="password"
                            label="New Password"
                            variant="filled"
                            className="w-100 my-2"
                            name="new_password"
                            required
                        />
                        <TextField
                            type="password"
                            label="Confirm Password"
                            variant="filled"
                            className="w-100 my-2"
                            name="confirm_password"
                            required
                        />
                        <Button variant="contained" className="my-3" type="submit">
                            Change Password
                        </Button>
                    </form>
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

// export default userOnlyWrap(Account);
export default Account;
