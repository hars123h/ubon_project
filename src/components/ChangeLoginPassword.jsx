import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import BASE_URL from '../api_url';



const ChangeLoginPassword = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    // console.log(loc.state);
    const auth = getAuth();
    const [oldpwd, setOldpwd] = useState('');
    const [newpwd, setNewpwd] = useState('');
    const [cnfNewPwd, setCnfNewPwd] = useState('');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            navigate('/mine');
        },5000);
    }

    const handleReset = async () => {
        if (loc.state.loginPassword === oldpwd && newpwd === cnfNewPwd) {
            await axios.post(`${BASE_URL}/reset_login_password`, {user_id:localStorage.getItem('uid'), new_pwd:newpwd})
                .then(() => {
                    setCnfNewPwd(''); setNewpwd(''); setOldpwd('');
                    toaster('Password reset successfully!');
                }).catch(error => {
                    console.log('Could Not Update the passwored', error);
                    toaster('Please login again and retry to reset the password!');
                });
        } else {
            toaster('Password entered is incorrect or passwords do not match!');
        }
    }

//[#2e9afe]
    return (
        <div className='bg-orange-500 h-screen p-4 sm:h-[700px] md:h-[950px] relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="options text-center text-white text-2xl pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Change Login Password
            </div>

{/* [#61b2ff]  */}
            <div className="box mx-2 bg-orange-400 p-2 rounded-md mt-4">

                <div className='flex gap-2 items-center text-white  text-lg p-3 m-1  '>
                    Please enter the New Password
                </div>

                <div className='flex gap-2 items-center  text-lg p-3 m-1  '>
                    <input type="text" value={oldpwd} onChange={e => setOldpwd(e.target.value)} className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='Old Login Password' />
                </div>

                <div className='flex gap-2 items-center text-lg p-3 m-1  '>
                    <input type="text" value={newpwd} onChange={e => setNewpwd(e.target.value)} className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='New Login Password' />
                </div>

                <div className='flex gap-2 items-center text-lg p-3 m-1 '>
                    <input type="text" value={cnfNewPwd} onChange={e => setCnfNewPwd(e.target.value)} className='outline-none w-full bg-inherit placeholder-[#757575]' placeholder='Confirm New Pasword' />
                </div>
            </div>

            <div>
                <button onClick={handleReset} className='bg-orange-400 text-white text-lg mt-5 mb-20 rounded-lg shadow-xl block w-full py-2 shadow-orange-600'>Confirm</button>
            </div>
        </div>
    )
}

export default ChangeLoginPassword;