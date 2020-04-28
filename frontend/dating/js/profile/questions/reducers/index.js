import {combineReducers} from 'redux'

import questions from './questions'
import showMoreQuestions from './show-more-questions'
import posts from '../../../news/reducers/posts'


export default combineReducers({
  questions,
  showMoreQuestions,
  posts
})
