import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmountContext } from '../App';


const Recharge = () => {

    const [recharge_value, setRecharge_Value] = useState(0);
    const navigate = useNavigate();
    const amountDetails = useContext(AmountContext);
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
            //navigate('/mine');
        },5000);
    }

    const handleRecharge = () => {
        if (parseInt(recharge_value)) {
            if (Number(amountDetails.amount) > Number(recharge_value)) {
                toaster(`Amount should be greater than ₹${amountDetails.amount}`);
                return;
            }
            navigate(`/recharge_window/${recharge_value}`);
        } else {
            alert('Enter a valid recharge amount');
        }
    }
    //[#2e9afe] #4daaff #298ae4 [#2e9afe]
    return (
        <div className='bg-orange-400 h-screen relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <div className="options text-center text-white text-md pt-5 font-normal mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Recharge
            </div>

            <div className="box bg-orange-600 px-4 py-4 shadow-md shadow-orange-200">

                <div className='m-1 text-md text-white mb-4'>Enter Amount:</div>
                <div className='m-1 w-full flex items-center'>
                    <span className='text-red-600 font-bold p-0.5 pr-1 border-b border-white'>₹</span>
                    <input onChange={(e) => setRecharge_Value(e.target.value)} type="text" name="amount" id="amt" placeholder='Amount' className='w-full bg-inherit text-[#fff] outline-none font-normal text-lg border-b border-white' />
                </div>

                <ol className='text-white text-xs'>
                    <li className='mt-2 my-1 mr-1'>1: Fill in the callback UTR correctly, and the account will be credited within 1 minute.</li>
                    <li className='mt-2 my-1 mr-1'>2: If you forget to fill in the UTR, please contact the online customer service in time to help you solve the problem of the safe arrival of funds.</li>
                    <li className='mt-2 my-1 mr-1'>3: Your Money will be added to your wallet within 10 minutes.</li>
                </ol>

            </div>

            <div className="cnf_recharge w-4/5 mx-auto mt-10">
                <button onClick={handleRecharge} className='w-full bg-orange-600 py-2 rounded-md text-white text-lg shadow-customShadow shadow-[#beadcc]'>Confirm Recharge</button>
            </div>
        </div>
    )
}

export default Recharge