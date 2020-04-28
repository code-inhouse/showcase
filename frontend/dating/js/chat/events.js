import xhr from 'xhr'


import * as config from './config'
import {
    fetchedMessages,
    fetchedChat,
    fetchedOnlines,
    readMessages,
    notifyReadMessages,
    chatSelect,
    fetchChats
} from './actions'


function handleNewMessage(dispatch, msg, state) {
    let normalized = {
        id: msg.id,
        chatId: msg.chatId,
        own: false,
        body: msg.body,
        sent: new Date(msg.sent),
        tmpId: false,
    }
    let {chats} = state
    for (let chat of chats) {
        if (chat.id == msg.chatId) {
            normalized.read = chat.selected
            dispatch(fetchedMessages(msg.chatId, [normalized]))
            if (chat.selected) {
                notifyReadMessages(chat.id)
            }
            return
        }
    }
    xhr.get(`/chats/${msg.chatId}/`, (err, res, body) => {
        if (err) {
            console.error(err)
            return
        }
        let chat = JSON.parse(body)
        dispatch(fetchedChat(chat))
    })
}


function handleReadMessages(dispatch, msg, state) {
    dispatch(readMessages(msg['chat_id']))
}


export function fetchIfSelected(dispatch, state) {
    for (let chat of state.chats) {
        if (chat.selected) {
            dispatch(chatSelect(chat.id))
        }
    }
}


export default function init(dispatch, getState) {
    let ws = new WebSocket(`wss://naidisebe.com/chat_ws/${TOKEN}/`)
    ws.onopen = () => console.log('opened connection')
    ws.onclose = e => {
        console.log(e)
        console.log('closed connection')
        setTimeout(() => {
            init(dispatch, getState)
            clearInterval(intervalId)
        }, 5000)
    }
    ws.onmessage = e => {
        let {data} = e
        let msg = JSON.parse(data)
        if ('purpose' in msg) {
            handleReadMessages(dispatch, msg, getState())
        } else {
            handleNewMessage(dispatch, msg, getState())
        }
    }
    fetchIfSelected(dispatch, getState())
    var intervalId = setInterval(() => {
        let profilesIds = JSON.stringify(getState().chats.map(
            chat => chat.withWho.id
        ))
        xhr.get(`/chats/online?ids=${profilesIds}`, (err, res, body) => {
            if (err) {
                console.error(err)
                return
            }
            let profiles = JSON.parse(body).profiles.map(profile => {
                return Object.assign({}, profile, {
                    lastSeen: new Date(profile.lastSeen)
                })
            })
            dispatch(fetchedOnlines(profiles))
        })
    }, config.ONLINE_FETCH_INTERVAL)

    window.addEventListener('beforeunload', e => {
            if (localStorage) {
                localStorage.setItem('CHATS', JSON.stringify({
                    version: 1,
                    chats: getState().chats.map(chat => {
                        if (chat.lastMsgTimestamp > 0) {
                            return Object.assign({}, chat, {
                                lastMsgTimestamp: chat.lastMsgTimestamp.getTime(),
                                selected: false
                            })
                        }
                        return null
                    }).filter(x => x)
                }))
            }
        })
}
