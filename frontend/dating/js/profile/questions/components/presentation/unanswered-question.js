import React, {Component} from 'react'

import AnswerForm from '../containers/answer-question-form'


export default ({question, onClick}) => {
    let {text} = question
    return (
        <div className="profile-question__item">
            <div className="">
                <div className="question-header">
                    <span className="faq-question">{text}</span>
                    <a
                      className={`btn btn-xs btn-white
                                  answer-question-btn edit-btn pull-right`}
                      onClick={onClick}>
                        <i className="fa fa-edit"></i>

                    </a>
                </div>
            </div>
            {
                question.editing &&
                <AnswerForm question={question}/>
            }
            {
                !question.editing &&
                <div className=" answer-container">
                    <div className="">
                        <div className="faq-answer unanswered"
                             onClick={onClick}>
                            <p>{question.holder}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
