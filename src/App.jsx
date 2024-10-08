import { useState , useEffect} from 'react'

import  MainArea  from './cmps/MainArea'
import  LoginPage  from './cmps/LoginPage'
import './assets/main.css'

function App() {
  
  const [loggedInUser,setLoggedInUser] = useState((JSON.parse(sessionStorage.getItem('loggedInUser'))) || null)
  const [isComputer,setIsComputer] = useState(true)

useEffect(()=>checkDevice(),[])

  function checkDevice()
{
   if(window.matchMedia("(pointer: coarse)").matches) {
       setIsComputer(false)
        }   
    
}


  return(
    <>
    {loggedInUser?(
        <MainArea loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} isComputer={isComputer}/>
      ) : (
        <LoginPage setLoggedInUser={setLoggedInUser} />
      )}
    </>
  )
}

export default App
