import {connect} from 'react-redux'

import PostList from './post-list'
import {normalizePosts} from '../../normalize'
import {postsFetched} from '../../actions'


function sameDate(a, b) {
  let aDate = new Date(a),
      bDate = new Date(b)
  aDate.setHours(0, 0, 0, 0)
  bDate.setHours(0, 0, 0, 0)
  return +aDate == +bDate
}


function comparator(a, b) {
  if (!sameDate(a.created, b.created)) {
    return b.created - a.created
  }
  if (a.poster.firstInNews && !b.poster.firstInNews) {
    return -1
  }
  if (b.poster.firstInNews && !a.poster.firstInNews) {
    return 1
  }
  return b.created - a.created
}

function mapStateToProps(state) {
  return {
    posts: state.posts.items
            .filter(p => p.type != 'add_photo')
            .sort(comparator)
  }
}


function mapDispatchToProps(dispatch) {
  return {dispatch}
}


function mergeProps(stateProps, dispatchProps) {
  let props = {
    onScroll: (cb) => {
      let {posts} = stateProps
      let {dispatch} = dispatchProps
      let minId = Math.min(...posts.map(p => p.id))
      let url = `/news/posts?`
      if (minId < Infinity) {
        url += `older_than=${minId}&`
      }
      if (window.FETCH_ONLY_MY_POSTS) {
        url += `pid=${window.PROFILE_CONFIG.id}&`
      }
      $.get(url, data => {
        dispatch(postsFetched(normalizePosts(data)))
        cb()
      })
    }
  }
  return Object.assign({}, props, stateProps, dispatchProps)
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PostList)
