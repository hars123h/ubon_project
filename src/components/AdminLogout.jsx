import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminLogout = () => {
    const navigate = useNavigate();
    useEffect(()=>{
      
      if(localStorage.getItem('name')===null) {
        navigate('/admin/Login');
      }
        localStorage.clear();
        navigate('/admin/Login');
    })

  return (
    <div>AdminLogout</div>
  )
}

export default AdminLogout