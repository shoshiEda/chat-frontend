import axios from 'axios'

const url = 'http://127.0.0.1:8000/conversation'

export const sendNewMsg = async(conversationId,username,msg)=>{
    try{
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
      };

      const { data } = await axios.post(`${url}/msg/${conversationId}`, { username, msg }, { headers });
              console.log(data)
        if(data.status==='success') return 'success'
     }catch(err){
        console.log('Error during sending msg:', err)
     }}

export const getConversationById = async(conversationId)=>{
   try{
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
      };

      const { data } = await axios.get(`${url}/${conversationId}`, { headers });
        if(data.conversation) return data.conversation
     }catch(err){
        console.log('Error during getting conversation by Id:', err)
     }
}