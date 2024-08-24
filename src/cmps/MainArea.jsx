/* eslint-disable react/prop-types */
import { logout ,getConnectedUsers ,getLoggedInUser} from '../services/user.service.js'
import { addNewMsg , getConversationById } from '../services/conversation.service.js'
import { useState , useEffect, useRef} from 'react';
import NewRoom from './NewRoom.jsx'
export default function MainArea({loggedInUser,setLoggedInUser}){

    const [selectedRoom,setSelectedRoom] = useState({id:"",type:"room",name:"Main",msgs:[]})
    const [connectedUsers,setConnectedUsers] = useState(null)
    const [isOpenModal,setIsOpenModal] = useState(false)
    const firstRender = useRef(true)

    console.log(selectedRoom)



    const filteredUsers = connectedUsers? connectedUsers.filter(user => user !== loggedInUser.userName):null

    const [msg,setMsg] = useState("")

    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedRoom])


    
    useEffect(()=>{
        const fetchUsers = async()=>{
            const users = await getConnectedUsers()
            setConnectedUsers(users)
        }
        fetchUsers()
        loadConversation('Main')
    },[])

    useEffect(()=>{
        const fetchUser = async()=>{
            const user = await getLoggedInUser(loggedInUser._id)
            setLoggedInUser(user)
        }
        if (firstRender.current) {
            firstRender.current = false;
        } else
        if(!isOpenModal){
         fetchUser()
         loadConversation(loggedInUser.conversations[loggedInUser.conversations.length-1].name)
        }
    },[isOpenModal])
    
    async function send(){
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===selectedRoom.name)
        console.log(selectedConversation)
        const {msgs} = await addNewMsg(selectedConversation.id,msg,loggedInUser.userName)
        console.log(msgs)
        setSelectedRoom({...selectedRoom,msgs})
        setMsg("")
    }catch(err){
        console.log('Error during sending new msg:', err)     
      }
    }

    

    async function loadConversation(conversationName) {
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===conversationName)
        console.log(loggedInUser.conversations,selectedConversation)
        const conversation = await getConversationById(selectedConversation.id)
        console.log(conversation)
        if(conversation)
        {
            setSelectedRoom({id: selectedConversation.id,type:conversation.type,name:conversationName,msgs:conversation.msgs || []})
            return conversation
        }
    }catch(err){
        console.log('Error during load conversation:', err);     
      }
    }
    
    async function logingOut(userId){
        try{
        const resp = await logout(userId)
        if(resp==='success')    setLoggedInUser(null)
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
            <button className='create-new-room' onClick={()=>setIsOpenModal(true)}>Create new room</button>

            <div className='windows'>
                <div className='msg-area'>
                {selectedRoom.msgs.length>0 && selectedRoom.msgs.slice().reverse().map((msg,idx)=>
                    <li key={idx}
                    className={(msg.username===loggedInUser.userName)?'me':'others'}
                    ><p style={{color:(msg.username===loggedInUser.userName)?'Green':'Purple'}}>{(msg.username===loggedInUser.userName)? 'you' :msg.username}:</p><p>{msg.msg}</p></li>
                )}
                <div ref={chatEndRef}></div>
                </div>
                <div className='right-side'>
                    <label>Rooms</label>
                    <div className='rooms-area'>
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation._id} 
                        onClick={()=>loadConversation(conversation.name)}
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
                <input type="text" onChange={(e)=>setMsg(e.target.value)} value={msg}/>
                <button onClick={send}>send</button>
            </div>
            {isOpenModal && <NewRoom connectedUsers={connectedUsers} setIsOpenModal={setIsOpenModal} loggedInUser={loggedInUser}/>}
        </section>
    )
}
