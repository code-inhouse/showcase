import React from 'react'

import InputMixin from './input-field-mixin'
import {range} from '../utils'


export default class extends InputMixin(React.Component) {
  constructor() {
    super(...arguments)
    this.initState()
    this.WIDTH = 81
  }

  get isValid() {
    let {value} = this.state
    let number = +value
    return !isNaN(number) && number > 2016
  }

  renderError() {
    return <p className="okpay-error" style={{width: this.WIDTH}}>{__('Выберите год')}</p>
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
          <option>{__('Год')}</option>
          {
            range(2017, 2028).map(year => (
              <option value={year}>{year}</option>
            ))
          }
        </select>
        {!this.validate() && this.renderError()}
      </div>
    )
  }
}
