import * as constants from '../actions/constants'


export default function(state=true, action) {
  switch (action.type) {
    case constants.FETCHED_CHATS: {
      return false
    }

    default: {
      return state
    }
  }
}
