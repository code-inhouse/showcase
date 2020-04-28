import React from 'react'

import Rodal from 'rodal'

import {getURLParams} from '../utils'
import Tabs from './tabs'
import Vip from './vip'
import Premium from './premium'
import PurchaseForm from './purchase-form'


function getSelected() {
  switch (window.USER_STATUS) {
    case 'premium': {
      return 'vip'
    }

    default: {
      let params = getURLParams()
      if (['premium', 'vip'].indexOf(params.selected) > -1) {
        return params.selected
      }
      return 'premium'
    }
  }
}


function $$(a, b) {
  // dispatches based on country
  return window.COUNTRY == 'Ukraine' ? a : b
}


export default class App extends React.Component {
  constructor() {
    super(...arguments)
    const premiumFeatures = [
      __('Узнай, кому ты нравишься'),
      __('Поменяй своё имя'),
      __('Режим невидимки'),
      __('Все увидят твой статус')
    ]
    const vipFeatures = [...premiumFeatures,
      __('Узнай, кто заходит на твою страницу'),
      __('Будь первым в списке'),
      __('Спецдоставка писем'),
      __('Все увидят твой статус')
    ]
    this.premiumPlans = [
      {
        type: 'premium',
        popular: true,
        duration: __('6 месяцев'),
        oldPrice: $$(25, 35),
        price: $$(14, 29),
        title: __('Премиум'),
        features: premiumFeatures,
        discount: 50,
        total: $$(336, 696)
      },
      {
        type: 'premium',
        duration: __('3 месяца'),
        oldPrice: $$(35, 55),
        price: $$(19, 34),
        title: __('Премиум'),
        features: premiumFeatures,
        total: $$(228, 408),
        discount: 20
      },
      {
        type: 'premium',
        duration: __('1 месяц'),
        oldPrice: $$(45, 75),
        price: $$(24, 39),
        title: __('Премиум'),
        features: premiumFeatures,
        total: $$(96, 156)
      }
    ]
    this.vipPlans = [
      {
        type: 'vip',
        popular: true,
        duration: __('6 месяцев'),
        features: vipFeatures,
        title: __('VIP'),
        oldPrice: $$(35, 55),
        price: $$(24, 33),
        title: 'VIP',
        discount: 50,
        total: $$(576, 792)
      },
      {
        type: 'vip',
        duration: __('3 месяца'),
        features: vipFeatures,
        title: __('VIP'),
        oldPrice: $$(45, 75),
        price: $$(29, 39),
        title: 'VIP',
        discount: 20,
        total: $$(348, 468)
      },
      {
        type: 'vip',
        duration: __('1 месяц'),
        features: vipFeatures,
        title: __('VIP'),
        oldPrice: $$(55, 95),
        price: $$(34, 44),
        title: 'VIP',
        total: $$(136, 176)
      }
    ]
    let initialPlan = this.premiumPlans[0]
    this.state = {
      selected: getSelected(),
      purchasing: false,
      plan: initialPlan,
      error: null,
      submitting: false,
      displayingResult: false
    }
  }

  get tab() {
    switch (this.state.selected) {
      case 'vip': {
        return (
          <Vip
            onPurchase={this.onPurchase}
            plans={this.vipPlans}
            tab={this.state.selected}/>
        )
      }

      default: {
        return (
          <Premium
            onPurchase={this.onPurchase}
            plans={this.premiumPlans}
            tab={this.state.selected}/>
        )
      }
    }
  }

  onTabChange = (selected) => {
    this.setState({selected})
  }

  onClose = () => {
    this.setState({purchasing: false})
  }

  onPurchase = plan => {
    this.setState({
      purchasing: true,
      plan
    })
    $.post('/payments/try/', {
      price: plan.total,
      subscription_type: plan.type
    })
  }

  onSubmit = (cardData, mobile) => {
    this.setState({submitting: true})
    $.post('/payments/pay/', {
      subscription_type: this.state.plan.type,
      price: this.state.plan.total,
      mobile,
      phone: cardData.phone,
      currency: window.COUNTRY == 'Ukraine' ? 'UAH' : 'RUB'
    })
    .done(data => {
      console.log(data)
    })
    .fail(error => {
      this.setState({error})
    })
    .always(() => {
      this.setState({
        submitting: false,
        purchasing: false,
        displayingResult: true
      })
    })
  }

  render() {
    return (
      <div>
        <Tabs
          onTabChange={this.onTabChange}
          selected={this.state.selected}/>
        {this.tab}
        <Rodal
          visible={this.state.purchasing ||
                   this.state.displayingResult}
          onClose={this.onClose}
          width={780}
          height={543}
          showCloseButton={false}
          customStyles={{
            padding: 0,
            maxHeight: 700,
            zIndex: 1001,
            background: '#f3f5f9'
          }}>
            {
              this.state.displayingResult ?
              <div style={{padding: 20}}>
                <p style={{fontSize: '1.2em'}}>
                  <span>
                    {__('Сейчас мы не принимаем оплаты, и поэтому даем вам ')}
                  </span>
                  <span>
                    {this.state.plan.title + ' '}
                  </span>
                  <span>
                    <strong>{__('БЕСПЛАТНО')}</strong>
                  </span>
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/profile'}>
                    ОК
                </button>
              </div> :
              <PurchaseForm
                onClose={this.onClose}
                plan={this.state.plan}
                onSubmit={this.onSubmit}
                disabled={this.state.submitting}/>
            }
        </Rodal>
      </div>
    )
  }
}
