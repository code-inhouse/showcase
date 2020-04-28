import c from './constants'
import uuid from 'uuid'

import {normalizePosts} from '../normalize'


export function postSubmitted(data, tmpId) {
  return {
    type: c.get('POST_SUBMISSION_SUCC'),
    id: data.id,
    tmpId
  }
}


export function submitPost(data) {
  return dispatch => {
    let submission = new FormData()
    if (data.text) {
      submission.append('text', data.text)
    }
    let photos = []
    for (let i = 0; i < 5; i++) {
      let key = `photo${i+1}`
      if (key in data) {
        let type = data[key].type
        let ext = type.slice(type.indexOf('/')+1)
        if (ext == 'jpeg') {
          ext = 'jpg'
        }
        if (ext) {
          submission.append(key, data[key], `${key}.${ext}`)
        }
        photos.push(data[key])
      }
    }
    let tmpId = uuid()
    dispatch({
      type: c.get('POST_SUBMITTING'),
      text: data.text || '',
      photos,
      tmpId
    })
    $.ajax({
      url: `/news/post/`,
      data: submission,
      cache: false,
      processData: false,
      contentType: false,
      type: 'POST',
      success: data => {
        console.log(data);
        dispatch(postSubmitted(data, tmpId))
      },
      fail: err => {
        console.log(err)
        dispatch({
          type: c.get('POST_SUBMISSION_ERR'),
          tmpId
        })
      }
    });
  }
}


export function postsFetched(posts) {
  return {
    type: c.get('POSTS_FETCHED'),
    posts
  }
}


export function fetchPosts(newerThan, onlyThisProfile) {
  let url
  if (newerThan) {
    url = `/news/posts?newer_than=${newerThan}&`
  } else {
    url = `/news/posts/?`
  }
  if (onlyThisProfile) {
    url += `pid=${window.PROFILE_CONFIG.id}&`
  }
  return dispatch => {
    dispatch({type: c.get('POSTS_FETCHING')})
    $.get(url)
      .success(data => {
        let posts = normalizePosts(data)
        dispatch(postsFetched(posts))
      })
  }
}


export function deletePost(id) {
  return dispatch => {
    dispatch({
      type: c.get('POST_DELETED'),
      id
    })
    $.post(`/news/post/delete/${id}/`, data => {
      console.log('success')
    })
  }
}
