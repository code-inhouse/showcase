import {connect} from 'react-redux'

import ChatView from '../presentation/chat-view'


function mapStateToProps(state) {
    return {
        chat: state.chats.find(chat => chat.selected)
    }
}


export default connect(mapStateToProps)(ChatView)
