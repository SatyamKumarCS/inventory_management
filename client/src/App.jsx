import React from 'react'
import './App.css'
import Login from './pages/Login/page'
import SignUp from './pages/Sign-up/page'
import Dashboard from './pages/Dashboard/page'
import ForgetPassword from './pages/Forget-Password/ForgetPassword/page'
import SetPassword  from './pages/Forget-Password/SetPassword/page'
import VerifyCode from './pages/Forget-Password/VerifyCode/page'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/dashboard" element={<Dashboard />}/>
    <Route path="/forget" element={<ForgetPassword/>}/>
    <Route path="/verify" element={<VerifyCode/>}/>
    <Route path="/setPassword" element={<SetPassword/>}/>
  </Routes>
  )
}

export default App
