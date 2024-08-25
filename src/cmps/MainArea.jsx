/* eslint-disable react/prop-types */
import { logout ,getConnectedUsers ,getLoggedInUser} from '../services/user.service.js'
import { addNewMsg , getConversationById ,createNewConversation } from '../services/conversation.service.js'
import { useState , useEffect, useRef} from 'react';
import NewRoom from './NewRoom.jsx'
export default function MainArea({loggedInUser,setLoggedInUser}){

    const [selectedRoom,setSelectedRoom] = useState({id:"",type:"room",name:"Main",msgs:[]})
    const [connectedUsers,setConnectedUsers] = useState(null)
    const [isOpenModal,setIsOpenModal] = useState(false)


    const filteredUsers = connectedUsers? connectedUsers.filter(user => user !== loggedInUser.userName):null

    const [msg,setMsg] = useState("")

    const chatEndRef = useRef(null)
    const isFirstRender = useRef(true);



    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [selectedRoom])


    
    useEffect(()=>{
        const fetchUsers = async()=>{
            const users = await getConnectedUsers()
            setConnectedUsers(users)
        }
        fetchUsers()
        loadConversation('Main')
    },[])

    useEffect(() => {
        if(isFirstRender.current){
            isFirstRender.current=false
        }else{
            loadConversation(loggedInUser.conversations[loggedInUser.conversations.length-1].name)}
    }, [loggedInUser])




    async function updateUser(){
            const user = await getLoggedInUser( loggedInUser.userId )
            setLoggedInUser(user)
            sessionStorage.setItem('loggedInUser', JSON.stringify(user))
        }
    
    async function send(){
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===selectedRoom.name)
        const {msgs} = await addNewMsg(selectedConversation.id,msg,loggedInUser.userName)
        setSelectedRoom({...selectedRoom,msgs})
        setMsg("")
    }catch(err){
        console.log('Error during sending new msg:', err)     
      }
    }

    

    async function loadConversation(conversationName) {
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===conversationName)
        const conversation = selectedConversation._id? await getConversationById(selectedConversation.id) : selectedConversation      
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
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation.id} 
                        onClick={()=>loadConversation(conversation.name)}
                        className={conversation.name===selectedRoom.name?"active" : ""}>{conversation.name}</li>)}
                        <div ref={chatEndRef}></div>

                    </div>
                    <label>Connected users</label>
                    <div className='users-area'>
                    {filteredUsers && filteredUsers.map(user=><li key={user} 
                        onClick={async()=>{
                            await createNewConversation({type:'private',name:`${loggedInUser.userName} - ${user}`,username:`${loggedInUser.userName}`},[user])
                           updateUser() 
                        }}
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
            {isOpenModal && <NewRoom connectedUsers={connectedUsers} setIsOpenModal={setIsOpenModal} loggedInUser={loggedInUser} updateUser={updateUser}/>}
        </section>
    )
}
