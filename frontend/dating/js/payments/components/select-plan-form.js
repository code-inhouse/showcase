import React from 'react'

import SubscriptionPlan from './subscription-plan'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      selected: 0
    }
  }

  render() {
    let {plans, onPurchase} = this.props
    return (
      <form
        id='upgrade_form'
        className='splash okform initialized'>
        <ul className='packages'>
          {
            plans.map((plan, index) => (
              <SubscriptionPlan
                id={index}
                key={index}
                plan={plan}
                selected={this.state.selected == index}
                onSelect={() => this.onSelectPlan(index)}/>
            ))
          }
        </ul>
        <a
          className="btn btn-block btn-lg btn-warning"
          onClick={() => onPurchase(plans[this.state.selected])}>
          {__('Получить') +
           ' ' +
           (this.props.tab == 'vip' ? __('VIP') : __('Премиум'))}
        </a>
      </form>
    )
  }

  onSelectPlan = id => {
    this.setState({selected: id})
  }
}
