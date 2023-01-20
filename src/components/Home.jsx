import React, { useLayoutEffect } from 'react';
import Slider from './Slider';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { arrayUnion, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import db from '../firebase/config.js';
import { getAuth } from 'firebase/auth';
import headset1 from '../images/headset1.png';

import ubon_1 from '../images/ubon_1.jpg';
import ubon_2 from '../images/ubon_2.jpg';
import ubon_3 from '../images/ubon_3.jpg';

import ubon_4 from '../images/ubon_4.jpg';
import ubon_5 from '../images/ubon_5.jpg';
import ubon_6 from '../images/ubon_6.jpg';

import ubon_7 from '../images/ubon_7.png';
import ubon_8 from '../images/ubon_8.jpg';
import ubon_9 from '../images/ubon_9.jpg';


import waltonbd_product1 from '../images/waltonbd_product1.jpg';

import waltonbd_product2 from '../images/waltonbd_product2.jpg';
import waltonbd_product3 from '../images/waltonbd_product3.jpg';
import waltonbd_product4 from '../images/waltonbd_product4.jpg';

import waltonbd_product5 from '../images/waltonbd_product5.jpg';
import waltonbd_product6 from '../images/waltonbd_product6.png';
import waltonbd_product7 from '../images/waltonbd_product7.jpg';

import waltonbd_product8 from '../images/waltonbd_product8.jpg';
import waltonbd_product9 from '../images/waltonbd_product9.jpg';
import waltonbd_product10 from '../images/waltonbd_product10.jpg';

import waltonbd_product11 from '../images/waltonbd_product11.jpg';
import waltonbd_product12 from '../images/waltonbd_product12.jpg';
import waltonbd_product13 from '../images/waltonbd_product13.jpg';

import download_image from '../images/download_image.png';
import recharge_image from '../images/recharge_image.png';
import invite_image from '../images/invite_image.png';
import paper_image from '../images/paper_image.png';
import buildingNew from '../images/buildingNew.png';
import homeNew from '../images/homeNew.png';
import teamNew from '../images/teamNew.png';
import { useContext } from 'react';
import { AmountContext } from '../App.js';


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
    const auth = getAuth();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [quantity, setQuantity] = React.useState(0);
    const [currPlan, setCurrPlan] = React.useState(null);
    const [currentVisible, setCurrentVisible] = React.useState('big');
    const [userDetails, setUserDetails] = React.useState(null);
    const amountDetails = useContext(AmountContext);

    const openModal = () => {
        setIsOpen(true);
    }

    const getUserDetails = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await getDoc(docRef).then(doc => {
            if (doc.exists()) {
                //console.log(doc.data());
                setUserDetails(doc.data());
            } else {
                //console.log('Data not found');
            }
        }).catch(error => console.log('Some error occured', error));
    }

    useLayoutEffect(() => {
        localStorage.setItem('uid', auth.currentUser.uid);
        getUserDetails();
    }, []);

    const closeModal = async (action) => {
        if (action === 'cancel') {
            setIsOpen(false);
        } else if (quantity <= 0) {
            toast('Please a positive value!', { autoClose: 1000 });
        } else {
            //console.log({...currPlan, quantity});
            //setCurrPlan({...currPlan, quantity});
            console.log(userDetails);
            console.log((quantity * currPlan.plan_amount), Number(userDetails.balance));
            if ((Number(quantity) * Number(currPlan.plan_amount)) > Number(userDetails.balance)) {
                toast("You don't have enough balance to make this purchase", { autoClose: 1000 });
            } else {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                console.log({
                    ...currPlan,
                    quantity: quantity,
                    date_purchased: new Date().toDateString(),
                    date_till_rewarded: new Date().toDateString(),
                    time: new Date().toDateString()
                });
                await updateDoc(docRef, {
                    balance: Number(userDetails.balance) - Number(Number(quantity) * Number(currPlan.plan_amount)),
                    boughtLong: increment(currPlan.product_type === 'long' ? 1 : 0),
                    boughtShort: increment(currPlan.product_type === 'short' ? 1 : 0),
                    plans_purchased: arrayUnion({
                        ...currPlan,
                        quantity: quantity,
                        date_purchased: new Date().toDateString(),
                        date_till_rewarded: new Date().toDateString(),
                        time: new Date().toDateString(),
                        ddmmyy: new Date().getMilliseconds()
                    })
                }).then(() => {
                    //console.log('Product successfully purchased');
                    toast('Plan purchased!');
                    navigate('/project');
                }).catch((error) => {
                    console.log('Some error occured', error);
                    toast('Some error occured, try again after some time');
                })
            }
            setIsOpen(false);
        }
    }

    const handleClick = (product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle) => {
        openModal();
        setCurrPlan({ product_type, plan_name, plan_type, plan_amount, plan_daily_earning, plan_cycle });
    }

    return (
        <div>
            <Slider />
            <div>
                <ReactModal
                    isOpen={modalIsOpen}
                    style={customStyles}
                    contentLabel="Enter Project Quantity"
                    ariaHideApp={false}

                >
                    <h1 className='text-gray-600 mb-3 text-xl'>Choose a quantity</h1>
                    <input type="number" onChange={e => setQuantity(e.target.value)} name="quantity" id="qnty" placeholder='Enter a Quantity' className='outline-none rounded-lg border-2 border-gray-400 focus:border-orange-500 p-3' />
                    <h6 className='text-red-500 text-xs mb-3'>*only positive values</h6>
                    <div>
                        <button onClick={() => closeModal('ok')} className='bg-orange-500 text-white px-2 py-1 rounded-lg shadow-md w-[64px]'>ok</button>
                        <button onClick={() => closeModal('cancel')} className='bg-red-500 text-white px-2 py-1 rounded-lg shadow-md w-[64px] ml-2'>cancel</button>
                    </div>
                </ReactModal>
            </div>

            {/*Marquee Implementation*/}
            <div className="bg-orange-500 rounded-lg text-white relative flex overflow-x-hidden h-10 mx-auto mt-2 border-2 border-gray-100 sm:w-3/5 lg:w-3/5 overflow-y-hidden">
                <div className="py-12 animate-marquee flex flex-col whitespace-nowrap">
                    <span className="mx-4 text-sm">91915*****05 Member withdrawl 100000 Rs</span>
                    <span className="mx-4 text-sm">91702*****84 Member withdrawl 30000 Rs</span>
                    <span className="mx-4 text sm">91827*****42 Member withdrawl 2000 Rs</span>
                    <span className="mx-4 text sm">91770*****28 Member withdrawl 500 Rs</span>
                    <span className="mx-4 text sm">91983*****17 Member withdrawl 100000 Rs</span>
                </div>
            </div>

            {/*Navigation Bar 1*/}
            <div className="bg-orange-500 rounded-lg text-white relative flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-100 sm:w-3/5 lg:w-3/5 overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <a href="https://telegram.me/WaltonOfficialGroup91" className=' no-underline text-white cursor-pointer'>
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

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={download_image} alt="app_dwd" className='w-10' />
                        <div>App</div>
                    </div>

                </div>
            </div>

            <div className='bg-orange-500 text-xl text-white flex items-center shadow-lg rounded-md mb-2 sm:w-3/5 lg:w-3/5 mx-auto'>
                <div className={`w-1/2 text-center py-2 ${currentVisible === 'big' ? 'border-b-4 bg-orange-600 border-gray-400' : ''}`} onClick={() => setCurrentVisible('big')}>Normal Plans</div>
                <div className={`w-1/2 text-center py-2 ${currentVisible === 'short' ? 'border-b-4 bg-orange-600 border-gray-400' : ''}`} onClick={() => setCurrentVisible('short')}>VIP Plans</div>
            </div>

            {/*Plans Cards*/}
            <div className="card_grid grid grid-cols-1 sm:w-3/5 lg:w-3/5 mx-auto mt-2 mb-20">

                {currentVisible === 'big' && (
                    <div className='grid grid-cols-2'>
                        {userDetails && (amountDetails.plan_state[0] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_1} handleClick={handleClick} plan_name={"RTR 1"} plan_cycle={50} plan_daily_earning={40} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_1} handleClick={handleClick} plan_name={"RTR 1"} plan_cycle={50} plan_daily_earning={40} plan_amount={300} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[1] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_2} handleClick={handleClick} plan_name={"RTR 2"} plan_cycle={30} plan_daily_earning={90} plan_amount={600} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_2} handleClick={handleClick} plan_name={"RTR 2"} plan_cycle={30} plan_daily_earning={90} plan_amount={600} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[2] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_3} handleClick={handleClick} plan_name={"RTR 3"} plan_cycle={35} plan_daily_earning={200} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_3} handleClick={handleClick} plan_name={"RTR 3"} plan_cycle={35} plan_daily_earning={200} plan_amount={1500} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[3] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_4} handleClick={handleClick} plan_name={"RTR 4"} plan_cycle={20} plan_daily_earning={1000} plan_amount={5000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_4} handleClick={handleClick} plan_name={"RTR 4"} plan_cycle={20} plan_daily_earning={1000} plan_amount={5000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[4] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_5} handleClick={handleClick} plan_name={"RTR 5"} plan_cycle={18} plan_daily_earning={2500} plan_amount={12000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_5} handleClick={handleClick} plan_name={"RTR 5"} plan_cycle={18} plan_daily_earning={2500} plan_amount={12000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[5] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={ubon_2} handleClick={handleClick} plan_name={"RTR 6"} plan_cycle={10} plan_daily_earning={4000} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={ubon_2} handleClick={handleClick} plan_name={"RTR 6"} plan_cycle={10} plan_daily_earning={4000} plan_amount={20000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {/* {userDetails && (amountDetails.plan_state[5] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={waltonbd_product6} handleClick={handleClick} plan_name={"Walton Plan 6"} plan_cycle={90} plan_daily_earning={4000} plan_amount={18000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={waltonbd_product6} handleClick={handleClick} plan_name={"Walton Plan 6"} plan_cycle={90} plan_daily_earning={4000} plan_amount={18000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[6] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={waltonbd_product7} handleClick={handleClick} plan_name={"Walton Plan 7"} plan_cycle={90} plan_daily_earning={12000} plan_amount={35000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={waltonbd_product7} handleClick={handleClick} plan_name={"Walton Plan 7"} plan_cycle={90} plan_daily_earning={12000} plan_amount={35000} plan_type={'Big Plan'} />
                            </span>
                        )}

                        {userDetails && (amountDetails.plan_state[7] === 0) ? (
                            <span className='pointer-events-none'>
                                <Card product_type={"long"} product_image={waltonbd_product8} handleClick={handleClick} plan_name={"Walton Plan 8"} plan_cycle={90} plan_daily_earning={25000} plan_amount={55000} plan_type={'Big Plan'} />
                            </span>
                        ) : (
                            <span>
                                <Card product_type={"long"} product_image={waltonbd_product8} handleClick={handleClick} plan_name={"Walton Plan 8"} plan_cycle={90} plan_daily_earning={25000} plan_amount={55000} plan_type={'Big Plan'} />
                            </span>
                        )} */}

                    </div>)}

                {currentVisible === 'short' && (
                    <div className={`grid grid-cols-2`}>
                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[6] === 0) ?
                            (
                                <span className='pointer-events-none'>
                                    <Card product_type={"short"} product_image={ubon_6} handleClick={handleClick} plan_name={"RTR 7"} plan_cycle={3} plan_daily_earning={230} plan_amount={410} plan_type={'Short Plan'} />
                                </span>
                            ) :
                            <span>
                                <Card product_type={"short"} product_image={ubon_6} handleClick={handleClick} plan_name={"RTR 7"} plan_cycle={3} plan_daily_earning={230} plan_amount={410} plan_type={'Short Plan'} />
                            </span>
                        }

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[7] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={ubon_7} handleClick={handleClick} plan_name={"RTR 8"} plan_cycle={4} plan_daily_earning={400} plan_amount={1100} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={ubon_7} handleClick={handleClick} plan_name={"RTR 8"} plan_cycle={4} plan_daily_earning={400} plan_amount={1100} plan_type={'Short Plan'} />
                            </span>
                            )}

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[8] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={ubon_8} handleClick={handleClick} plan_name={"RTR 9"} plan_cycle={3} plan_daily_earning={1200} plan_amount={3000} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={ubon_8} handleClick={handleClick} plan_name={"RTR 9"} plan_cycle={3} plan_daily_earning={1200} plan_amount={3000} plan_type={'Short Plan'} />
                            </span>
                            )}

                        {userDetails && (userDetails.boughtLong < 1 || amountDetails.plan_state[9] === 0) ?
                            (<span className='pointer-events-none'>
                                <Card product_type={"short"} product_image={ubon_9} handleClick={handleClick} plan_name={"RTR 10"} plan_cycle={3} plan_daily_earning={3200} plan_amount={8000} plan_type={'Short Plan'} />
                            </span>) :
                            (<span className=''>
                                <Card product_type={"short"} product_image={ubon_9} handleClick={handleClick} plan_name={"RTR 10"} plan_cycle={3} plan_daily_earning={3200} plan_amount={8000} plan_type={'Short Plan'} />
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
            <div className="fixed bottom-0 z-10 bg-orange-500 rounded-none text-white flex overflow-x-hidden  mx-auto mt-2 border-2 border-gray-100 w-full overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2">
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'>
                        <img src={homeNew} alt="online" className='w-8' />
                        <div>Home</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/team')}>
                        <img src={teamNew} alt="recharge" className='w-8' />
                        <div>Team</div>
                    </div>
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/company')}>
                        <img src={buildingNew} alt="app_dwd" className='w-8' />
                        <div>Company</div>
                    </div>


                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center' onClick={() => navigate('/mine')}>
                        <img src={paper_image} alt="invite" className='w-8' />
                        <div>My</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home