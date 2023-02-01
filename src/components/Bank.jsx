import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import BASE_URL from '../api_url';

const Bank = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    //console.log(loc);
    const auth = getAuth();
    const [details, setDetails] = useState({
        fullName: '',
        phoneNo: '',
        bankAccount: '',
        bankName: '',
        ifsc: '',
    });
    const [wpwd, setPwd] = useState('');
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



    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        });
        //console.log(details);
    }

    const handleSubmit = async () => {
        if (loc.state.withdrawalPassword === wpwd) {
            await axios.post(`${BASE_URL}/bank_details`, {user_id:localStorage.getItem('uid'), bank_details:details})
                .then(() => {
                    toaster('Bank details added successfully!');    
                })
                .catch(() => console.log('Some error Occured')
                );
        } else {
            toaster('Incorrect withdrawal password!');
        }
    }
    //[#2e9afe]
    return (
        <div className='bg-red-500 h-full p-4 sm:h-[700px] md:h-[950px] relative'>
           {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="options text-center text-white text-2xl pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/settings', { state: { withdrawalPassword: loc.state.withdrawalPassword, loginPassword: loc.state.loginPassword } })} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                My Bank
            </div>

            {/* #757575 */}
            <div className="box mx-2 bg-red-400 text-white p-2 rounded-md mt-4">
                <div className='flex gap-2 items-center  text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={handleChange} name='fullName' value={details.fullName} className='outline-none w-full bg-inherit placeholder-white' placeholder='Full Name' />
                </div>

                <div className='flex gap-2 items-center text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={handleChange} name='phoneNo' value={details.phoneNo} className='outline-none w-full bg-inherit placeholder-white' placeholder='Phone Number' />
                </div>

                <div className='flex gap-2 items-center text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={handleChange} name='bankAccount' value={details.bankAccount} className='outline-none w-full bg-inherit placeholder-white' placeholder='Bank Account' />
                </div>

                <div className='flex gap-2 items-center text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={handleChange} name='bankName' value={details.bankName} className='outline-none w-full bg-inherit placeholder-white' placeholder='Bank Name' />
                </div>

                <div className='flex gap-2 items-center text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={handleChange} name='ifsc' value={details.ifsc} className='outline-none w-full bg-inherit placeholder-white' placeholder='IFSC' />
                </div>

                <div className='flex gap-2 items-center text-md p-3 m-1  cursor-pointer'>
                    <input type="text" onChange={(e) => setPwd(e.target.value)} name='wpwd' value={wpwd} className='outline-none w-full bg-inherit placeholder-white' placeholder='Withdrawal Password' />
                </div>
            </div>

            <div className='mb-[1000px]'>
                <button onClick={handleSubmit} className='bg-red-400 text-white text-lg mt-5 mb-20 rounded-lg shadow-xl block w-full py-2 shadow-red-200'>Confirm</button>
            </div>
        </div>
    )
}

export default Bank