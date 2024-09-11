/* eslint-disable react/prop-types */
import { useState , useEffect, useRef} from 'react';

import { getConversationById , joinToConversation ,blockUsers , exitFromConversation} from '../services/conversation.service.js'
import { getConnectedUsers } from '../services/user.service'



export default function ConversationActions({loggedInUser,selectedRoom,socket,updateUser}){

    const [fullConversation,setFullConversation] = useState(null)
    const [users,setUsers] = useState([])
    const [chosenUsers,setChosenUsers] = useState([])
    const [isOpenModal,setIsOpenModal] = useState(false)
    const [connectedUsers,setConnectedUsers] = useState([])

    const actionType = useRef("")

    useEffect(()=>{
        getFullConversasionAndUsers()
    },[])
    

    const toggleUserInRoom = (user)=>{
        setChosenUsers(prevUsers =>
            prevUsers.includes(user) ? prevUsers.filter(u => u !== user) : [...prevUsers, user]
        )
    }

    const invite = async()=>{
        if(!fullConversation.usersInclude) return
        const tempUsers = connectedUsers.filter(user=> !fullConversation.usersInclude.includes(user))
        setUsers(tempUsers)
        actionType.current='invite'
        setIsOpenModal(true)
    }

    const block = async()=>{
        if(!fullConversation.usersInclude)  
            {
            setChosenUsers([])
            }
        setUsers(fullConversation.usersInclude.filter(user=>loggedInUser.userName!==user))
        actionType.current='block'
        if(fullConversation.blocked.length)
            setChosenUsers(fullConversation.blocked)
        setIsOpenModal(true)
    }

    const leave = async()=>{
        const isConfirmed = window.confirm('Are you sure you want to leave the room?')
        if (!isConfirmed) return
        const data = await exitFromConversation(loggedInUser.userName,selectedRoom)
        if(data)
        {
        updateUser(true)
        }
    }

    const submit = async()=>{
        if(actionType.current==='block'){
            blockUsers(fullConversation._id,chosenUsers)
            socket.emit('update-blocked-users',{room:fullConversation,users:chosenUsers})
        }
        else if(actionType.current==='invite'){
            if(chosenUsers && chosenUsers.length){
                chosenUsers.map(user=> {
            joinToConversation(user,fullConversation)
        })
        socket.emit('join-user-to-room',{room:fullConversation,users:chosenUsers})
        }
         }
            setIsOpenModal(false)
        }

    async function getFullConversasionAndUsers(){
        const conversation = selectedRoom.id? 
        await getConversationById(selectedRoom.id)
        :
        selectedRoom._id? 
        await getConversationById(selectedRoom._id) : {}
        setFullConversation(conversation)
        const tempUsers = await getConnectedUsers()
        setConnectedUsers(tempUsers)
    }

  
        return(
        <section className="actions">
            {isOpenModal && users && users.length>0 && <div>
                <div className='bg-modal' onClick={()=>setIsOpenModal(false)}></div>
                <div className='new-room-modal'>
                    <h3>choose users:</h3>
                <ul className='conteiner'>
            {users.map(user => (<li key={user} 
                    onClick={()=>toggleUserInRoom(user)}
                    className={chosenUsers.includes(user)?"active" : ""}>{user}</li>))}
                    </ul>
                    <button onClick={submit}>submit</button>
                    </div> 
                </div>}
            {fullConversation && fullConversation.creator===loggedInUser.userName && <button className="invite-btn" onClick={invite}>invite</button>}
            {fullConversation && fullConversation.creator===loggedInUser.userName && <button className="delete-btn" onClick={block}>block</button>}
            <button className="delete-btn" onClick={leave}>leave room</button>
        </section>)
}