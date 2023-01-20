import React from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../firebase/config';
import {doc, getDoc} from 'firebase/firestore';
import { useState, useLayoutEffect } from 'react';
import { getAuth } from 'firebase/auth';

const Team = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async() => {
    const details = await getDoc(doc(db, 'users', localStorage.getItem('uid')));
    setUserDetails(details.data());
  }

  useLayoutEffect(()=>{
    getUserDetails();
    setLoading(false);
  },[]);

  if(loading || userDetails===null) {
    return (
      <div className='h-screen grid place-items-center'>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* [#2e9afe] */}
      <div className="top my-auto text-center h-10 p-1 bg-orange-500 text-white text-lg font-medium">
        <span className='absolute flex w-32 cursor-pointer' onClick={()=>navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-white mr-2 ml-2 my-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
          </svg> back
        </span>
        Team
      </div>

{/* #2e9afe */}
      <div className="p-4 rounded-xl bars w-4/5 mx-auto mt-10 bg-orange-500 text-white">
        <div className=' font-light'>Team Number</div>
        <div className='text-sm'>{userDetails.directMember.length+userDetails.indirectMember.length}</div>
      </div>

      <div className="p-4 rounded-xl bars w-4/5 mx-auto mt-3 bg-orange-500 text-white">
        <div className=' font-light'>Team Recharge</div>
        <div className='text-sm'>&#8377; {userDetails.directRecharge+userDetails.indirectRecharge}</div>
      </div>

      <div className="p-4 rounded-xl bars w-4/5 mx-auto mt-3 bg-orange-500 text-white">
        <div className=' font-light'>Directly Recharge</div>
        <div className='text-sm'>&#8377; {userDetails.directRecharge}</div>
      </div>

      <div className="p-4 rounded-xl bars w-4/5 mx-auto mt-3 bg-orange-500 text-white">
        <div className=' font-light'>Directly Number</div> 
        <div className='text-sm'>{userDetails.directMember.length}</div>
      </div>

    </div>
  )
}

export default Team