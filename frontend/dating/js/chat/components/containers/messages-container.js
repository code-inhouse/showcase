import React from 'react'
import {connect} from 'react-redux'
import xhr from 'xhr'

import {fetchedMessages, fetchedAll} from '../../actions'

import MessageList from '../presentation/message-list'


function compare(msg1, msg2) {
    if (msg1.sent < msg2.sent) {
        return -1
    }
    return 1
}


function mapStateToProps(state, ownProps) {
    let {messages} = state
    let {chat} = ownProps
    let chatId = chat ? chat.id : null
    return {
        messages: messages.filter(msg => msg.chatId == chatId).sort(compare)
    }
}


function mapDispatchToProps(dispatch) {
    return {dispatch}
}


function mergeProps(stateProps, dispatchProps, ownProps) {
    let {chat} = ownProps
    let {messages} = stateProps
    let {dispatch} = dispatchProps
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onScroll: e => {
            if (!e.target.scrollTop && !chat.fetchedAll && messages.length) {
                let url = `/chats/${chat.id}/messages?last=${messages[0].id}`
                xhr.get(url, (err, res, body) => {
                    if (err) {
                        console.error('failed to fetch messages')
                    }
                    let newMessages = JSON.parse(body)
                    dispatch(fetchedMessages(chat.id, newMessages.messages))
                    if (newMessages.last) {
                        dispatch(fetchedAll(chat.id))
                    }
                })
            }
        }
    })
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(MessageList)
