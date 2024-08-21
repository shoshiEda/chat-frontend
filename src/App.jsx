import { useState } from 'react'

import  MainArea  from './cmps/MainArea'
import  LoginPage  from './cmps/LoginPage'
import './assets/main.css'

function App() {
  
  const [loggedInUser,setLoggedInUser] = useState((JSON.parse(localStorage.getItem('loggedInUser'))) || null)


  return (
    <>
    {loggedInUser? <MainArea loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />  :<LoginPage setLoggedInUser={setLoggedInUser} />}
    </>
  )
}

export default App
