import {connect} from 'react-redux'

import {toggleMoreQuestions} from '../../actions'
import Button from '../presentation/toggle-more-questions-btn'


function mapStateToProps(state) {
  return {
    toggled: state.showMoreQuestions
  }
}


function mapDispatchToProps(dispatch) {
  return {
    onToggle: () => {
      dispatch(toggleMoreQuestions())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Button)
