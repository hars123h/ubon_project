import { getAuth } from 'firebase/auth';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, } from 'react-router-dom';
import db from '../firebase/config';
import { RotatingLines } from 'react-loader-spinner';
import DateDifference from '../utility/DateDifference.js';
import { toast } from 'react-toastify';

const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    //console.log(result);
    return result;
}


const Project = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [current_tab, setCurrent_tab] = useState('earning');
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


    const getUserDetails = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await getDoc(docRef).then(document => {
            if (document.exists()) {
                setUserDetails(document.data());
                if (('plans_purchased' in document.data()) === false) {
                    toaster('Please buy a plan first!');
                }
                if (document.data().plans_purchased) {
                    var earn = 0;
                    var temp = document.data().plans_purchased.map((element) => {
                        var days = DateDifference(new Date(element.date_till_rewarded), new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))));
                        var days2 = DateDifference(new Date(element.date_till_rewarded), addDays(new Date(element.date_purchased), element.plan_cycle));

                        if(element.product_type==='short') {
                            if(days===element.plan_cycle) {
                                earn = (days * element.quantity * element.plan_daily_earning);
                                return {
                                    ...element,
                                    date_till_rewarded: new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))).toDateString()
                                }
                            }else {
                                return {
                                    ...element
                                }
                            }
                        }

                        if (days > element.plan_cycle) {
                            return {
                                ...element
                            }
                        }
                        earn = earn + (days * element.quantity * element.plan_daily_earning);
                        return {
                            ...element,
                            date_till_rewarded: new Date(Math.min(new Date(), addDays(new Date(element.date_purchased), element.plan_cycle))).toDateString()
                        }
                    });
                    const docRef1 = doc(db, 'users', auth.currentUser.uid);

                    updateDoc(docRef1, {
                        earning: increment(earn),
                        balance: increment(earn),
                        plans_purchased: temp
                    })
                        .then(() => console.log('Reward successfully updated'))
                        .catch(error => console.log('Some error Occured'));
                }
            } else {
                console.log('Data not found');
            }
            setLoading(false);

        }).then(() => {
            //console.log('This is working');
        })
            .catch(error => console.log('Some error occured', error));
    }

    useEffect(() => {
        setLoading(true);
        getUserDetails();
        //console.log(userDetails);
        //console.log('Use Effect Ran');
    }, []);

    if (loading) {
        return (
            <div className="grid place-items-center h-screen ">
                <div className='flex flex-col justify-center items-center'>
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="2"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                    <div className='text-lg text-gray-500'>Loading...</div>
                </div>
            </div>
        )
    }


//[#2e9afe]
    return (
        <div className='md:h-screen overflow-y-scroll xs:h-[700px] bg-orange-500 h-screen relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}

            <div className="options text-center bg-orange-500 text-white text-md pt-5 font-normal pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Project Record
            </div>


            <div className='records w-full flex bg-[#d3d6fe] items-center'>
                <div onClick={() => setCurrent_tab('earning')} className={`cursor-pointer h-[40px] flex items-center justify-center w-1/2 text-center border-b-4 font-semibold ${current_tab === 'earning' ? 'border-orange-600 text-orange-500' : 'text-white'}`}>Earning</div>
                <div onClick={() => setCurrent_tab('completed')} className={`cursor-pointer h-[40px] flex items-center justify-center w-1/2 text-center border-b-4 ${current_tab === 'completed' ? 'border-orange-600 text-orange-500' : 'text-white'}`}>Completed</div>
            </div>

            <div className=' mx-auto w-[95%] mt-2 p-2 pb-10'>
                {
                    current_tab === 'earning' && userDetails && ('plans_purchased' in userDetails) && (
                        userDetails.plans_purchased.map((element, index) => {
                            if (element.plan_daily_earning * element.plan_cycle !== DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning) {
                                return (
                                    <div key={index} className='mx-auto w-[90%] mt-2 border-x-2 border-white border-b-2  rounded-lg shadow-lg shadow-orange-700 text-white'>
                                        <div className="text-lg p-3 text-orange-600 font-semibold bg-white rounded-t-lg">Plan Details</div>
                                        <div className='p-3'>
                                            <div className='mb-1'>Plan Name: {element.plan_name}</div>
                                            <div className='mb-1'>Start Date: {element.date_purchased}</div>
                                            <div className='mb-1'>Plan Amount: &#8377;{element.plan_amount}</div>
                                            <div className='mb-1'>Plan Type: {element.plan_type}</div>
                                            <div className='mb-1'>Plan Cycle: {element.plan_cycle}</div>
                                            <div className='mb-1'>Plan Daily Earning: &#8377;{element.plan_daily_earning}</div>
                                            <div className='mb-1'>Quantity: {element.quantity}</div>
                                            <div className='mb-1'>Current Earning: &#8377;{DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning}</div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    )
                }

                {
                    userDetails && ('plans_purchased' in userDetails) && (
                        current_tab === 'completed' && userDetails.plans_purchased.map((element, index) => {
                            if (element.plan_daily_earning * element.plan_cycle === DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning) {
                                return (
                                    <div key={index} className='mx-auto w-[90%] mt-2 border-x-2 border-white border-b-2  rounded-lg shadow-lg text-white'>
                                        <div className="text-lg p-3 text-[#2e9afe] font-semibold bg-white rounded-t-lg">Plan Details</div>
                                        <div className='p-3'>
                                            <div className='mb-1'>Plan Name: {element.plan_name}</div>
                                            <div className='mb-1'>Start Date: {element.date_purchased}</div>
                                            <div className='mb-1'>Plan Amount: &#8377;{element.plan_amount}</div>
                                            <div className='mb-1'>Plan Type: {element.plan_type}</div>
                                            <div className='mb-1'>Plan Cycle: {element.plan_cycle}</div>
                                            <div className='mb-1'>Plan Daily Earning: &#8377;{element.plan_daily_earning}</div>
                                            <div className='mb-1'>Quantity: {element.quantity}</div>
                                            <div className='mb-1'>Current Earning: &#8377;{DateDifference(new Date(element.date_purchased), new Date(element.date_till_rewarded)) * element.quantity * element.plan_daily_earning}</div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    )
                }
            </div>



            {!userDetails?.plans_purchased && (
                <div className='text-2xl text-white text-center w-[90%] mx-auto p-3 m-3 border-2 border-gray-300 rounded-lg shadow-lg'>
                    No data to show!
                </div>
            )}
        </div>
    )
}

export default Project