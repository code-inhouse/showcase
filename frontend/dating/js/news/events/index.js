import {fetchPosts} from '../actions'

export default function init(store) {
  const FETCH_INTERVAL = 5000  // ms
  store.dispatch(fetchPosts())
  setInterval(() => {
    let lastPostId = Math.max(
      ...store.getState().posts.items.map(x => x.id)
    )
    if (lastPostId > -Infinity) {
      store.dispatch(fetchPosts(lastPostId))
    }
  }, FETCH_INTERVAL)
}
