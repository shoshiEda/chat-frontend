/* eslint-disable react/prop-types */
import { logout ,getConnectedUsers , getloggedInUserById} from '../services/user.service.js'
import { sendNewMsg , getConversationById } from '../services/conversation.service.js'
import { useState , useEffect } from 'react';
export default function MainArea({loggedInUser,setLoggedInUser}){

const [selectedRoom, setSelectedRoom] = useState({_id:"",name:"",type:""})

    const [connectedUsers,setConnectedUsers] = useState(null)

    const filteredUsers = connectedUsers? connectedUsers.filter(user => user !== loggedInUser.userName):null

    const [msg,setMsg] = useState("")

    console.log(selectedRoom)

    
    useEffect(()=>{
        const fetchUsers = async()=>{
            const users = await getConnectedUsers()
            setConnectedUsers(users)
        }
        fetchUsers()
    },[])
    
    async function send(){
        const status = await sendNewMsg(selectedRoom._id,loggedInUser.userName,msg)
        if(status==='success') {
            const user = await getloggedInUserById(loggedInUser._id)
            setLoggedInUser(user)
    }}
    
    async function logingOut(userId){
        try{
        const resp = await logout(userId)
        if(resp==='success')    setLoggedInUser(null)
        }catch(err){
            console.log('Error during logout:', err);     
          }
    }

    async function loadSelectedRoom(conversationId) {
        try{
            console.log(conversationId)
        const conversation = await getConversationById(conversationId)
        if(conversation) setSelectedRoom(conversation)
        }catch(err){
            console.log('Error during logout:', err);     
          }
    }
    {!loggedInUser && <div>Loading...</div>}
    return(
        <section className="chat-page">
            <div className="header">
                <h1>hello {loggedInUser.userName}</h1>
                <button onClick={()=>logingOut(loggedInUser.userId)}>Log out</button>
            </div>
            <div className='windows'>
                <div className='msg-area'>
                    {selectedRoom && selectedRoom.msgs && selectedRoom.msgs.length &&
                    selectedRoom.msgs.map((msg,idx)=><li key={idx}> <p>{msg.username}:</p><p>{msg.msg}</p></li>)
                    }
                </div>
                <div className='right-side'>
                    <label>Rooms</label>
                    <div className='rooms-area'>
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation._id} 
                        onClick={()=>loadSelectedRoom(conversation._id)}
                        className={conversation.name===selectedRoom.name?"active" : ""}>{conversation.name}</li>)}
                    </div>
                    <label>Connected users</label>
                    <div className='users-area'>
                    {filteredUsers && filteredUsers.map(user=><li key={user} 
                        onClick={()=>setSelectedRoom({type:"user",name:user})}
                        className={user===selectedRoom.name?"active" : ""}>{user}</li>)}
                        </div>
                    </div>
            </div>
            <div className='sending-msg-area'>
                to:<span className='to'>{ selectedRoom.name}</span>
                <br/>
                <input type="text" onChange={(e)=>setMsg(e.target.value)}/>
                <button onClick={send}>send</button>
            </div>
       
        </section>
    )
}
