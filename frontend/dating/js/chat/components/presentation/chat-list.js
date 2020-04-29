import React from 'react'

import Chat from './chat'


export default ({chats, onChatSelect, loading}) => (
    <div className='col-md-3 no-padding'>
        <div className='chat-users'>
            <div className='users-list'>
            {
              loading && __('Загрузка')
            }
            {
              chats.map(chat => <Chat key={chat.id}
                                      chat={chat}
                                      onSelect={onChatSelect}/>)
            }
            </div>
        </div>
    </div>
)
