import {connect} from 'react-redux'

import {submitPost} from '../../actions'
import Form from './new-post-form'


function mapStateToProps(state, ownProps) {
  return ownProps
}


function mapDispatchToProps(dispatch) {
  return {
    onSubmit: data => {
      dispatch(submitPost(data))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Form)
