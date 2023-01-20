import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import db from '../firebase/config';
import { getAuth, updatePassword } from 'firebase/auth';
import { toast } from 'react-toastify';


const ChangeLoginPassword = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    // console.log(loc.state);
    const auth = getAuth();
    const [oldpwd, setOldpwd] = useState('');
    const [newpwd, setNewpwd] = useState('');
    const [cnfNewPwd, setCnfNewPwd] = useState('');

    const handleReset = async () => {
        if (loc.state.loginPassword === oldpwd && newpwd === cnfNewPwd) {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await updatePassword(auth.currentUser, newpwd)
                .then(() => {
                    updateDoc(docRef, { pwd: newpwd }).then(() => {
                        //console.log('Password Update successfully');
                        toast('Password reset successfully!');
                        setCnfNewPwd(''); setNewpwd(''); setOldpwd('');
                        navigate('/mine');
                    }).catch((error) => console.log('Could Not update the datebase'));
                }).catch(error => {
                    console.log('Could Not Update the passwored', error);
                    toast('Please login again and retry to reset the password!');
                });
        } else {
            toast('Password entered is incorrect or passwords do not match!');
        }
    }

//[#2e9afe]
    return (
        <div className='bg-orange-500 h-screen p-4 sm:h-[700px] md:h-[950px]'>
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