import React from 'react'
import moment from 'moment'

import NewPostForm from './components/new-post-form'
import PostList from './components/post-list'

moment.locale(window.LOCALE || 'ru')

export default () => {
  let shouldShowFrom = window.OWN || window.location.href.match(/news/)
  return (
    <div>
      {shouldShowFrom && <NewPostForm/>}
      <PostList/>
    </div>
  )
}
