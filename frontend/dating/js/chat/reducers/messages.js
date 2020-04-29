import * as constants from '../actions/constants'


function addMessages(state, messages) {
    let fetched = new Set(state.map(msg => msg.id))
    let newMsgs = messages.filter(msg => !fetched.has(msg.id))
    return [...state, ...newMsgs]
}


export default function(state=[], action) {
    switch (action.type) {
        case constants.FETCHED_MESSAGES:
            console.log(action)
            return addMessages(state, action.messages)

        case constants.PREVIEW_MESSAGE:
            window.SENT_MESSAGES += 1  // TODO: Fix asap
            return addMessages(state, [action.message])

        case constants.DELIVERED_MESSAGE:
            return state.map(
                msg => msg.id != action.oldId ?
                       msg :
                       action.message
            )

        case constants.READ_MESSAGES:
            let predicate  = action.readNotOwn ?
                             (msg => (msg.chatId != action.chatId) || msg.own) :
                             (msg => msg.chatId != action.chatId)
            return state.map(msg => predicate(msg) ?
                                    msg :
                                    Object.assign({}, msg, {read: true}))

        case constants.CHAT_SELECT:
            return state.map(msg => (msg.chatId != action.id) || msg.own ?
                                    msg :
                                    Object.assign({}, msg, {read: true}))

        default:
            return state
    }
}
