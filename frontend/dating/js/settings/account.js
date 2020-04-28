import React from 'react'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      showSuccess: false,
      showSameErr: false,
      showWrongPassErr: false,
      showTooShortErr: false
    }
  }

  _submit = e => {
    e.preventDefault()
    let pass = $('#password-input-s').val(),
        newPass = $('#password-input').val(),
        newPass2 = $('#password-rep-input').val()
    if (newPass != newPass2) {
      this.setState({
        showSameErr: true
      })
      return
    } else {
      this.setState({
        showSameErr: false
      })
    }
    if (pass.length < 8) {
      this.setState({
        showTooShortErr: true
      })
      return
    } else {
      this.setState({
        showTooShortErr: false
      })
    }
    $.post('/changepass/', {
      old_password: pass,
      new_password: newPass
    })
    .done(() => {
      console.log('succ')
      this.setState({
        showSuccess: true,
        showWrongPassErr: false,
      })
    })
    .fail(() => {
      console.log('fail')
      this.setState({
        showWrongPassErr: true
      })
    })
  }

  render() {
    return (
      <div className="setting">
      <form className="settings__block settings__akk" onSubmit={this._submit}>
        <label>{__('Смена пароля:')}</label>
        {this.state.showWrongPassErr && <p>{__('Неверный пароль')}</p>}
        {this.state.showSuccess && <p>{__('Пароль был изменен')}</p>}
        <div className="form-group" id="password-control-s">
          <div>
            <p id="password-err-message-s" className="error-message"></p>
            <input type="password" className="form-control" placeholder="Введите текущий пароль" required="true" id="password-input-s"/>
          </div>
        </div>
        <div className="form-group" id="password-control">
          <div>
            <p id="password-err-message" className="error-message"></p>
            <input type="password" className="form-control" placeholder="Пароль" required="true" id="password-input"/>
          </div>
        </div>
        {this.state.showTooShortErr && <p>{__('Пароль должен быть минимум 8 символов в длину')}</p>}
        {this.state.showSameErr && <p>{__('Пароли не совпадают')}</p>}
        <div className="form-group" id="password-rep-control">
            <div>
              <p id="password-rep-err-message" className="error-message"></p>
              <input type="password" className="form-control" placeholder="Еще раз пароль" required="true" id="password-rep-input"/>
            </div>
        </div>
        <button type="submit" className="btn btn-outline btn-primary settings__save">{__('Сохранить')}</button>
      </form>
      </div>
    )
  }
}
