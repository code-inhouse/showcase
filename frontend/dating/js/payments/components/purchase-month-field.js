import React from 'react'

import InputMixin from './input-field-mixin'
import {range} from '../utils'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
    this.WIDTH = 80
  }

  get isValid() {
    let {value} = this.state
    let number = +value
    return !isNaN(number) && number < 13 && number > 0
  }

  renderError() {
    return <p className="okpay-error" style={{width: this.WIDTH}}>{__('Выберите месяц')}</p>
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <select
          className="form-control"
          style={{
            width: this.WIDTH,
            marginRight: 10,
            paddingLeft: 0,
            paddingRight: 0
          }}
          onChange={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}>
          <option>{__('Месяц')}</option>
          {
            [
              __('Январь'),
              __('Февраль'),
              __('Март'),
              __('Апрель'),
              __('Май'),
              __('Июнь'),
              __('Июль'),
              __('Август'),
              __('Сентябрь'),
              __('Октябрь'),
              __('Ноябрь'),
              __('Декабрь'),
            ].map((month, index) => (
              <option value={index+1}>{month}</option>
            ))
          }
        </select>
        {!this.validate() && this.renderError()}
      </div>
    )
  }
}
