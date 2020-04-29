import React from 'react'

import InputMixin from './input-field-mixin'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
  }

  get isValid() {
    let {value} = this.state
    return /[0-9]+/.test(value)
  }

  renderError() {
    return (
      <p className="okpay-error">{__('Введите настоящий индекс')}</p>
    )
  }

  render() {
    return (
      <div className="okpay-item okpay-item-zipcode">
        <div className="okpay-item-element">
          <label htmlFor="okpay-zipcode" className="okpay-input-container">
            <span className="okpay-input-label">
              {__('Код почты')}
            </span>
            <input
              type="text"
              name="zipCode"
              label="Postal Code"
              autoComplete="on"
              maxLength="10"
              className="okpay-input"
              id="okpay-zipcode"
              onInput={this.onInput}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              disabled={this.props.disabled}/>
          </label>
          {!this.validate() && this.renderError()}
        </div>
      </div>
    )
  }
}
