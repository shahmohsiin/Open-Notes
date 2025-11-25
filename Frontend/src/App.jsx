import React from 'react'
import NotesPage from './components/NotesPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import ProtectedRoute from './protection/ProtectedRoute'
import "../src/App.css"

function App() {
const token = localStorage.getItem("token")
const url = import.meta.env.VITE_SERVER_API

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/login' element={<Login  url={url}/>}/>
    <Route path='/'element={<ProtectedRoute><NotesPage url={url}/></ProtectedRoute>} />
    
   </Routes>
   </BrowserRouter>
  )
}

export default App