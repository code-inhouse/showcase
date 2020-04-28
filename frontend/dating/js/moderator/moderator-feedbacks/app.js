import React from 'react'

import Loader from '../common/loader'
import FeedbackList from './components/feedback-list'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      loaded: false,
      feedbacks: []
    }
  }

  componentDidMount() {
    $.get('/moderator/feedbacks/')
      .done(feedbacks => {
        this.setState({
          feedbacks,
          loaded: true
        })
      })
  }

  render() {
    if (!this.state.loaded) {
      return <Loader/>
    }
    return <FeedbackList feedbacks={this.state.feedbacks}/>
  }
}
