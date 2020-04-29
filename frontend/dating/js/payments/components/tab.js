import React from 'react'

import Feature from './feature'
import FeatureList from './feature-list'
import SelectPlanForm from './select-plan-form'



export default function makeTab({description, features, tabClass}) {
  return function({onPurchase, plans, tab}) {
    return (
      <div>
        <h2 style={{marginLeft: 50}}>
          {description}
        </h2>
        <div className="left page-left">
          <FeatureList
          features={features}
          className={tabClass}/>
          <small>
            <p>
              {__('Платежный сервис предоставлен')} <a href="https://register.fca.org.uk/ShPo_FirmDetailsPage?id=001b000000n3TOxAAM">Cauri ltd</a> {__('(регистрационный номер 09507138) и')} <a href="http://win-pay.biz">Win Pay</a>.
            </p>
          </small>
        </div>
        <div className="right page-right">
          <SelectPlanForm
            plans={plans}
            onPurchase={onPurchase}
            tab={tab}/>
        </div>
      </div>
    )
  }
}
