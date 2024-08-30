/* eslint-disable react/prop-types */
import { logout ,getConnectedUsers ,getLoggedInUser} from '../services/user.service.js'
import { addNewMsg , getConversationById ,createNewConversation } from '../services/conversation.service.js'
import { useState , useEffect, useRef} from 'react';
import NewRoom from './NewRoom.jsx'
import { io } from 'socket.io-client'


export default function MainArea({loggedInUser,setLoggedInUser}){



    const [selectedRoom,setSelectedRoom] = useState({id:"",type:"public",name:"Main",msgs:[]})
    const [connectedUsers,setConnectedUsers] = useState(null)
    const [isOpenModal,setIsOpenModal] = useState(false)
    const [isOpenMsg,setIsOpenMsg] = useState(false)
    const [modalMsg,setmodalMsg] = useState({msg:"",room:""})
    const [socketConnected, setSocketConnected] = useState(false);



    const filteredUsers = connectedUsers? connectedUsers.filter(user => user !== loggedInUser.userName):null

    const [msg,setMsg] = useState("")

    const chatEndRef = useRef(null)
    const chatEndRef2 = useRef(null)
    const isFirstRender = useRef(true)

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
          const newSocket = io('http://localhost:8000');
      
          newSocket.on('connect', () => {
            setSocket(newSocket)
            setSocketConnected(true)
          })
      
          newSocket.on('disconnect', () => {
            setSocketConnected(false);
          });
      
          return () => {
            newSocket.disconnect();
          };
        }
      }, [loggedInUser]);

      useEffect(() => {
        if (socketConnected && !isFirstRender.current && loggedInUser) {
          isFirstRender.current = false;
          const lastConversation = loggedInUser.conversations[loggedInUser.conversations.length - 1];
          loadConversation(lastConversation.name);
        }
      }, [socketConnected, loggedInUser])
      

    useEffect(() => {
        if(isFirstRender && socket && socket.connected)
        loadConversation('Main')
      }, [socket])
  
    useEffect(() => {
      if (socket) {
        socket.on('receive-msg', (data) => {
        loadConversation(data.conversationName)
        })
  
        return () => {
          socket.off('receive-msg')
        };
      } 
    }, [socket])

    useEffect(() => {
        if(!chatEndRef.current ||!chatEndRef2.current) return
        chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        chatEndRef2.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [selectedRoom.msgs]);
    


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
        if (!msg) return
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===selectedRoom.name)
        const conversation = await getConversationById(selectedConversation.id) 
        await addNewMsg(conversation,msg,loggedInUser.userName)
        await socket.emit('send-msg',{conversationId:selectedConversation.id,conversationName:conversation.name,msg,username:loggedInUser.userName})
        setMsg("")
    }catch(err){
        console.log('Error during sending new msg:', err)     
      }
    }

    

    async function loadConversation(conversationName) {
        if (!socketConnected) {
            return;
          }
        try{
        const selectedConversation = loggedInUser.conversations.find(con=>con.name===conversationName)
        const conversation = selectedConversation._id? selectedConversation : await getConversationById(selectedConversation.id) 
        if(conversation)
        {
            setSelectedRoom({id: selectedConversation.id,type:conversation.type,name:conversationName,msgs:conversation.msgs || {}})
            if (socket && socket.connected) {
                socket.emit('join-room', conversation._id);
              } 
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
                    <ul>
                {selectedRoom.msgs && selectedRoom.msgs.length>0 && selectedRoom.msgs.slice().reverse().map((msg,idx)=>
                    <li key={idx}
                    className={(msg.username===loggedInUser.userName)?'me':'others'}
                    ><p style={{color:(msg.username===loggedInUser.userName)?'Green':'Purple'}}>{(msg.username===loggedInUser.userName)? 'you' :msg.username}:</p><p>{msg.msg}</p></li>
                )}
                    <div ref={chatEndRef2}></div>
                    </ul>
                </div>
                <div className='right-side'>
                    <label>Rooms</label>
                    <div className='rooms-area'>
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation.id} 
                        onClick={()=>loadConversation(conversation.name)}
                        className={conversation.name===selectedRoom.name?"active" : ""}>{conversation.name}</li>)}
                        {selectedRoom.name!=='Main' &&<div ref={chatEndRef}></div>}

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
            {isOpenMsg && <div className='modal-msg' onClick={()=>loadConversation(modalMsg.room)}>
                <button onClick={(e)=>{
                    e.stopPropagation()
                    setIsOpenMsg(false)
                }}>X</button>
                <h3>{modalMsg.msg}</h3>
            </div>}
        </section>
    )
}
