import {connect} from 'react-redux'


import ChatHeader from '../presentation/chat-header'


function mapStateToProps(state) {
    let {chats} = state
    let selectedChat
    for (let chat of chats) {
        if (chat.selected) {
            selectedChat = chat
        }
    }
    let messages = selectedChat ?
                   state.messages.filter(msg => msg.chatId == selectedChat.id) :
                   state.messages
    let lastMsgDatetime
    for (let msg of messages) {
        if (!lastMsgDatetime || msg.sent > lastMsgDatetime) {
            lastMsgDatetime = msg.sent
        }
    }
    return {lastMsgDatetime, isSelected: !!selectedChat}
}


export default connect(mapStateToProps)(ChatHeader)
