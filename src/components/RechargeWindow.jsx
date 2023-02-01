import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getAuth} from 'firebase/auth';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import BASE_URL from '../api_url.js';

const RechargeWindow = () => {

    const { recharge_value } = useParams();
    const [refno, setRefno] = useState('');
    const amountDetails  = useContext(AmountContext);
    const navigate = useNavigate();
    const auth = getAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text, arg='') => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            //navigate('/mine');
            if(arg==='/record') {
                navigate('/record');
            }
        },5000);
    }

    const getUserDetails = async() => {
        const  user_info = await axios.post(`${BASE_URL}/get_user`, {user_id:localStorage.getItem('uid')}).then(({data})=>data);
        setUserDetails(user_info);
    }

    useEffect(()=>{
        console.log(amountDetails)
        getUserDetails();
    },[]);



    const handleRecharge = async () => {
        //console.log({ refno, recharge_value, status: 'pending' });
        if(refno.length!==12) {
            toaster('Enter a valid Ref No. of 12 digits');
            return;
        }
        try {
            await axios.post(`${BASE_URL}/place_recharge`, { 
                refno, 
                recharge_value, 
                status: 'pending', 
                user_id: localStorage.getItem('uid'), 
                mobno:userDetails.mobno, 
                time:new Date(),
                parent_id: userDetails.parent_id,
                grand_parent_id: userDetails.grand_parent_id?userDetails.grand_parent_id:'',
                great_grand_parent_id: userDetails.great_grand_parent_id?userDetails.great_grand_parent_id:''
             }).then((response)=>{
                console.log('Recharge placed successfully!');
             })
            
            //console.log("Document written with ID: ", docRef1.id, docRef2.id);
            toaster('Request Placed Successfully!', '/record');
            setRefno('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <div className='sm:h-[700px] md:h-[950px] flex flex-col gap-4  bg-[#F2F2F2] relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="options text-center text-white flex gap-2 items-center p-2  bg-red-500 text-lg pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/mine')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6  storke-white  cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <div className='flex-grow'>Payment Window</div>
            </div>
            <div className='flex flex-col gap-4 p-8'>

                <div className='font-bold text-xl text-red-500'>UPI Information</div>
                <div className="box flex rounded-lg p-6 flex-col mt-3 bg-red-500 text-white">
                    <div className='text-md'>Payment Amount</div>
                    <div className='text-4xl'>&#8377; {recharge_value}</div>
                </div>

                <div className='font-bold text-xl text-red-500'>Payment Via UPI</div>
                <div className="step_one flex flex-col gap-1">
                    <div className='text-md'>1.Copy UPI information</div>
                    <div className='flex rounded-md items-center justify-between gap-2  p-2 border-2 border-red-300'>
                        <div className='text-red-500 font-bold'>{amountDetails.upi_id}</div>
                        <CopyToClipboard text={`${amountDetails.upi_id}`} onCopy={() => toaster('Copied to clipboard')}>
                        <div className='text-lg font-bold text-red-500 cursor-pointer'>Copy</div>
                </CopyToClipboard>
                        
                    </div>
                </div>

                <div>2. Transfer the amount you want to recharge to us by UPI transfer.</div>
                <div>3. Please enter Ref No. to complete the recharge.</div>

                <div className='flex rounded-md justify-between gap-2  p-2 border-2 border-red-500'>
                    <input value={refno} onChange={e => setRefno(e.target.value)} type="text" placeholder='REF NO.' className=' bg-inherit outline-none flex-grow' />
                </div>

                <div className="small_info text-sm  underline">
                    Please enter the REF NO./ Reference No./UTR 12-digit number of your transfer and we will finish your recharge as soon as possible.
                </div>

                <button onClick={handleRecharge} className='bg-red-500 text-white p-4 rounded-lg text-lg shadow-lg shadow-gray-400'>Submit</button>

            </div>

        </div>
    )
}

export default RechargeWindow;