import React from 'react'
import './App.css'
import Login from './pages/Login/page'
import SignUp from './pages/Sign-up/page'
import Dashboard from './pages/Dashboard/page'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/dashboard" element={<Dashboard />}/>
  </Routes>
  )
}

export default App
