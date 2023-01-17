import { Typography, Box, TextField, InputAdornment, Button } from '@material-ui/core'
import { Mail, VpnKey } from '@material-ui/icons'
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import db from '../firebase/config';

const DashboardLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async() => {
        const data = await getDocs(query(collection(db,'controllers'), where('email','==',email), where('password','==', password)));
        if(data.size===1) {
            data.forEach((doc)=>{
                localStorage.setItem('name',doc.data().name);
                localStorage.setItem('email',doc.data().email);
                localStorage.setItem('password',doc.data().passoword);
                localStorage.setItem('access',doc.data().access);
            });
            //console.log(localStorage);
            navigate('/admin/Dashboard');
        }else {
            toast('Invalid Email/Password!');
        }
    }

    return (
        <Box>
            <Box className="text-white bg-[#1e3a8a] p-4 shadow-lg">
                <Typography variant='h6'>Authentication</Typography>
            </Box>

            <Box className='flex flex-col w-2/6 mx-auto gap-4 mt-36'>
                <TextField onChange={e=>setEmail(e.target.value)} label="Email Address*" variant='outlined' InputProps={
                    {
                        endAdornment:
                            <InputAdornment>
                                <Mail />
                            </InputAdornment>
                    }

                } />
                <TextField onChange={e=>setPassword(e.target.value)} label="Password*" variant='outlined' type="password" InputProps={
                    {
                        endAdornment:
                            <InputAdornment>
                                <VpnKey />
                            </InputAdornment>
                    }

                } />
                <Typography color="textSecondary" className='text-xs mt-4'>Forgot Password?</Typography>
                <Button onClick={handleSubmit} variant="contained" color="primary" className=" w-1/5">Submit</Button>
            </Box>
        </Box>
    )
}

export default DashboardLogin