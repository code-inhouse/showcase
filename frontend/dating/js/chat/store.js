import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


let chats = []

if (localStorage) {
  let scached = localStorage.getItem('CHATS')
  if (scached) {
    let cached = JSON.parse(scached)
    if (cached.version == 1) {
      chats = cached.chats.map(chat => {
        chat.lastMsgTimestamp = new Date(chat.lastMsgTimestamp)
        if (chat.id == window.SELECTED_CHAT) {
          chat.selected = true
        }
        return chat
      })
    }
  }
}

let initialState = {
    chatsLoading: true,
    chats,
    messages: [],
    sentMessages: window.SENT_MESSAGES
}

console.log(initialState)

export default createStore(
    rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)))
