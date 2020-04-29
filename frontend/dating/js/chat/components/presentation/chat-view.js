import React from 'react'

import Messages from '../containers/messages-container'
import SendMessageForm from '../containers/send-message-container'


export default ({chat}) => {
    if (chat) {
        return (
            <div className='col-md-9 no-padding'>
                <Messages chat={chat}/>
                <SendMessageForm chat={chat}/>
            </div>
        )
    }
    return (
        <div className='col-md-9 no-padding'>
        </div>
    )
}
