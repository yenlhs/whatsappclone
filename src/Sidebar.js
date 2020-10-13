import React from 'react'
import './Sidebar.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import { Avatar, IconButton } from '@material-ui/core';

import SidebarChat from './SidebarChat'

function Sidebar() {
  return (
		<div className='sidebar'>
			<div className='sidebar__header'>
				<Avatar
					src='https://scontent-syd2-1.xx.fbcdn.net/v/t1.0-9/88055238_10157962580247482_3019746528920076288_o.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=NDjeOPaR9_IAX_yTMaS&_nc_ht=scontent-syd2-1.xx&oh=e04ab8453d55cabe4d6afb7563b52983&oe=5F97E0BA'
					alt=''
				/>
				<div className='sidebar__headerRight'>
					<IconButton>
						<DonutLargeIcon />
					</IconButton>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder='Search or start new chat' type='text' />
        </div>
      </div>
      <div className="sidebar__chats">
				<SidebarChat />
      </div>
		</div>
	);
}

export default Sidebar
