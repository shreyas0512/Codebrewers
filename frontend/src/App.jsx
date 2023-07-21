
import React from 'react'
import Login from './components/Login'
import {BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Mode from './components/Mode'
import Contest from './components/Contest'

function App() {
  return (
    <div className='h-screen w-screen flex flex-col items-center'>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/mode-select' element={<Mode/>} />
          <Route path ='mode-select/contest' element={<Contest/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App