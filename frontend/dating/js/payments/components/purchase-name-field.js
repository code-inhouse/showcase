import React from 'react'

import InputMixin from './input-field-mixin'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
  }

  get isValid() {
    return /^[a-zA-Z ]+$/.test(this.state.value)
  }

  renderError() {
    return (
      <p className="okpay-error">{__('Имя должно состоять только из символов латинского алфавита')}</p>
    )
  }

  render() {
    return (
      <div className="okpay-item okpay-item-name">
        <div className="okpay-item-element">
          <label htmlFor="okpay-name" className="okpay-input-container">
            <span className="okpay-input-label">
              {__("Имя на карте")}
            </span>
            <input
              type="text"
              name="name"
              label="Cardholder Name"
              autoComplete="on"
              className="okpay-input"
              id="okpay-name"
              onChange={this.onInput}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              disabled={this.props.disabled}/>
            {!this.validate() && this.renderError()}
          </label>
        </div>
      </div>
    )
  }
}
