import React from 'react'

import InputMixin from './input-field-mixin'



export default class extends InputMixin(React.Component) {
  get isValid() {
    let {value = ''} = this.state
    if (value.indexOf('+') == 0) {
      value = value.slice(1)
    }
    return /\d+/.test(value)
  }

  renderError() {
    return <p className="okpay-error">{__('Введите номер телефона')}</p>
  }

  render() {
    return (
      <div className="pay-phone-wrapper">
         <input
          className="okpay-input"
          onChange={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}/>
        {!this.validate() && this.renderError()}
      </div>
    )
  }
}
