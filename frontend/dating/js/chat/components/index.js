import React from 'react'

import ChatList from './containers/chat-container'
import ChatView from './containers/chat-view-container'
import ChatHeader from './containers/chat-header-container'


export let App = () => (
    <div className='ibox chat-view'>
        <div className='ibox-content clearfix'>
            <div className=''>
                <ChatList/>
                <ChatView/>
            </div>
        </div>
    </div>
)
