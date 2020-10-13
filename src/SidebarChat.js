import { Avatar } from '@material-ui/core'
import React from 'react'
import './SidebarChat.css'

function SidebarChat({ addNewChat }) {

  const createChat = () => {
    const roomName = prompt('Please enter name of chat');
    if(roomName) {
      // save room in database
    }
  }

  return !addNewChat ? (
    <div className='sidebarChat'>
      <Avatar />
      <div className="sidbarChat__info">
        <h2>Appointments</h2>
        <p>Adrian Li-Hung-Shun</p>
      </div>
    </div>
  ) : ( 
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  )
}

export default SidebarChat
