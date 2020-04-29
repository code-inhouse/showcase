import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import store from './store'
import QuestionList from './components/containers/question-list'

import News from '../../news/app'
import {postsFetched} from '../../news/actions'
import {normalizePosts} from '../../news/normalize'



export default function init() {
    render((
        <Provider store={store}>
        <div>
            {window.OWN && <QuestionList/>}
            <News/>
        </div>
        </Provider>
    ), document.getElementById('preact-render-root'))
    $.get(`/news/posts/?pid=${window.PROFILE_CONFIG.id}`, data => {
      store.dispatch(postsFetched(normalizePosts(data)))
    })
    return store
}
