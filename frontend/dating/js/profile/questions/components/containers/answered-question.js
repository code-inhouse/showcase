import {connect} from 'react-redux'

import AnsweredQuestion from '../presentation/answered-question'
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

export default connect(mapStateToProps, mapDispatchToProps)(AnsweredQuestion)
