import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem } from '@material-ui/core'
import db from '../firebase/config.js';
import { addDoc, doc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify';

const ClientFeedback = () => {

    const navigate = useNavigate();
    const [details, setDetails] = useState({
        mobileNumber: '',
        type: 'Complaint',
        description: '',
        date: ''
    });
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

    const handleSubmit = async () => {

        if (details.mobileNumber.length > 0 &&  details.description.length > 0 && details.date.length > 0) {
            const response = await addDoc(collection(db, '/feedback'), details)
                .then((response) => {toaster('Feedback sent successfully!')})
                .catch(error => toaster('Something went wrong'));
        } else {
            toaster('Enter Details First!');
        }

        //console.log(details);

    }
//[#2e9afe]
    return (
        <div className=' bg-orange-500 h-screen flex flex-col text-white font-light p-5 relative'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            <div className="top p-3 cursor-pointer flex">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(-1)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <div className='text-center flex-grow font-semibold text-xl'>
                    Feedback
                </div>
            </div>

            <div className='detials_box flex flex-col gap-8 mt-10 mb-10'>
                <input placeholder='Mobile Number' type="text" onChange={e => setDetails({ ...details, mobileNumber: e.target.value })} className="bg-inherit border-b-2 border-white placeholder:text-white outline-none" />
                <input placeholder='Description' type="text" onChange={e => setDetails({ ...details, description: e.target.value })} className="bg-inherit border-b-2 placeholder:text-white outline-none border-white" />
                <input placeholder='Date' type="date" onChange={e => setDetails({ ...details, date: e.target.value })} className="bg-inherit border-b-2  border-white outline-none" />
            </div>

            <div className="flex justify-center items-center">
                <Button className='w-1/5' variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    )
}

export default ClientFeedback