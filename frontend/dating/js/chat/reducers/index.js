import {combineReducers} from 'redux'

import chats from './chats'
import messages from './messages'
import sentMessages from './sent-messages'
import chatsLoading from './chats-loading'


export default combineReducers({
  chats,
  messages,
  sentMessages,
  chatsLoading
})
