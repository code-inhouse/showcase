import {combineReducers} from 'redux'

import items from './items'
import isFetching from './is-fetching'


export default combineReducers({
  items,
  isFetching
})
