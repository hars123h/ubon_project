import React from 'react';
import db from '../firebase/config.js';
import { getDocs, query, where, collection, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [mobno, setMobno] = useState('');
    const [otpfield, setOTPfield] = useState('');
    const [otp, setOtp] = useState('');
    //const [otpVerified, setOtpVerified] = useState(false);
    const [clickable, setClickable] = useState((otpfield == otp && otp.length > 0 && otpfield.length > 0));

    const handleMessage = () => {
        if (mobno.length !== 10) {
            toast('Invalid Mobile No, please type a valid number');
        }
        fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=27b58V4YOqBDMgWvNjapz1k9IHlrJfynC6w0hceRAZGoLimK3PuJC7OoiV4N2B6DjfwWKzb0lhgEetPH&variables_values=${otpfield}&route=otp&numbers=${mobno}`)
            .then((response) => {
                //console.log(response);
                toast('OTP sent successfully');
            })
            .catch(error => toast('Something went wrong'));
    }

    const handleReset = async () => {
        const data = await getDocs(query(collection(db, 'users'), where('mobno', '==', mobno)));
        if (data.size !== 1) {
            toast('Something went wrong');
        } else {
            data.forEach(doc => {
                fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=27b58V4YOqBDMgWvNjapz1k9IHlrJfynC6w0hceRAZGoLimK3PuJC7OoiV4N2B6DjfwWKzb0lhgEetPH&route=q&message=Your Password is ${doc.data().pwd}. Please Reset Immediately&language=english&flash=0&numbers=${mobno}`)
                    .then((response) => toast('Check Message Inbox for password', {autoClose:30000}))
                    .catch((error) => console.log(error))
            })
            setOtp('');
            setOTPfield('');
            navigate('/login');
            //console.log(data);
        }
    }
//[#0096D5] [#0096D5] [#0096D5]
    return (
        <div className='bg-blue-500 h-screen'>
            <div className='text-center bg-blue-400 font-sans text-white pt-2 text-lg mb-10
        pb-2'> <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/login')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2 cursor-pointer hover:bg-white hover:stroke-black hover:rounded-full transition rounded-full ease-in-out delay-150 duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Find Password</div>
                {/* [#d3d6fe] */}
            <div className="box mb-20 border-2 m-auto border-gray-200 bg-blue-300 rounded-3xl border-solid lg:w-3/5 w-4/5 shadow-xl shadow-blue-600 p-4 w-50% flex flex-col">
                <div className="no_phone mb-3 flex items-center bg-white border-2 border-gray-100 rounded-full ">
                    <input onChange={(e) => { setMobno(e.target.value); setOTPfield(String(Math.floor(100000 + Math.random() * 900000))) }} type="number" className='p-2 w-full outline-none rounded-full' placeholder='Phone number' name="phoneno" id="phoneno" />
                    <div onClick={handleMessage} className='opt w-10 bg-blue-500 mr-4 text-xs cursor-pointer p-2 shadow-md rounded-2xl text-white text-center'>OTP</div>
                </div>


                <input type="password" className='p-2 mb-3 outline-none border-2 border-gray-100 rounded-full' onChange={(e) => setOtp(e.target.value)} placeholder='Please enter the OTP' name="passowrd" id="pass" />
                <button onClick={handleReset} disabled={!(otpfield == otp && otp.length > 0 && otpfield.length > 0)} className={`${(otpfield == otp && otp.length > 0 && otpfield.length > 0) ? 'bg-blue-500' : 'bg-gray-500 cursor-not-allowed'} text-white pt-1 pb-1 rounded-full text-lg`}>Confirm</button>
                <div onClick={() => { navigate('/login') }} className='cursor-pointer text-center bg-white text-black mt-2 p-2 mb-2 border-2 border-gray-100 rounded-full'>
                    Already have an account, log in
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword