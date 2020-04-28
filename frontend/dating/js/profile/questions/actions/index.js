import * as constants from './constants'
import {fetchPosts} from '../../../news/actions'

export function toggleEdit(questionId) {
    return {
        type: constants.TOGGLED_EDIT,
        questionId
    }
}

export function _deleteAnswer(questionId) {
    return {
        type: constants.DELETED_ANSWER,
        questionId
    }
}

export function _answerQuestion(questionId, answer) {
    return {
        type: constants.ANSWERED_QUESTION,
        questionId,
        answer
    }
}

export function deleteAnswer(questionId) {
    return dispatch => {
        dispatch(toggleEdit(questionId))
        dispatch(_deleteAnswer(questionId))
        $.post(`/answer/${questionId}/delete/`)
            .fail(console.error)
    }
}

export function answerQuestion(questionId, answer) {
    return dispatch => {
        dispatch(toggleEdit(questionId))
        dispatch(_answerQuestion(questionId, answer))
        $.post(`/question/${questionId}/`, {text: answer})
            .success(() => dispatch(fetchPosts(undefined, true)))
            .fail(console.error)
    }
}

export function toggleMoreQuestions() {
    return {
        type: constants.TOGGLE_MORE_QUESTIONS
    }
}
