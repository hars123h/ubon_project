import React from 'react';
import user_img from '../images/user_img.png';
import lock_img from '../images/lock_img.png';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { collection, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import db from '../firebase/config';
import { RotatingLines } from 'react-loader-spinner';
import apache_logo from '../images/apache_logo.png';



const Login = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const [mobno, setmobno] = useState('');
    const [pwd, setpwd] = useState('');
    const [bloackedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('Loading');
    const [toasterShow, setToasterShow] = useState(false);
    const [toasterText, setToasterText] = useState('');

    const toaster = (text) => {
        setToasterText(text);
        setToasterShow(true);
        setTimeout(()=>{
            setToasterShow(false);
        },5000);
    }


    useEffect(() => {
        console.log(serverTimestamp());
        getBlockedUsers();
    }, []);

    const getBlockedUsers = async () => {
        const dataRes = await getDocs(collection(db, 'blockedUsers'));
        var temp = [];
        dataRes.forEach((doc) => {
            //console.log(doc.data());
            temp.push(doc.data().mobileNumber);
            setBlockedUsers(temp);
        });
    }

    const handleSignIn = () => {
        if (bloackedUsers.includes(String(mobno))) {
            toaster('You are blocked by the administrator!');
            return;
        }
        setLoading(true);
        setText('Loading')
        const new_mobno = mobno + '@gmail.com';
        signInWithEmailAndPassword(auth, new_mobno, pwd)
            .then((userCredential) => {
                localStorage.setItem('uid',userCredential.user.uid);
                setText('Login Successful!');
                setTimeout(() => {
                    navigate('/home');
                    setLoading(false);
                }, 1000);
            })
            .catch(error => {
                console.log(error.message, error.code);
                setText('Something went wrong!');
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }

    return (
        <div className='relative h-screen'>
            {toasterShow?<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
                    <div>{toasterText}</div>
                </div>
            </div>:null}
            {loading ? <div className='flex gap-2 bg-black text-white py-2 px-2  rounded-md opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                {text==='Loading' ? <div>
                    <RotatingLines strokeColor='white' width='20' />
                </div> : null}
                <div className='text-sm'>{text}</div>
            </div> : null}
            <div className='text-center'>
                <img src={apache_logo} alt="hp_logo" className='m-auto md:w-2/6 sm:w-1/6 my-0' width={300} />
            </div>
            <div className='flex flex-col m-auto w-3/5'>
                <div className=" items-center mb-3 p-2 phoneno flex  bg-[#f1f1f1] rounded-md border-2 border-gray-200">
                    <img src={user_img} alt="user" className='h-5 border-r-2 pr-2 border-solid border-gray-300' />
                    <input value={mobno} onChange={(e) => setmobno(e.target.value)} type="text" placeholder='Phone number' name="phone_no" id="phone_no" className='pl-1 bg-[#f1f1f1]  outline-none overflow-x-scroll' />
                </div>

                <div className=" items-center p-2 passowrd flex  bg-[#f1f1f1] rounded-md border-2 border-gray-200">
                    <img src={lock_img} alt="user" className='h-5 border-r-2 pr-2 border-solid border-gray-300' />
                    <input value={pwd} onChange={(e) => setpwd(e.target.value)} type="password" placeholder='Login password' name="password" id="pwrd" className='pl-1 bg-[#f1f1f1] outline-none overflow-x-scroll' />
                </div>
                {/*[#0096D5] */}
                <div className='mt-16'>
                    <button onClick={handleSignIn} className='bg-orange-500 w-full pt-2 pb-2 text-lg text-white rounded-md shadow-md shadow-orange-400
                    '>Login</button>
                </div>
                {/*[#379EFE] */}
                <div className="options flex justify-between mt-2">
                    <div className='text-orange-500 cursor-pointer' onClick={() => navigate('/register')}>Register</div>
                    <div className='cursor-pointer text-orange-500 ' onClick={() => navigate('/forgot')}>Forget password?</div>
                </div>

            </div>
        </div>
    )
}

export default Login