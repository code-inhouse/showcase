import xhr from 'xhr'
import uuid from 'uuid'

import getCookie from '../../utils/getCookie'

import * as constants from './constants'


export function notifyReadMessages(chatId) {
    xhr.post(`/chats/${chatId}/read_messages/`, {
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }, (err, res, bidy) => {
        if (err) {
            console.error(err)
        }
    })
}


export function fetchedMessages(chatId, messages) {
    messages = messages.map(message => Object.assign({}, message, {
        sent: new Date(message.sent)
    }))
    return {
        type: constants.FETCHED_MESSAGES,
        chatId,
        messages
    }
}


function _chatSelect(chatId) {
    return {
        type: constants.CHAT_SELECT,
        id: chatId
    }
}


export function chatSelect(chatId) {
    return (dispatch, getState) => {
        let state = getState()
        let chat = state.chats.find(chat => chat.id == chatId)
        dispatch(_chatSelect(chatId))
        notifyReadMessages(chatId)
        xhr.get(`/chats/${chatId}/messages/`, (err, res, body) => {
            if (!err) {
                let data = JSON.parse(body)
                dispatch(fetchedMessages(chatId, data.messages))
                dispatch(readMessages(chatId, true))
            } else {
                console.error(err)
            }
        })
    }
}


export function previewMessage(message) {
    return {
        type: constants.PREVIEW_MESSAGE,
        message
    }
}


export function deliveredMessage(message, oldId) {
    return {
        type: constants.DELIVERED_MESSAGE,
        oldId,
        message
    }
}


export function sendMessage(messageBody, chatId) {
    return dispatch => {
        let tmpId = uuid.v4()
        dispatch(previewMessage({
            id: tmpId,
            chatId,
            body: messageBody,
            own: true,
            sent: new Date(),
            tmpId: true,
            read: false
        }))
        let data = new FormData()
        data.append('body', messageBody)
        xhr.post(`/chats/${chatId}/message/`, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: data
        }, (err, res, body) => {
            if (err) {
                console.error(err)
            } else {
                let msg = JSON.parse(body)
                msg.own = true
                msg.sent = new Date(msg.sent)
                msg.tmpId = false
                msg.read = false
                dispatch(deliveredMessage(msg, tmpId))
            }
        })
    }
}


export function fetchedAll(chatId) {
    return {
        type: constants.FETCHED_ALL,
        chatId
    }
}


export function fetchedChat(chat) {
    return {
        type: constants.FETCHED_CHAT,
        chat
    }
}


export function fetchedOnlines(profiles) {
    return {
        type: constants.FETCHED_ONLINES,
        profiles
    }
}


export function readMessages(chatId, readNotOwn=false) {
    return {
        type: constants.READ_MESSAGES,
        readNotOwn,
        chatId
    }
}


export function fetchChats() {
    return dispatch => {
        xhr.get(`/chats/chats?selected=${window.SELECTED_CHAT}`, (err, res, body) => {
            let chats = JSON.parse(body).map(chat => {
                chat.lastMsgTimestamp = new Date(chat.lastMsgTimestamp)
                chat.withWho.lastSeen = new Date(chat.withWho.lastSeen)
                chat.fetched = false
                chat.fetchedAll = false
                chat.tmpId = false
                return chat
            })
            dispatch({
                type: constants.FETCHED_CHATS,
                chats
            })
            for (let chat of chats) {
                if (chat.selected) {
                    dispatch(chatSelect(chat.id))
                }
            }
        })
    }
}
