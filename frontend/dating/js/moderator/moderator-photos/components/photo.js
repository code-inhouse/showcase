import React from 'react'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      error: false,
      rejecting: false,
      moderating: false,
      sending: false,
      reason: ''
    }
  }

  get isBusy() {
    return (
      this.state.rejecting ||
      this.state.moderating ||
      this.state.sending
    )
  }

  onReject = () => {
    this.setState({
      rejecting: true
    })
  }

  onCancel = () => {
    this.setState({
      rejecting: false
    })
  }

  onInput = e => {
    this.setState({
      reason: e.target.value
    })
  }

  onSend = e => {
    e.preventDefault()
    this.setState({
      sending: true
    })
    let {photo} = this.props
    $.post('/moderator/photo/reject/', {
      photo: photo.id,
      reason: this.state.reason || ''
    })
    .done(data => {
      if (this.props.onSend) {
        this.props.onSend()
      }
    })
    .fail(() => {
      this.setState({
        error: true
      })
    })
    .always(() => {
      this.setState({
        rejecting: false,
        sending: false
      })
    })
  }

  onModerate = e => {
    e.preventDefault()
    this.setState({
      moderating: true
    })
    let {photo} = this.props
    $.post('/moderator/photo/moderate/', {
      photo: photo.id
    })
    .done(data => {
      if (this.props.onModerate) {
        this.props.onModerate()
      }
    })
    .fail(() => {
      this.setState({
        error: true
      })
    })
    .always(() => {
      this.setState({
        modeating: false
      })
    })
  }

  render() {
    let {photo} = this.props
    let {profile} = photo
    return (
      <div className="card">
        <div className="profile">
          <img
            className="avatar"
            src={profile.avatar}/>
          <div className="card-metadata">
            <p className="profile-name">
              <a href={`/profile/${profile.id}`}>
                {profile.name}
              </a>
              <span className="id">#{profile.id}</span>
            </p>
          </div>
        </div>
        <img
          className="moderated-photo"
          src={photo.src}/>
       <button
          className="pure-button"
          onClick={this.onReject}
          disabled={this.isBusy}
          hidden={this.state.rejecting || this.error}
          style={{display: 'inline-block'}}>
            Завернуть
        </button>
        <button
          className="pure-button"
          onClick={this.onModerate}
          disabled={this.isBusy}
          hidden={this.state.rejecting || this.error}
          style={{
            display: 'inline-block',
            marginLeft: 10
          }}>
            Всё ок
        </button>
        <form
          className="pure-form pure-form-stacked"
          hidden={!this.state.rejecting || this.error}>
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
                {this.state.sending ? 'Заворачиваем' : 'Завернуть'}
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
