import React from 'react'

import Navigation from './navigation'
import Profile from './profile'
import Search from './search'
import Email from './email-subscription'
import Status from './status'
import Account from './account'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      active: 'about-me'
    }
  }

  _onActivate = active => () => {
    this.setState({active})
  }

  render() {
    return (
      <div>
        <Navigation
          active={this.state.active}
          onActivate={this._onActivate}/>
        {this.state.active == 'about-me' && <Profile/>}
        {this.state.active == 'search' && <Search/>}
        {this.state.active == 'account' && <Account/>}
        {this.state.active == 'email-subscription' && <Email/>}
        {this.state.active == 'subscription' && <Status/>}
        <div className="clearfix"/>
      </div>
    )
  }
}

