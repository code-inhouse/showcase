import React, {Component} from 'react'

import AnsweredQuestion from '../containers/answered-question'
import UnansweredQuestion from '../containers/unanswered-question'
import MoreQuestionsBtn from '../containers/toggle-more-questions-btn'


export default ({questions}) => {
    return (
        <div
          className="ibox-content"
          id="questions-section">
            {
                questions.map(question =>
                    question.answered ?
                    <AnsweredQuestion
                      question={question}/> :
                    <UnansweredQuestion
                      question={question}/>
                )
            }
            <MoreQuestionsBtn/>
        </div>
    )
}
