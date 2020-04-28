import React from 'react'

import InputMixin from './input-field-mixin'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
  }

  getElementValue(e) {
    return e.target.checked
  }

  get isValid() {
    return this.state.value
  }

  validate() {
    return (!this.state.wasFocused && !this.props.attempted) ||
           this.isValid
  }

  renderError() {
    return (
      <p className="okpay-error" style={{margin: 0}}>
        {__('Вы должны согласиться с пользовательским соглашением')}
      </p>
    )
  }

  render() {
    return (
      <div className="okpay-item-checkbox-form">
        <input
          type="checkbox"
          style={{marginTop: 10}}
          onClick={e => {
            this.onInput(e)
            this.onFocus()
          }}/>
        <span style={{
          marginLeft: 10
        }}>
          {__('Я согласен с')}
          {' '}
          <a href="/terms/" target="_blank">
            {__('Пользовательским соглашением')}
          </a>
        </span>
        <div>
          {!this.validate() && this.renderError()}
        </div>
      </div>
    )
  }
}
