import React, { useLayoutEffect, useState } from 'react';
import Slider from './Slider';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import headset1 from '../images/headset1.png';
import ubon_home from '../images/ubon_home.png';
import ubon_user from '../images/ubon_user.png';
import ubon_group from '../images/ubon_group.png';
import book_image from '../images/book_image.png';
import recharge_image from '../images/recharge_image.png';
import invite_image from '../images/invite_image.png';
import { useContext } from 'react';
import { AmountContext } from '../App.js';
import money_bag from '../images/money_bag.png';
import axios from 'axios';
import BASE_URL from '../api_url';

import amaz_big1 from '../images/amaz_big1.jpg';
import amaz_big2 from '../images/amaz_big2.png';
import amaz_big3 from '../images/amaz_big3.jpg';
import amaz_big4 from '../images/amaz_big4.jpg';
import amaz_big5 from '../images/amaz_big5.jpg';

import amaz_short1 from '../images/amaz_short1.jpg';
import amaz_short2 from '../images/amaz_short2.jpg';
import amaz_short3 from '../images/amaz_short3.jpg';
import amaz_short4 from '../images/amaz_short4.jpg';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Home = () => {

    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);
    const [currPlan, setCurrPlan] = React.useState(null);
    const [currentVisible, setCurrentVisible] = React.useState('big');
    const [userDetails, setUserDetails] = React.useState(null);
    const amountDetails = useContext(AmountContext);
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');
    const [originalwpwd, setOriginalwpwd] = useState(null);
    const [originalpwd, setOriginalpwd] = useState(null);

    const toaster = (text, arg = '') => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(() => {
            setToasterShow(false);
            //navigate('/mine');
            if (arg !== '') {
                navigate('/project');
            }
        }, 2000);
    }

    const openModal = () => {
        setIsOpen(true);
    }

    const getUserDetails = async () => {
        await axios.post(`${BASE_URL}/get_user`, {user_id:localStorage.getItem('uid')}).then(({data}) => {
            if (data) {
                setUserDetails(data);
                setOriginalwpwd(data.wpwd);
                setOriginalpwd(data.pwd);
            } else {
                //console.log('Data not found');
            }
        }).catch(error => console.log('Some error occured', error));
    }

    useLayoutEffect(() => {
        getUserDetails();
    }, []);

    const closeModal = async (action) => {
        if (action === 'cancel') {
            setIsOpen(false);
        } else if (quantity <= 0) {
            toaster('Please a positive value!');
        } else {
            if ((Number(quantity) * Number(currPlan.plan_amount)) > Number(userDetails.balance)) {
                toaster("You don't have enough balance to make this purchase");
            } else {
                await axios.post(`${BASE_URL}/purchase`, {
                    balance: Number(userDetails.balance) - Number(Number(quantity) * Number(currPlan.plan_amount)),
                    boughtLong: (currPlan.product_type === 'long' ? 1 : 0),
                    boughtShort: (currPlan.product_type === 'short' ? 1 : 0),
                    user_id: localStorage.getItem('uid'),
                    plans_purchased: {
                        ...currPlan,
                        quantity: quantity,
                        date_purchased: new Date().toDateString(),
                        date_till_rewarded: new Date().toDateString(),
                        time: new Date().toDateString(),
                        ddmmyy: new Date().getMilliseconds()
                    }
                }).then(() => {
                    console.log('Product successfully purchased');
                    toaster('Plan purchased!', '/project');
                }).catch((error) => {
                    console.log('Some error occured', error);
                    toaster('Some error occured, try again after some time');
                })
            }
            setIsOpen(false);
        }
    }

    const isBetween = () => {
        var startTime = '9:00:00';
        var endTime = '22:00:00';
    
        var currentDate = new Date()
    
        var startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);
    
        var endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);
    
    
        var valid = startDate < currentDate && endDate > currentDate;
        //console.log(valid);
        return valid;
      }

    const handleClick = (product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle) => {
        setCurrPlan({ product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle });
        openModal();
    }

    return (
        <div className='relative'>
            {toasterShow ? <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div> : null}
            <Slider />
            <div>
                <ReactModal
                    isOpen={modalIsOpen}
                    style={customStyles}
                    contentLabel="Enter Project Quantity"
                    ariaHideApp={false}

                >
                    <h1 className='text-gray-600 mb-3 text-xl'>Are you Sure?</h1>
                    <div>
                        <button onClick={() => closeModal('ok')} className='bg-red-500 text-white px-2 py-1 rounded-lg shadow-md w-[64px]'>Yes</button>
                        <button onClick={() => closeModal('cancel')} className='bg-red-500 text-white px-2 py-1 rounded-lg shadow-md w-[64px] ml-2'>cancel</button>
                    </div>
                </ReactModal>
            </div>

            {/*Marquee Implementation*/}
            <div className="bg-red-500 rounded-lg text-white relative flex overflow-x-hidden h-10 mx-auto mt-2 border-2 border-gray-100 sm:w-3/5 lg:w-3/5 overflow-y-hidden">
                <div className="py-12 animate-marquee flex flex-col whitespace-nowrap">
                    <span className="mx-4 text-sm">91915*****05 Member withdrawl 100000 Rs</span>
                    <span className="mx-4 text-sm">91702*****84 Member withdrawl 30000 Rs</span>
                    <span className="mx-4 text sm">91827*****42 Member withdrawl 2000 Rs</span>
                    <span className="mx-4 text sm">91770*****28 Member withdrawl 500 Rs</span>
                    <span className="mx-4 text sm">91983*****17 Member withdrawl 100000 Rs</span>
                </div>
            </div>

            {/*Navigation Bar 1*/}
            <div className="bg-red-500 rounded-lg text-white relative flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-100 sm:w-3/5 lg:w-3/5 overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <a href="https://telegram.me/amazfit_official" className=' no-underline text-white cursor-pointer'>
                        <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                            <img src={headset1} alt="online" className='w-10' />
                            <div>Telegram</div>
                        </div>
                    </a>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={invite_image} alt="invite" className='w-10' onClick={() => navigate('/invite')} />
                        <div>Invite</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={recharge_image} alt="recharge" className='w-10' onClick={() => navigate('/recharge')} />
                        <div>Recharge</div>
                    </div>

                    {isBetween()===false ?<div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => toaster('You can withdraw only between 9:00 to 19:00 hours only.')}>
                        <img src={money_bag} alt="app_dwd" className='w-10' />
                        <div>Withdrawal</div>
                    </div>:<div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/withdrawal', { state: { withdrawalPassword: originalwpwd, loginPassword: originalpwd } })}>
                        <img src={money_bag} alt="app_dwd" className='w-10' />
                        <div>Withdrawal</div>
                    </div>}

                </div>
            </div>

            <div className='bg-red-500 text-md text-white flex items-center shadow-lg rounded-md mb-2 sm:w-3/5 lg:w-3/5 mx-auto'>
                <div className={`w-1/2 text-center py-2 ${currentVisible === 'big' ? 'border-b-4 bg-red-600 border-gray-400' : ''}`} onClick={() => setCurrentVisible('big')}>Normal Plans</div>
                <div className={`w-1/2 text-center py-2 ${currentVisible === 'short' ? 'border-b-4 bg-red-600 border-gray-400' : ''}`} onClick={() => setCurrentVisible('short')}>VIP Plans</div>
            </div>

            {/*Plans Cards*/}
            <div className="card_grid grid grid-cols-1 sm:w-3/5 lg:w-3/5 mx-auto mt-2 mb-20">

                {currentVisible === 'big' && (
                    <div className='grid grid-cols-2'>
                        {userDetails && (amountDetails.plan_state[0] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={amaz_big1} handleClick={handleClick} plan_name={"amazfit 1"} plan_cycle={50} plan_daily_earning={40} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big1} handleClick={handleClick} plan_name={"amazfit 1"} plan_cycle={50} plan_daily_earning={40} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[1] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={amaz_big2} handleClick={handleClick} plan_name={"amazfit 2"} plan_cycle={30} plan_daily_earning={90} plan_amount={600} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big2} handleClick={handleClick} plan_name={"amazfit 2"} plan_cycle={30} plan_daily_earning={90} plan_amount={600} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[2] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={amaz_big3} handleClick={handleClick} plan_name={"amazfit 3"} plan_cycle={35} plan_daily_earning={200} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big3} handleClick={handleClick} plan_name={"amazfit 3"} plan_cycle={35} plan_daily_earning={200} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[3] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={amaz_big4} handleClick={handleClick} plan_name={"amazfit 4"} plan_cycle={20} plan_daily_earning={1000} plan_amount={5000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big4} handleClick={handleClick} plan_name={"amazfit 4"} plan_cycle={20} plan_daily_earning={1000} plan_amount={5000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[4] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={amaz_big5} handleClick={handleClick} plan_name={"amazfit 5"} plan_cycle={18} plan_daily_earning={2500} plan_amount={12000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big5} handleClick={handleClick} plan_name={"amazfit 5"} plan_cycle={18} plan_daily_earning={2500} plan_amount={12000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[5] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card  product_type={"long"} product_image={amaz_big1} handleClick={handleClick} plan_name={"amazfit 6"} plan_cycle={10} plan_daily_earning={4000} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={amaz_big1} handleClick={handleClick} plan_name={"amazfit 6"} plan_cycle={10} plan_daily_earning={4000} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        )}
                    </div>)}

                {currentVisible === 'short' && (
                    <div className={`grid grid-cols-2`}>
                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[6] === 0) ?
                            (
                                <span className='pointer-events-none'>
                                    <Card product_type={"short"} product_image={amaz_short1} handleClick={handleClick} plan_name={"amazfit 7"} plan_cycle={3} plan_daily_earning={230} plan_amount={410} plan_type={'Short Plan'} />
                                </span>
                            ) :
                            <span>
                                <Card product_type={"short"} product_image={amaz_short1} handleClick={handleClick} plan_name={"amazfit 7"} plan_cycle={3} plan_daily_earning={230} plan_amount={410} plan_type={'Short Plan'} />
                            </span>
                        }

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[7] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={amaz_short2} handleClick={handleClick} plan_name={"amazfit 8"} plan_cycle={4} plan_daily_earning={400} plan_amount={1100} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={amaz_short2} handleClick={handleClick} plan_name={"amazfit 8"} plan_cycle={4} plan_daily_earning={400} plan_amount={1100} plan_type={'Short Plan'} />
                            </span>
                            )}

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[8] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={amaz_short3} handleClick={handleClick} plan_name={"amazfit 9"} plan_cycle={3} plan_daily_earning={1200} plan_amount={3000} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={amaz_short3} handleClick={handleClick} plan_name={"amazfit 9"} plan_cycle={3} plan_daily_earning={1200} plan_amount={3000} plan_type={'Short Plan'} />
                            </span>
                            )}

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[9] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={amaz_short4} handleClick={handleClick} plan_name={"amazfit 10"} plan_cycle={3} plan_daily_earning={3200} plan_amount={8000} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={amaz_short4} handleClick={handleClick} plan_name={"amazfit 10"} plan_cycle={3} plan_daily_earning={3200} plan_amount={8000} plan_type={'Short Plan'} />
                            </span>
                            )}

                        {/* {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[12] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={waltonbd_product13} handleClick={handleClick} plan_name={"Walton Plan 13"} plan_cycle={2} plan_daily_earning={15000} plan_amount={20000} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={waltonbd_product13} handleClick={handleClick} plan_name={"Walton Plan 13"} plan_cycle={2} plan_daily_earning={15000} plan_amount={20000} plan_type={'Short Plan'} />
                            </span>
                            )} */}

                    </div>)}
            </div>



            {/*Navigation Bar 2*/}
            <div className="fixed bottom-0 z-10 bg-red-500 rounded-none text-white flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-100 w-full overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={ubon_home} alt="online" className='w-4' />
                        <div>Home</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/team')}>
                        <img src={ubon_group} alt="recharge" className='w-4' />
                        <div>Team</div>
                    </div>
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center ' onClick={() => navigate('/project')}>
                        <img src={book_image} alt="app_dwd" className='w-4' />
                        <div>Project</div>
                    </div>


                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/mine')}>
                        <img src={ubon_user} alt="invite" className='w-4' />
                        <div>My</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home