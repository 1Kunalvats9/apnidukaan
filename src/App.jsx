import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Register from "../pages/Register"
import { ToastContainer } from 'react-toastify';
import Cart from "../pages/Cart"

function App() {

  return (
    <BrowserRouter>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}       
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
