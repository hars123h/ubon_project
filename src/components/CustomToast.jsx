import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const CustomToast = ({text, duration}) => {

 const [showText, setShowText] = useState(false);
 
 useEffect(()=>{
    setTimeout(()=>{
        setShowText(true);
    },duration);
 },[])

  return (
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
         <div className='flex gap-2 bg-black opacity-80 text-white px-2 py-1 rounded-md'>
            <div>{text}</div>
        </div>
    </div>
  )
}

export default CustomToast