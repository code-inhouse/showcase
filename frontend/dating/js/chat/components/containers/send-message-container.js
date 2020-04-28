import {connect} from 'react-redux'

import {sendMessage} from '../../actions'
import SendMessageForm from '../presentation/send-message-form'


function mapStateToProps(state) {
    return {
      sentMessages: state.sentMessages
    }
}


function mapDispatchToProps(dispatch, ownProps) {
    let {chat} = ownProps
    return {
        onSubmit: (messageBody) => {
            dispatch(sendMessage(messageBody, chat.id))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SendMessageForm)
