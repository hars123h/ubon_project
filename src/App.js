import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home'
import Company from './components/Company';
import Team from './components/Team';
import Mine from './components/Mine';
import Recharge from './components/Recharge';
import Invite from './components/Invite';
import Record from './components/Record';
import Project from './components/Project';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Fallback from './components/Fallback';
import Withdrawal from './components/Withdrawal';
import Settings from './components/Settings';
import Bank from './components/Bank';
import ChangeLoginPassword from './components/ChangeLoginPassword';
import ChangeWithdrawalPassword from './components/ChangeWithdrawalPassword';
import RechargeWindow from './components/RechargeWindow';
import Approval from './components/Approval';
import WithdrawalApproval from './components/WithdrawalApproval';
import RegisterInvite from './components/RegisterInvite';
import Withdrawals from './components/Withdrawals';
import User from './components/User';
import Transactions from './components/Transactions';
import Access from './components/Access';
import Feedback from './components/Feedback';
import AmountSetup from './components/AmountSetup';
import DashboardLogin from './components/DashboardLogin';
import AdminLogout from './components/AdminLogout';
import ClientFeedback from './components/ClientFeedback';
import UserDetails from './components/UserDetails';
import { createContext, useEffect, useState, useLayoutEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import db from './firebase/config';


export const AmountContext = createContext();

function App() {

  const [amounts, setAmounsts] = useState({});

  useLayoutEffect(() => {
    getData();
  }, [])

  const getData =async()=> {
    
      //console.log('hello');
      const dataRes = await getDoc(doc(db, 'amounts', 'wgx5GRblXXwhlmx4XYok'));
      if (dataRes.exists()) {
        //console.log(dataRes.data());
        setAmounsts(dataRes.data());
      }
    
  }

  return (
    <AmountContext.Provider value={amounts}>
      <div className="app relative">
        <Routes>
          <Route path="/" element={<Fallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/invite_code/:invite_code" element={<RegisterInvite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/team" element={<Team />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/record" element={<Record />} />
          <Route path="/project" element={<Project />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/user_feedback" element={<ClientFeedback />} />
          <Route path="/change_login_password" element={< ChangeLoginPassword />} />
          <Route path="/change_withdrawal_password" element={< ChangeWithdrawalPassword />} />
          <Route path="/recharge_window/:recharge_value" element={<RechargeWindow />} />
          <Route path="/recharge_approval" element={<Approval />} />
          <Route path="/withdrawal_approval" element={<WithdrawalApproval />} />
          <Route path="/admin/Login" element={<DashboardLogin />} />
          <Route path="/admin/Dashboard" element={<Dashboard />} />
          <Route path="/admin/Withdrawals" element={<Withdrawals />} />
          <Route path="/admin/Amount Setup" element={<AmountSetup />} />
          <Route path="/admin/User" element={<User />} />
          <Route path="/admin/Transactions" element={<Transactions />} />
          <Route path="/admin/Access" element={<Access />} />
          <Route path="/admin/Feedback" element={<Feedback />} />
          <Route path="/admin/Logout" element={<AdminLogout />} />
          <Route path="/admin/user_details" element={<UserDetails />} />
        </Routes>
        <ToastContainer />
        
      </div>
    </AmountContext.Provider>
  );
}

export default App;
