import c from '../../actions/constants'


export default function(state=false, action) {
  switch(action.type) {
    case c.get('POSTS_FETCHED'):
      return false

    case c.get('POSTS_FETCHING'):
      return true

    default:
      return state
  }
}
