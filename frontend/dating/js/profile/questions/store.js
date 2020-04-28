import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import {initialNewsState} from '../../news/store'
import mainReducer from './reducers'


function getInitialState() {
    const initialState = Object.assign({
        questions: [],
    }, initialNewsState)

    const getAttrs = question => ({
        id: question.question.id,
        text: window.LOCALE == 'ru' ? question.question.text : question.question.textEn,
        holder: window.LOCALE == 'ru' ? question.holder : question.holderEn,
        answer: question.answer,
        editing: false
    })

    for (let question of window.ANSWERED_QUESTIONS || []) {
        initialState.questions.push(
            Object.assign({}, getAttrs(question), {answered: true}))
    }

    for (let question of window.UNANSWERED_QUESTIONS || []) {
        initialState.questions.push(
            Object.assign({}, getAttrs(question), {answered: false}))
    }

    initialState.showMoreQuestions = false

    return initialState
}


export default createStore(
    mainReducer,
    getInitialState(),
    applyMiddleware(thunk))
