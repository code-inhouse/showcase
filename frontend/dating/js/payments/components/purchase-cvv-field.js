import React from 'react'

import InputMixin from './input-field-mixin'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
  }

  get isValid() {
    let {value} = this.state
    return /^[0-9]{3,4}$/.test(value)
  }

  renderError() {
    return (
      <p className="okpay-error">{__('Введите настоящий CVV код')}</p>
    )
  }

  render() {
    return (
      <div className="okpay-item okpay-item-securitycode">
        <div className="okpay-item-element">
          <label htmlFor="okpay-securitycode" className="okpay-input-container">
            <span className="okpay-input-label">CVV</span>
            <i className="fa fa-question what"></i>
            <div className="cvv-sample"></div>
            <input
              type="text"
              name="securityCode"
              label="CVV"
              maxLength="4"
              autoComplete="on"
              className="okpay-input"
              id="okpay-securitycode"
              onInput={this.onInput}
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
