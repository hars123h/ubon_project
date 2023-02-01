import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {doc, updateDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { toast } from 'react-toastify';
import db from '../firebase/config';
import axios from 'axios';
import BASE_URL from '../api_url';


const ChangeWithdrawalPassword = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const loc = useLocation();
    const [oldpwd, setOldpwd] = useState('');
    const [cnf_new_pwd, setCnf_new_pwd] = useState('');
    const [new_pwd, setNew_pwd] = useState('');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            navigate('/settings', {state:{withdrawalPassword:loc.state.withdrawalPassword, loginPassword:loc.state.loginPassword}})
        },5000);
    }

    const handleReset = async() => {
        if(new_pwd===cnf_new_pwd && oldpwd===loc.state.withdrawalPassword) {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await axios.post(`${BASE_URL}/reset_withdrawal_password`, 
            {new_wpwd:new_pwd, user_id:localStorage.getItem('uid')}).then(()=>{
                setOldpwd('');
                setCnf_new_pwd('');
                setNew_pwd('');
                toaster('Password successfully updated!');
            })
            .catch(error=>toaster('Some Error Occured'));
        }else {
            //console.log({new_pwd, cnf_new_pwd, oldpwd});
            toaster('Either Old Login Password is incorrect or password do not match, Please Retry!');
        }
    }

    //console.log(loc);
    return (
        <div className='bg-red-500 h-screen p-4 sm:h-[700px] md:h-[950px] relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="options text-center text-white text-xl pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', {state:{withdrawalPassword:loc.state.withdrawalPassword, loginPassword:loc.state.loginPassword}})} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Fund Management Password
            </div>

{/* [#61b2ff] */}
            <div className="box mx-2 bg-red-400 p-2 rounded-md mt-4">

                <div className='flex gap-2 items-center text-white  text-lg p-3 m-1  '>
                    Please enter the New Password
                </div>

                <div className='flex gap-2 items-center  text-lg p-3 m-1  '>
                    <input onChange={(e)=>setOldpwd(e.target.value)} type="text" className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='Old Withdrawal Password' />
                </div>

                <div className='flex gap-2 items-center text-lg p-3 m-1  '>
                    <input onChange={(e)=>setNew_pwd(e.target.value)} type="text" className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='New Withdrawal Password' />
                </div>

                <div className='flex gap-2 items-center text-lg p-3 m-1 '>
                    <input onChange={(e)=>setCnf_new_pwd(e.target.value)} type="text" className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='Confirm New Withdrawal Pasword' />
                </div>
            </div>

            <div>
                {/* [#7899de] */}
                <button onClick={handleReset} className='bg-red-400 text-white text-lg mt-5 mb-20 rounded-lg shadow-xl block w-full py-2 shadow-red-600'>Confirm</button>
            </div>
        </div>
    )
}

export default ChangeWithdrawalPassword;