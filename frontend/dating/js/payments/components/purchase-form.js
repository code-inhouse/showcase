import React from 'react'

import {getCurrency} from '../utils'
import NameField from './purchase-name-field'
import CardField from './purchase-card-field'
import CvvField from './purchase-cvv-field'
import PostIndexField from './purchase-post-index-field'
import AgreementField from './agree-field'
import MonthField from './purchase-month-field'
import YearField from './purchase-year-field'
import PhoneField from './purchase-phone-field'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      attempted: false,
      mobile: false,
      credit: true,
      validation: {
        name: false,
        card: false,
        cvv: false,
        agree: false,
        month: false,
        year: false,
        phone: false,
      },
      data: {
        name: '',
        card: '',
        cvv: '',
        month: '',
        year: '',
        phone: '',
        agree: false,
      }
    }
  }


  makeOnValidate = key => validation => {
    this.setState({
      validation: Object.assign(this.state.validation, {
        [key]: validation
      })
    })
  }

  makeOnInput = key => value => {
    this.setState({
      data: Object.assign(this.state.data, {
        [key]: value
      })
    })
  }

  get isValid() {
    let fields
    if (this.state.mobile) {
      fields = ['phone', 'agree']
    } else {
      fields = ['name', 'card', 'cvv', 'agree', 'month', 'year']
    }
    return fields.reduce((acc, key) => {
      return this.state.validation[key] && acc
    }, true)
  }

  renderHeader() {
    return (
      <div className="okpay-cardform-header">
        <h1 className="okpay-cardform-heading">
          {__('Введите информацию с кредитной карты')}
        </h1>
      </div>
    )
  }

  showCreditForm(){
    this.setState({
      credit: true,
      mobile: false
    })
  }

  showMobileForm(){
    this.setState({
      credit: false,
      mobile: true
    })
  }

  renderFields() {
    let imgStyle = {
      width: 50,
      height: 'auto',
      float: 'right'
    }
    return (
      <div className="card-form">
        <div className={`okpay-creditform ${!this.state.credit ? 'okpay-creditform--hide' : ''}`}>
        {this.renderHeader()}
        <div className="card-front">
            <img src="/static/images/visa.png" style={imgStyle}/>
            <img src="/static/images/mc.png" style={imgStyle}/>
            <div className="field field_cardnumber">
            <div className="field_value">
            <CardField
              onValidate={this.makeOnValidate('card')}
              onInput={this.makeOnInput('card')}
              disabled={this.props.disabled}
              attempted={this.state.attempted}/>
            </div>
            </div>
            <div className="field field_cardholder">
                <div className="field_value">
                <NameField
                  onValidate={this.makeOnValidate('name')}
                  onInput={this.makeOnInput('name')}
                  disabled={this.props.disabled}
                  attempted={this.state.attempted}/>
                </div>
            </div>
            <div className="field field_carddate">
                <div className="field_value">
                <div className="okpay-item okpay-item-expiration" style={{width: 'auto'}}>
                  <div className="okpay-item-element">
                    <label className="okpay-input-label">
                      {__('Дата')}
                    </label>
                    <MonthField
                      onValidate={this.makeOnValidate('month')}
                      onInput={this.makeOnInput('month')}
                      disabled={this.props.disabled}
                      attempted={this.state.attempted}/>
                    <YearField
                      onValidate={this.makeOnValidate('year')}
                      onInput={this.makeOnInput('year')}
                      disabled={this.props.disabled}
                      attempted={this.state.attempted}/>
                  </div>
                </div>
                </div>
            </div>
        </div>

        <div className="card-back">
            <div className="card-back_line"></div>
            <div className="field">
                <div className="field_value">
                <CvvField
                  onValidate={this.makeOnValidate('cvv')}
                  onInput={this.makeOnInput('cvv')}
                  disabled={this.props.disabled}
                  attempted={this.state.attempted}/>
                </div>
            </div>
        </div>
        </div>
        <div className={`okpay-mobileform ${!this.state.mobile ? 'okpay-mobileform--hide' : ''}`}>
          <div className="okpay-cardform-header">
            <h1 className="okpay-cardform-heading">
              {__('Введите номер телефона')}
            </h1>
            <PhoneField
              onValidate={this.makeOnValidate('phone')}
              onInput={this.makeOnInput('phone')}
              disabled={this.props.disabled}
              attempted={this.state.attempted}/>
          </div>
        </div>
        <AgreementField
          onValidate={this.makeOnValidate('agree')}
          onInput={this.makeOnInput('agree')}
          disabled={this.props.disabled}
          attempted={this.state.attempted}/>
    </div>


    )
  }

  render() {
    let {onClose, plan} = this.props
    console.log(plan)
    return (
      <div className="okpay-wrapper" role="document">
      <div className="okpay-body">
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={onClose}>
            <span aria-hidden="true">&times;</span>
        </button>
        <ul className="pay-nav">
          <li className={`${this.state.credit ? 'active' : ''}`} onClick={() => this.showCreditForm()}>
            <i className="fa fa-credit-card"></i>
            <a>{__('Кредитной карткой')}</a>
          </li>
          {/*<li className={`${this.state.mobile ? 'active' : ''}`} onClick={() => this.showMobileForm()}>
            <i className="fa fa-mobile-phone"></i>
            <a>{__('С мобильного телефона')}</a>
          </li>*/}
        </ul>
        <div className="okpay-form okpay-form scenario __form">
          <div className="okpay-cardform">
            {this.renderFields()}
            <img style={{width: 70, height: 'auto', float: 'left', marginTop: 9}} src="/static/images/mc.png"/>
            <img style={{width: 70, height: 'auto', float: 'left', marginTop: 18}} src="/static/images/visa_secure.png"/>
            <div className="okpay-security">
              <i className="fa fa-lock"></i>
              <span>{__('Безопасно')}</span>
              <button
                className={`
                  big
                  flatbutton
                  okpay-purchasebutton
                  blue
                  btn-lg
                  btn-success
                  ${(!this.isValid || this.props.disabled) &&
                    'disabled'}
                `}
                onClick={() => {
                  this.setState({attempted: true})
                  if (this.isValid && !this.props.disabled) {
                    this.props.onSubmit(this.state.data, this.state.mobile)
                  }
                }}>
                  {
                    this.props.disabled ?
                    <span>{__("Секундочку...")}</span> :
                    <span>{__("Подтвердить")}</span>
                  }
              </button>
            </div>
          </div>
        </div>
        <div className="okpay-sidesummary">
          <div className="okpay-summary">
            <h3 className="okpay-summary-name"></h3>
            <div className="okpay-summary-description">
            <p>
              {plan.title} {__('на')} {plan.duration}, {plan.total.toFixed(2)} {getCurrency() + ' '}
              {plan.features.join('; ') + '. '}
              {__('По истечению срока подписки, она будет автоматически возобновлена до тех пор, пока вы не примите решения о её прекращении')}
            </p>
            <p>International Real Estate Services Inc., New Horizon Building, Ground Floor, 3 1/2 Miles Phillip S.W. Goldson Highway, P.O. Box 1922, Belize City, Belize</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
}
