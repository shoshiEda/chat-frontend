import axios from 'axios'


const url = 'http://127.0.0.1:8000/conversation'

export const addNewMsg = async(conversationId,msg,username)=>{
try{
    const resp = await axios.post(url+`/msg/${conversationId}`,{msg,username})
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
        console.log(data.newConversation)
        if(users.length)
        {
            users.map(user=>joinToConversation(user))
        }
        if(data.newConversation)  return data.newConversation
    }catch(err){
        console.log('Error during creating a new conversation:', err)
    }
}

export const joinToConversation = (user)=>{}