import * as constants from '../actions/constants'


export default function (state=[], action) {
    switch (action.type) {
        case constants.CHAT_SELECT:
            let selectedId = action.id
            return state.map(chat =>
                chat.id == selectedId ?
                Object.assign({}, chat, {selected: true}) :
                Object.assign({}, chat, {selected: false}))

        case constants.FETCHED_MESSAGES:
            let maxMsgTimeStamp = new Date(
                Math.max(...action.messages.map(msg => msg.sent)))
            return state.map(chat => chat.id != action.chatId ?
                                     chat :
                                     Object.assign({}, chat, {
                                        fetched: true,
                                        lastMsgTimestamp: Math.max(chat.lastMsgTimestamp, maxMsgTimeStamp)
                                    }))

        case constants.FETCHED_CHATS:
            let {chats} = action
            if (localStorage) {
                localStorage.setItem('CHATS', JSON.stringify({
                    version: 1,
                    chats: chats.map(chat => {
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
            return chats

        case constants.FETCHED_ALL:
            return state.map(chat => chat.id != action.chatId ?
                                     chat :
                                     Object.assign({}, chat, {
                                         fetchedAll: true
                                     }))

        case constants.FETCHED_CHAT:
            return [...state, Object.assign({}, action.chat, {
                selected: false,
                fetchedAll: false,
            })]

        case constants.FETCHED_ONLINES:
            let profileIds = action.profiles.map(profile => profile.id)
            let lastSeens = action.profiles.reduce((lastSeens, profile) => {
                lastSeens[profile.id] = profile.lastSeen
                return lastSeens
            }, {})
            return state.map(chat => {
                if (profileIds.indexOf(chat.withWho.id) == -1) {
                    return chat
                }
                return Object.assign({}, chat, {
                    withWho: Object.assign({}, chat.withWho, {
                        lastSeen: lastSeens[chat.withWho.id]
                    })
                })
            })

        default:
            return state
    }
}
