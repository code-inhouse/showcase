import React from 'react'


export default class extends React.Component {
  _submit = () => {
    $.post('/toggleemail/')
    .done(() => {console.log('succ')})
    .fail(() => {console.log('fail')})
  }

  render() {
    return (
      <div className="setting">
        <input type="checkbox" id="email_subscription" defaultChecked={profile.emailSubscribed} onChange={this._submit}/>
        <span style={{marginLeft: 10}}>{__('Я хочу получать письма об уведомлениях и интересных знакомствах от Naidisebe')}</span>
      </div>
    )
  }
}
