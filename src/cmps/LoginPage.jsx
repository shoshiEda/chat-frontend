/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import {login,signup} from '../services/user.service.js'

export default function LoginPage({setLoggedInUser}){

const [isLogin,setIsLogin] = useState(true)
const [showPassword,setShowPassword] = useState(false)
const [isError,setIsError] = useState(false)
const [isErrorMsg,setIsErrorMsg] = useState("")
const [user,setUser] = useState({username:"",password:""})


async function loginSighup(){
    if(!user.username && !user.password) 
        {
            setIsError(true)
            setIsErrorMsg("username and password are required")
            return
        }
    if(isLogin) 
        {
        const resp = await login(user.username,user.password) 
        if(resp.error)
            {
            setIsError(true)
            setIsErrorMsg(resp.error)
            }
        if(resp.loggedInUser)
            setLoggedInUser(resp.loggedInUser)
         }
    else{
        const resp = await signup(user.username,user.password)
        console.log(resp)
        if(resp.loggedInUser)
            setLoggedInUser(resp.loggedInUser)
        if(resp.error)
            {
            setIsError(true)
            setIsErrorMsg(resp.error)
            }
        }         
}


return(
    <section className="login-bg">
        <div className="login-page">
            <h1>Welcome to our chat</h1>
            {isError && <p className="login-error">{isErrorMsg}</p>}
             username:<input type="text" placeholder="username" onChange={(ev)=>setUser({...user,username:ev.target.value})}/>
            <br/>
            password:<input type={showPassword ? "text" : "password"}  placeholder="password" onChange={(ev)=>setUser({...user,password:ev.target.value})}/>   
            <br/>
            <input type="checkbox" checked={showPassword} onChange={()=>setShowPassword(!showPassword)} /> Show password
            <br/>
            <button className="login-signup-btn" onClick={()=>setIsLogin(!isLogin)}> {isLogin? "not registered? create new account" : "already hava an account? login"} </button>
            <br/>
            <button onClick={loginSighup}>{isLogin? "Login" : "Signup"}</button>
        </div>
    </section>
)}


