import { useState } from 'react'

import './App.css'
import axios from 'axios'
import Header from './components/Header'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Browse from './pages/Browse'
import MyGenres from './pages/MyGenres/MyGenres'
import Recommendations from './pages/Recommendations'
import OverView from './pages/Overview'
import Login from './pages/Login'
import Register from './pages/Register'
//http://www.omdbapi.com/?t=${movie}&apikey=bc1d472
function App() {

  return (
    <>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/browse' exact element={<Browse/>}/>
        <Route path="/mygenres" exact element={<MyGenres/>}/>
        <Route path="/recommendations" exact element={<Recommendations/>}/>
        <Route path="/overview" exact element={<OverView/>}/>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="/register" exact element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
