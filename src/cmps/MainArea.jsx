/* eslint-disable react/prop-types */
import { logout ,getConnectedUsers} from '../services/user.service.js'
import { useState , useEffect } from 'react';
export default function MainArea({loggedInUser,setLoggedInUser}){

    const [selectedRoom,setSelectedRoom] = useState({type:"room",name:"Main"})
    const [connectedUsers,setConnectedUsers] = useState(null)

    const filteredUsers = connectedUsers? connectedUsers.filter(user => user !== loggedInUser.userName):null

    const [msg,setMsg] = useState("")


    
    useEffect(()=>{
        const fetchUsers = async()=>{
            const users = await getConnectedUsers()
            setConnectedUsers(users)
        }
        fetchUsers()
    },[])
    
    function send(){
        console.log(msg)
    }
    
    async function logingOut(userId){
        try{
        const resp = await logout(userId)
        if(resp==='success')    setLoggedInUser(null)
        }catch(err){
            console.log('Error during logout:', err);     
          }
    }
    console.log(loggedInUser)
    {!loggedInUser && <div>Loading...</div>}
    return(
        <section className="chat-page">
            <div className="header">
                <h1>hello {loggedInUser.userName}</h1>
                <button onClick={()=>logingOut(loggedInUser.userId)}>Log out</button>
            </div>
            <div className='windows'>
                <div className='msg-area'></div>
                <div className='right-side'>
                    <label>Rooms</label>
                    <div className='rooms-area'>
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation._id} 
                        onClick={()=>setSelectedRoom({type:"room",name:conversation.name})}
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
                to:<span className='to'>{selectedRoom.name}</span>
                <br/>
                <input type="text" onChange={(e)=>setMsg(e.target.value)}/>
                <button onClick={send}>send</button>
            </div>
       
        </section>
    )
}
