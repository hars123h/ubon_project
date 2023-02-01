import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useState, useLayoutEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import { useContext } from 'react';
import { AmountContext } from '../App';
import axios from 'axios';
import BASE_URL from '../api_url';

//#df1f26
const Invite = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const amountDetails = useContext(AmountContext);
    const [cb, setCb] = useState({
        value: '',
        copied: false
    });
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

    const getUserDetails = async () => {
        const details = await axios.post(`${BASE_URL}/get_user`, {user_id:localStorage.getItem('uid')})
        .then(({data})=>data);
        setUserDetails(details);
    }

    useLayoutEffect(() => {
        getUserDetails();
        setLoading(false);
    }, []);

    if (loading || userDetails === null) {
        return (
            <div className='h-screen grid place-items-center'>
                <div>Loading...</div>
            </div>
        )
    }
//[#2e9afe]
    return (
        <div className=' bg-red-500 h-[1000px] flex flex-col text-white font-light p-5 relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="top p-3 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </div>

            <p className='p-3 text-xs break-words'>
            https://www.amazfit44.tech/register/invite_code/{userDetails.user_invite}
            </p>

            <div className='p-3 font-bold cursor-pointer'>
                <CopyToClipboard text={`https://www.amazfit44.tech/register/invite_code/${userDetails.user_invite}`} onCopy={() => toaster('Copied to clipboard')}>
                    <span>Invite Link: click to copy</span>
                </CopyToClipboard>
            </div>

            <div className="invitation flex p-3">
                <div className='font-bold'>Invitation code: {userDetails.user_invite}</div>
                <CopyToClipboard text={userDetails.user_invite} onCopy={() => toaster('Copied to clipboard')}>
                    <span className='ml-2'>Copy code</span>
                </CopyToClipboard>
            </div>

            <div className="qr mx-auto flex justify-center items-center">
                <QRCode
                    size={120}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`https://www.amazfit44.tech/register/invite_code/${userDetails.user_invite}`}
                    viewBox={`0 0 120 120`}
                />
            </div>

            <div className="info p-3 sm:text-xs md:text-md">
                Invitation rewards: Welcome to use the APP, invite new friends to join, you can get very high invitation rewards, and you can quickly withdraw cash to your bank account every day. APP is the safest, most popular and most profitable APP in 2023, dedicated to benefiting all mankind and promoting it globally. Invite new friends to join and you will get the following different invitation rewards:
                <br />
                Level 1, {amountDetails.level1_percent}%
                <br />
                Level 2, {amountDetails.level2_percent}%
                <br />
                Level 3, {amountDetails.level3_percent}%
            </div>

        </div>
    )
}

export default Invite