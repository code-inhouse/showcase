import React from 'react'

import {getCurrency} from '../utils'


export default class extends React.Component {
  renderPopular() {
    if (!this.props.plan.popular) return null
    return (
      <span>
        <span className="alist-value-text">{__('Самый популярный')} </span>
        <span className="alist-value-decoration-wrapper">
           <span className="alist-value-decoration alist-value-decoration1"></span>
           <span className="alist-value-decoration alist-value-decoration2"></span>
        </span>
      </span>
    )
  }

  renderDiscount() {
    let {discount} = this.props.plan
    if (!discount) return null
    return (
      <span className="discount">{__('Экономия')} {discount}%</span>
    )
  }

  render() {
    let {selected, onSelect, id} = this.props
    let {
      oldPrice,
      price,
      popular,
      discount,
      duration
    } = this.props.plan
    return (
      <li
        className={`package_box ${selected && 'package_box-hasflag'}`}
        id="package_box0">
          <input
            type="radio"
            name="planid"
            className="package"
            value="16"
            id={`package${id}`}
            checked={selected}
            onChange={e => {
              if (e.target.checked) {
                onSelect()
              }
            }}/>
        <label
          htmlFor={`package${id}`}
          className={`${selected && 'checked'} radio`}>
            <span className="icon"></span>
            <span className="alist-value-flag alist-value-flag--popular">
              {this.renderPopular()}
            </span>
          <span className="duration">{duration}</span>
          <span className="pricepermonth">
            <p className="old-price">
              {oldPrice} {getCurrency()} / {__('неделю')}
            </p>
            <p>
              <span className="price">{price} {getCurrency()} </span>
              / {__('неделю')}
            </p>
            {this.renderDiscount()}
          </span>
        </label>
      </li>
    )
  }
}
