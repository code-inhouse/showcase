import * as constants from '../actions/constants'


export default function(state=[], action) {
    switch (action.type) {
    case constants.TOGGLED_EDIT:
        var id = action.questionId
        return state.map(
            question =>
                question.id != id ?
                question :
                Object.assign({}, question, {editing: !question.editing})
        )

    case constants.DELETED_ANSWER:
        var id = action.questionId
        return state.map(
            question =>
                question.id != id ?
                question :
                Object.assign({}, question, {
                    answered: false,
                    answer: undefined
                })
        )

    case constants.ANSWERED_QUESTION:
        var id = action.questionId
        let {answer} = action
        return state.map(
            question =>
                question.id != id ?
                question :
                Object.assign({}, question, {
                    answered: true,
                    answer
                })
        )

    default:
        return state
    }
}
