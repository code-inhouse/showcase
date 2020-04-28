import {connect} from 'react-redux'

import UnansweredQuestion from '../presentation/unanswered-question'
import * as actions from '../../actions'


function mapStateToProps(state, ownProps) {
    return ownProps
}

function mapDispatchToProps(dispatch, ownProps) {
    let {question} = ownProps
    return {
        onClick: () => {
            dispatch(actions.toggleEdit(question.id))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UnansweredQuestion)
