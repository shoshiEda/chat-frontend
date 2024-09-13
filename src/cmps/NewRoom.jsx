/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { createNewConversation } from '../services/conversation.service'
import { getConnectedUsers } from '../services/user.service'

export default function NewRoom({setIsOpenModal,loggedInUser,setIsUpdateUser,socket}){

    const [newRoom, setNewRoom] = useState({type:"public",name:"",username:loggedInUser.userName})
    const [newUsersInRoom,setNewUsersInRoom] = useState([])
    const [connectedUsers,setConnectedUsers] = useState([])

    const filteredUsers = connectedUsers && connectedUsers.length ?connectedUsers.filter(user=>user!==loggedInUser.userName):[]




    useEffect(
        ()=>{
            const fetchUsers = async()=>{
            const tempUsers = await getConnectedUsers()
            setConnectedUsers(tempUsers)
            }
            fetchUsers()
        },[])


    const handleStickChange = (event) => {
        const result = (parseInt(event.target.value,10));
        const type = result===1?"public":"private"
        setNewRoom({...newRoom,type})
      }

    const toggleUserInRoom = (user)=>{
        setNewUsersInRoom(prevUsers =>
            prevUsers.includes(user) ? prevUsers.filter(u => u !== user) : [...prevUsers, user]
        )
    }

    const createConversation = async()=>{
        if(newRoom.type==='public') 
        {
            await createNewConversation(newRoom,filteredUsers)
            socket.emit('create-new-room',{room:newRoom,users:filteredUsers})
        }
        else{
            await createNewConversation(newRoom,newUsersInRoom)
            socket.emit('create-new-room',{room:newRoom,users:newUsersInRoom})
         }

        setIsOpenModal(false)
        setIsUpdateUser({update:true,room:newRoom.name})
    }

    return(
    <section >
        <div className="bg-modal" onClick={()=>setIsOpenModal(false)}></div>
 <div className='new-room-modal'>
        <h3>Create a new room:</h3>
        name: <input type="text" placeholder='name' onChange={(e)=>setNewRoom({...newRoom,name:e.target.value})}/>
            <div className="container">
                    <div className="stick-container">
                        <span className="stick-label">Public</span>
                        <input
                        type="range"
                        min="1"
                        max="2"
                        value={newRoom.type === 'public' ? 1 : 2}
                        className="stick"
                        onChange={handleStickChange}
                        />
                        <span className="stick-label">Private</span>
                    </div>
            {(newRoom.type==='private') && <div> 
                <p>invite users:</p>
                <ul className="users-list">
                {filteredUsers.length>0 && filteredUsers.map(user=><li key={user} 
                    onClick={()=>toggleUserInRoom(user)}
                    className={newUsersInRoom.includes(user)?"active" : ""}>{user}</li>)}
                 </ul>  
            </div>
            }
            </div>
            <button onClick={createConversation}>Create</button>
            <button onClick={()=>setIsOpenModal(false)}>Back</button>

</div>
    </section>)
}