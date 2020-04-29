import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import xhr from 'xhr'

import Store from './store'
import {App} from './components'
import * as actions from './actions'

import initEvents, {fetchIfSelected} from './events'

import NotificationFetcher from '../plugins/messages-fetcher'


initEvents(Store.dispatch, Store.getState)

render(
    <Provider store={Store}><App/></Provider>,
    document.getElementById('root')
)

Store.dispatch(actions.fetchChats())
fetchIfSelected(Store.dispatch, Store.getState())

new NotificationFetcher([false, true, true, true, true]).init()
