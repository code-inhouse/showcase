import {connect} from 'react-redux'

import ChatList from '../presentation/chat-list'
import {chatSelect} from '../../actions'


function sameDay(...dates) {
    if (dates.length < 1) {
        return true
    }
    let day0 = new Date(dates[0])
    day0.setHours(0, 0, 0, 0)
    for (let date of dates.slice(1)) {
        let day = new Date(date)
        day.setHours(0, 0, 0, 0)
        if (day - day0) {
            return false
        }
    }
    return true
}


function sameDayCompare(chat1, chat2) {
    if (chat1.withWho.firstInMessages &&
        !chat2.withWho.firstInMessages) {
        return -1
    }
    if (chat2.withWho.firstInMessages &&
        !chat1.withWho.firstInMessages) {
        return 1
    }
    return chat2.lastMsgTimestamp - chat1.lastMsgTimestamp
}


function compare(chat1, chat2) {
    if (sameDay(chat1.lastMsgTimestamp,
                chat2.lastMsgTimestamp,
                new Date())) {
        return sameDayCompare(chat1, chat2)
    }
    return chat2.lastMsgTimestamp - chat1.lastMsgTimestamp
}

function mapStateToProps(state) {
    let chats = state.chats.map(chat => {
        return Object.assign({}, chat, {
            lastMsgTimestamp: chat.lastMsgTimestamp || -1
        })
    })
    console.log(chats)
    let chatLookup = {}
    for (let chat of chats) {
        chat.unread = chat.fetched ?
                      false :
                      chat.unreadCount > 0
        chatLookup[chat.id] = chat
    }
    for (let msg of state.messages) {
        let chat = chatLookup[msg.chatId]
        if (!chat) {
            continue
        }
        if (!msg.own && !msg.read) {
            chat.unread = true
        }
        if (msg.sent &&
            msg.sent > chat.lastMsgTimestamp) {
            chat.lastMsgTimestamp = msg.sent
        }
    }
    return {
        loading: state.chatsLoading,
        chats: chats.sort(compare)
    }
}


function mapDispatchToProps(dispatch) {
    return {
        onChatSelect: chatId => {
            dispatch(chatSelect(chatId))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatList)
