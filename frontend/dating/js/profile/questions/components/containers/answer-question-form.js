import {connect} from 'react-redux'

import * as actions from '../../actions'
import AnswerForm from '../presentation/answer-question-form'


function mapStateToProps(state, ownProps) {
    return ownProps
}

function mapDispatchToProps(dispatch, ownProps) {
    let {question} = ownProps
    return {
        onDelete: () => {
            dispatch(actions.deleteAnswer(question.id))
        },
        onAnswer: answer => {
            dispatch(actions.answerQuestion(question.id, answer))
        },
        onCancel: () => {
            dispatch(actions.toggleEdit(question.id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerForm)
