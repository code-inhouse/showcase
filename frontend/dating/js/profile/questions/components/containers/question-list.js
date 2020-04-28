import {connect} from 'react-redux'

import QuestionList from '../presentation/question-list'

function mapStateToProps(state) {
    if (state.showMoreQuestions) {
      return {
          questions: state.questions
      }
    }
    let questions = state.questions.filter(q => q.answered)
    if (questions.length) {
      return {questions}
    } else {
      return {
        questions: state.questions.slice(0, 1)
      }
    }
}


export default connect(mapStateToProps)(QuestionList)
