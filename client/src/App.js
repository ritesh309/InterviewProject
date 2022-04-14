import React from 'react'
import './App.css'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Pricing from './components/pages/Pricing'
import TableData from './components/TableData'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/table" element={<TableData />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/price" element={<Pricing />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App