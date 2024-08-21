import { useState , useEffect } from 'react'

import  MainArea  from './cmps/MainArea'
import  LoginPage  from './cmps/LoginPage'
import './assets/main.css'

function App() {
  
  const [loggedInUser,setLoggedInUser] = useState((JSON.parse(sessionStorage.getItem('loggedInUser'))) || null)
  
  useEffect(() => {
    if (loggedInUser) {
      sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    } else {
      sessionStorage.removeItem('loggedInUser')
    }
  }, [loggedInUser])

  return (
    <>
    {loggedInUser? <MainArea loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />  :<LoginPage setLoggedInUser={setLoggedInUser} />}
    </>
  )
}

export default App
