import React from 'react'

import Feedback from './feedback'
import Message from './message'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      feedbacks: []
    }
  }

  componentDidMount() {
    this.setState({
      feedbacks: this.props
                 .feedbacks
                 .map(f => Object.assign({}, f, {
                     answered: false
                 }))
    })
  }

  onMark = (type, id) => () => {
    let newState = this.state.feedbacks.map(feedback => {
      if (feedback.type == type && feedback.id == id) {
        return Object.assign({}, feedback, {
          answered: true
        })
      }
      return feedback
    })
    this.setState({
      feedbacks: newState
    })
  }

  render() {
    let {feedbacks} = this.state
    return (
      <div>
      {
        feedbacks
        .filter(feedback => !feedback.answered)
        .map((feedback, index) => {
          if (feedback.type == 'message') {
            return (
              <Message
                key={index}
                message={feedback}
                onMark={this.onMark(feedback.type, feedback.id)}/>
            )
          }
          return (
            <Feedback
              key={index}
              feedback={feedback}
              onMark={this.onMark(feedback.type, feedback.id)}/>
          )
        })
      }
      </div>
    )
  }
}
