import React from 'react'


export default class Status extends React.Component {
  render() {
    return (
      <div className="setting">
        <div>
          <div className="status" style={{display: 'inline-block'}}>
            <img className="status-img" src="/static/images/prem-4.png"/>
            {(profile.status == 'premium' || profile.status == 'ordinary') &&
             <p>{__('У вас нету премиум статуса')}</p>}
            <a className="get-premium" href="/payments/purchase/?selected=premium">{__('Стать Премиум')}</a>
          </div>
          <div className="status" style={{display: 'inline-block'}}>
            <img className="status-img" src="/static/images/vip-4.png"/>
            {profile.status != 'vip' &&
             <p>{__('У вас нету ВИП статуса')}</p>}
            <a className="get-vip" href="/payments/purchase/?selected=vip">{__('Стать ВИП')}</a>
          </div>
        </div>
      </div>
    )
  }
}
