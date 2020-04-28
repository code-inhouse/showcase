import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import mainReducer from './reducers'


export const initialState = {
  posts: {
    items: [],
    isFetching: false
  }
}

export default createStore(
  mainReducer,
  initialState,
  applyMiddleware(thunk)
)
