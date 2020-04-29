import React from 'react'

import MaskedInput from 'react-maskedinput'

import InputMixin from './input-field-mixin'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
  }

  get isValid() {
    let {value} = this.state
    if (!/[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}/.test(value)) return false
    value = value.replace(/\s/g, '')
    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false
    value = value.replace(/\D/g, "")
    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
          nDigit = parseInt(cDigit, 10)
      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9
      }
      nCheck += nDigit
      bEven = !bEven
    }
    return (nCheck % 10) == 0
  }

  renderError() {
    return (
      <p className="okpay-error">{__('Пожалуйста, введите настоящий номер карточки')}</p>
    )
  }

  render() {
    return (
      <div className="okpay-item okpay-item-cardnumber">
        <div className="okpay-item-element">
          <label htmlFor="okpay-cardnumber" className="okpay-input-container">
            <span className="okpay-input-label">
              {__('Номер карты')}
            </span>
            <MaskedInput
              mask="1111 1111 1111 1111"
              type="text"
              name="cardNumber"
              label="Card Number"
              maxLength="22"
              autoComplete="on"
              className="okpay-input"
              id="okpay-cardnumber"
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
