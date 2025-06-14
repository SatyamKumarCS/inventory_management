import React from 'react'
import './App.css'
import Login from './pages/Login/page'
import SignUp from './pages/Sign-up/page'
import Dashboard from './pages/Dashboard/page'
import ForgetPassword from './pages/Forget-Password/ForgetPassword/page'
import SetPassword  from './pages/Forget-Password/SetPassword/page'
import VerifyCode from './pages/Forget-Password/VerifyCode/page'
import { Route, Routes } from 'react-router-dom'
import ItemMaster from './pages/ItemMaster/page'
import AddItem from './pages/ItemMaster/Add-Item/page'
import Customer from './pages/Customers/page'
import  ManageStore from './pages/Manage-Store/page'
import Order from './pages/Orders/page'
import Report from './pages/Reports/page'
import Supplier from './pages/Suppliers/page'
import Inventory from './pages/Inventory/page'

function App() {

  return (
    <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/dashboard" element={<Dashboard />}/>
    <Route path="/forget" element={<ForgetPassword/>}/>
    <Route path="/verify" element={<VerifyCode/>}/>
    <Route path="/setPassword" element={<SetPassword/>}/>
    <Route path="/ItemMaster" element={<ItemMaster/>}/>
    <Route path="/ItemMaster/additem" element={<AddItem/>}/>
    <Route path="/Inventory" element={<Inventory/>}/>
    <Route path="/Customer" element={<Customer/>}/>
    <Route path="/Manage_Store" element={< ManageStore/>}/>
    <Route path="/Order" element={<Order/>}/>
    <Route path="/Reports" element={<Report/>}/>
    <Route path="/Supplier" element={<Supplier/>}/>
  </Routes>
  )
}

export default App
