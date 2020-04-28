import {connect} from 'react-redux'

import Post from './post'
import {deletePost} from '../../../actions'


function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onDelete: postId => () => {
      dispatch(deletePost(postId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)
