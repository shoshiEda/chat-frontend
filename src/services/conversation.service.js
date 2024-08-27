import axios from 'axios'
import { io } from 'socket.io-client'

const url = 'http://127.0.0.1:8000/conversation'

const socket = io.connect('http://127.0.0.1:8000')


export const addNewMsg = async(conversationId,msg,username)=>{
try{
    const resp = await axios.post(url+`/msg/${conversationId}`,{msg,username})
    socket.emit("send-msg",{conversationId,msg,username})
        return {msgs:resp.data.msgs}
}catch(err){
    console.log('Error during adding msg:', err)
    if(err.request.status===401 || err.response.data || err.response.data.error)
        return({error:err.response.data.error})
    }
}

export const getConversationById = async(conversationId)=>{
    try{
    const {data} = await axios.get(url+`/${conversationId}`)
    if(data)  return data
}catch(err){
    console.log('Error during getting conversation:', err)
    if(err.request.status===401 || err.response.data || err.response.data.error)
        return({error:err.response.data.error})
    }
}

export const createNewConversation = async({type,name,username},users=[])=>{
    try{
        const {data} = await axios.post(url,{type,name,username})
        if(users.length)
        {
            users.map(user=>joinToConversation(user,data.newConversation))
        }
        if(data.newConversation)  return data.newConversation
    }catch(err){
        console.log('Error during creating a new conversation:', err)
    }
}

export const joinToConversation = (user,newConversation)=>{
    try{
        axios.post(url+`/user/${newConversation._id}/${user}`)
    }catch(err){
        console.log('Error during creating a new conversation:', err)
    }
}