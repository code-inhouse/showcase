import React from 'react'


export default function (key, mark_url, type) {
  return class extends React.Component {
    constructor() {
      super(...arguments)
      this.state = {
        answering: false,
        sending: false,
        error: false,
        marking: false,
        answer: ''
      }
    }

    get isBusy() {
      return (
        this.state.answering ||
        this.state.sending ||
        this.state.marking
      )
    }

    onInput = e => {
      this.setState({
        answer: e.target.value
      })
    }

    onAnswer = () => {
      this.setState({
        answering: true
      })
    }

    onCancel = e => {
      e.preventDefault()
      this.setState({
        answering: false
      })
    }

    onSend = e => {
      e.preventDefault()
      if (!this.state.answer) {
        return
      }
      this.setState({
        sending: true
      })
      $.post('/moderator/reply/', {
        profile: this.props[key].profile.id,
        body: this.state.answer
      })
      .done(data => {
        this.setState({
          answering: false,
        })
        if (this.props.onAnswer) {
          this.props.onAnswer()
        }
      })
      .fail(() => {
        this.setState({
          error: true,
          answering: false
        })
      })
      .always(() => {
        this.setState({
          sending: false
        })
      })
    }

    onMark = e => {
      e.preventDefault()
      this.setState({
        marking: true
      })
      $.post(mark_url, {
        [key]: this.props[key].id
      })
      .done(data => {
        if (this.props.onMark) {
          this.props.onMark()
        }
      })
      .fail(() => {
        this.setState({
          error: true
        })
      })
      .always(() => {
        this.setState({
          marking: false
        })
      })
    }

    render() {
      let feedback = this.props[key]
      return (
        <div className="card">
          <div className="profile">
            <img
              className="avatar"
              src={feedback.profile.avatar}/>
            <div className="card-metadata">
              <p className="profile-name">
                <a href={`/profile/${feedback.profile.id}`}>
                  {feedback.profile.name}
                </a>
                <span className="id">#{feedback.profile.id}</span>
              </p>
              <p className="card-type">{type}</p>
            </div>
          </div>
          <p>{feedback.body}</p>
          <button
            className="pure-button"
            onClick={this.onAnswer}
            disabled={this.isBusy}
            hidden={this.state.answering || this.error}
            style={{display: 'inline-block'}}>
              Ответить
          </button>
          <button
            className="pure-button"
            onClick={this.onMark}
            disabled={this.isBusy}
            hidden={this.state.answering || this.error}
            style={{
              display: 'inline-block',
              marginLeft: 10
            }}>
              Пометить сделаным
          </button>
          <form
            className="pure-form pure-form-stacked"
            hidden={!this.state.answering || this.error}>
              <textarea
                placeholder="Ответ"
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: 10
                }}
                onInput={this.onInput}>
              </textarea>
              <button
                className="pure-button pure-button-primary"
                style={{
                  display: 'inline-block'
                }}
                onClick={this.onSend}
                disabled={this.state.sending}>
                  {this.state.sending ? 'Отправляем' : 'Ответить'}
              </button>
              <button
                className="pure-button pure-button-default"
                style={{display: 'inline-block', marginLeft: 15}}
                onClick={this.onCancel}
                hidden={this.state.sending}>
                  Отменить
              </button>
          </form>
          <p
            style={{color: 'red'}}
            hidden={!this.state.error}>
              Коля, какая-то ошибка случилась :(
          </p>
        </div>
      )
    }
  }
}
