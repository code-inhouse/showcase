import c from '../../actions/constants'


export default function(state=[], action) {
  switch(action.type) {
    case c.get('POSTS_FETCHED'): {
      let newState = [...state]
      let ids = state.map(x => x.id)
      let fetched = new Set(ids)
      for (let post of action.posts) {
        if (!fetched.has(post.id)) {
          fetched.add(post.id)
          newState.push(post)
        }
      }
      return newState
    }

    case c.get('POST_SUBMITTING'): {
      let {text, photos, tmpId} = action
      return [...state, {
        text,
        photos: photos.map(p => window.URL.createObjectURL(p)),
        tmpId,
        poster: PROFILE_CONFIG,
        created: new Date()
      }]
      return state
    }

    case c.get('POST_SUBMISSION_SUCC'): {
      let {id, tmpId} = action
      return state.map(post => post.tmpId == tmpId ?
                       Object.assign({}, post, {id}) :
                       post)
    }

    case c.get('POST_SUBMISSION_ERR'): {
      let {tmpId} = action
      return state.map(post => post.tmpId == tmpId ?
                       Object.assign({}, post, {error: true}) :
                       post)
    }

    case c.get('POST_DELETED'): {
      return state.filter(p => p.id != action.id)
    }

    default:
      return state
  }
}
