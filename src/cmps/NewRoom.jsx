/* eslint-disable react/prop-types */
import { useState } from "react";

import { createNewConversation } from '../services/conversation.service'

export default function NewRoom({connectedUsers=[],setIsOpenModal,loggedInUser}){

    const [newRoom, setNewRoom] = useState({type:"public",name:"",username:loggedInUser.userName})
    const [newUsersInRoom,setNewUsersInRoom] = useState([])


    const filteredUsers = connectedUsers.filter(user=>user!==loggedInUser.userName)

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
            <button onClick={()=>{createNewConversation(newRoom,newRoom)
                                    setIsOpenModal(false)
            }}>Create</button>
            <button onClick={()=>setIsOpenModal(false)}>Back</button>

</div>
    </section>)
}