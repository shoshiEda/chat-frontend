import axios from 'axios'
import * as jwt from 'jwt-decode'


const url = 'http://127.0.0.1:8000/user'

export const login = async(username,password)=>{
    try{

        
        const response = await axios.post(url + '/login', { username, password })
        if(response.data.success){
            const token = response.data.token
            const decodedToken = jwt.jwtDecode(token)
            localStorage.setItem('loggedInUser', JSON.stringify(decodedToken));
            localStorage.setItem('token',token)
            return {loggedInUser:decodedToken}
        }
    }catch(err){
        console.log('Error during login:', err)
        if(err.request.status===401 || err.response.data || err.response.data.error)
            return({error:err.response.data.error})
        }
}

export const signup = async(username,password)=>{
    try{
        const user = { username,password }
        const response = await axios.post(url + '/signup', user)
          
          if(response.data.success){
          const token = response.data.token
          const decodedToken = jwt.jwtDecode(token)
          localStorage.setItem('loggedInUser', JSON.stringify(decodedToken));
          localStorage.setItem('token',token)
          return {loggedInUser:decodedToken}
          }
      }catch(err){
        console.log('Error during signup:', err)
        if(err.request.status===401 || err.response.data || err.response.data.error)
            return({error:err.response.data.error})
        }        }


export const logout = async(userId)=>{ 
    try{
    const {data} = await axios.post(url + '/logout', { userId })
    if(data.status==='success'){
        localStorage.removeItem('loggedInUser')
        localStorage.removeItem('token')
        return 'success'
    }
}catch(err){
    console.log('Error during logout:', err);     
  }
}

export const getConnectedUsers = async()=>{
    try{
        const {data} = await axios.get(url)
        if(data.users && data.users.length){
            return data.users
        }
    }catch(err){
        console.log('Error during logout:', err);     
      }
}





