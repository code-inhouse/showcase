import * as constants from '../actions/constants'


export default function(state=0, action) {
    switch (action.type) {
        case constants.PREVIEW_MESSAGE:
            return state + 1

        default:
            return state
    }
}
