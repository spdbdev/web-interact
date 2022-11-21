import React from 'react'
import { useEffect } from 'react'
import {user} from './firebase/firebase.js';
import { useNavigate } from 'react-router-dom';

function AuthGuard({children}) {

  const navigate = useNavigate();

  useEffect(()=>{
    if(!user) navigate('/a/signin');
  },[]);
  return (
    <>
      {children}
    </>
  )
}

export default AuthGuard