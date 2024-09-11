/* eslint-disable react/prop-types */
import { useState } from 'react';
import { logout } from '../services/user.service.js'

import NewRoom from './NewRoom.jsx'




export default function MobileMainArea({loggedInUser,setLoggedInUser}){

    const [selectedRoon,setSelectedRoom] = useState(null)
    const [isOpenModal,setIsOpenModal] = useState(false)
    const [isOpenModalNewRoom,setIsOpenModalNewRoom] = useState(false)




  

    async function logingOut(userId){
        try{
        const resp = await logout(userId)
        if(resp==='success')    
          {
            setLoggedInUser(null)
          }
        }catch(err){
            console.log('Error during logout:', err);     
          }
    }

    return(
        <section>
            <div className="mobile-header">
                <h1 className='logo'>my-chat</h1>
                <h3>hello {loggedInUser.userName}</h3>
                <i className="fa-solid fa-ellipsis-vertical" onClick={()=>setIsOpenModal(!isOpenModal)}></i>
                {isOpenModal && <div className='mobile-modal'>
                    <li onClick={()=>setIsOpenModalNewRoom(true)}>create a new room</li>
                    <li onClick={()=>logingOut(loggedInUser.userId)}>log out</li>
                </div>}
            </div>
            <div className='rooms-area-mobile'>
                        {loggedInUser.conversations && loggedInUser.conversations.map(conversation=><li key={conversation.id} 
                        onClick={()=>setSelectedRoom(conversation)}
                        >{conversation.name}</li>)}
            </div>
            {isOpenModalNewRoom && <NewRoom setIsOpenModalNewRoom={setIsOpenModalNewRoom} loggedInUser={loggedInUser} updateUser={updateUser} socket={socketRef.current}/>}

    </section>
    )
}