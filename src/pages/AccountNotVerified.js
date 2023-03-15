import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

function AccountNotVerified() {
  const { authState } = useContext(AppContext);
  const history = useHistory();

  useEffect(()=>{
      if(authState.loggedUser.verified === "true"){
          history.push("/login")
      }
      if (authState.loggedUser.role === 'admin') {
          history.push('/admin');
      }
  },[])
  return (
    <div className='container' style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <h1 style={{textAlign:'center'}}>Your account haven't verified by admin. Wait for admin to verify your account.</h1>
        <h1 style={{textAlign:'center'}}>Thank you!</h1>
    </div>
  )
}

export default AccountNotVerified