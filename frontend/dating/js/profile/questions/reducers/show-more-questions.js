import * as constants from '../actions/constants'


export default function(state=false, action) {
  switch(action.type) {
    case constants.TOGGLE_MORE_QUESTIONS:
      return !state

    default:
      return state
  }
}
