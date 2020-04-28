import React from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import moment from 'moment'

import store from './store'
import App from './app'
import initEvents from './events'
import NotificationFetcher from '../plugins/messages-fetcher'


let preactRoot = document.getElementById('news-container')

render((
  <Provider store={store}>
    <App/>
  </Provider>
), preactRoot)


initEvents(store)

if (window.LOCALE == 'en') {
  moment.locale('en-gb')
} else {
  moment.locale('ru')
}

new NotificationFetcher().init()
