import React, {Component} from 'react'
import Lightbox from 'react-image-lightbox'
import moment from 'moment'

import {DEFAULT_AVATAR} from '../../../../config'


export default class extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      isGalleryOpen: false,
      photoIndex: 0
    }
  }

  get showGallery() {
    return !!(
      this.props.post.photos &&
      this.props.post.photos.length > 0 &&
      this.state.isGalleryOpen
    )
  }

  onPhotoClick = photoIndex => () => {
    this.setState({
      photoIndex,
      isGalleryOpen: true
    })
  }

  renderPhotos(photos, startIndex=0) {
    if (photos.length == 1) {
      return (
        <div className="photos photos-1">
          <div className="photo-frame">
            <img
              src={photos[0]}
              onClick={this.onPhotoClick(startIndex)}/>
          </div>
        </div>
      )
    } else if (photos.length == 2) {
      return (
        <div className="photos photos-2">
          {
            photos.map((photo, i) =>
              <div className="photo-frame">
                <img
                  src={photo}
                  onClick={this.onPhotoClick(startIndex + i)}/>
              </div>
            )
          }
        </div>
      )
    } else if (photos.length == 3) {
      return (
        <div className="photos photos-3">
          {
            photos.map((photo, i) =>
              <div className="photo-frame">
                  <img
                    src={photo}
                    onClick={this.onPhotoClick(startIndex+i)}/>
              </div>
            )
          }
        </div>
      )
    } else if (photos.length == 4) {
      return (
        <div className="row-photos">
          {this.renderPhotos(photos.slice(0, 2))}
          {this.renderPhotos(photos.slice(2), 2)}
        </div>
      )
    } else if (photos.length == 5) {
      return (
        <div className="row-photos">
          {this.renderPhotos(photos.slice(0, 2))}
          {this.renderPhotos(photos.slice(2), 2)}
        </div>
      )
    }
  }

  get description() {
    let {post} = this.props
    switch (post.type) {
      case 'add_photo': {
        let sexWord = post.poster.sex == 'male' ?
                      __('обновил') :
                      __('обновила')
        return `${sexWord} ${__('фото')}`
      }

      case 'answer_question': {
        let sexWord = post.poster.sex == 'male' ?
                      __('ответил') :
                      __('ответила')
        return `${sexWord} ${__('на вопрос')}`
      }

      default: {
        return ''
      }
    }
  }

  renderTextBlock() {
    let {post} = this.props
    if (post.text) {
      let style = {
        whiteSpace: 'pre-wrap'
      }
      if (post.type != 'answer_question') {
        return <p style={style}>{post.text}</p>
      }
      let [question, ...answer_parts] = post.text.split(';;')
      let answer = answer_parts.join('')
      return (
        <div>
          <p>
            <b>{question}</b>
          </p>
          <p style={style}>{answer}</p>
        </div>
      )
    }
  }

  render() {
    let {post} = this.props
    let {photos} = post
    let {photoIndex} = this.state
    let isTemporary = !post.id,
        isErroneous = !!post.error
    return (
      <div className="ibox-content post">
          {
             (!isTemporary &&
              !isErroneous &&
              (post.poster.id == PROFILE_CONFIG.id) &&
              window.OWN) &&
             <button
               onClick={this.props.onDelete(post.id)}
               className="btn btn-remove-post"
               style={{
                background: 'transparent',
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1
               }}>
               <i className="fa fa-times"></i>
             </button>
          }
          {
            this.showGallery &&
            <Lightbox
              mainSrc={photos[photoIndex]}
              nextSrc={photoIndex < photos.length &&
                       photos[(photoIndex + 1)]}
              prevSrc={photoIndex > 0 &&
                       photos[(photoIndex - 1)]}
              onCloseRequest={() => this.setState({ isGalleryOpen: false })}
              onMovePrevRequest={() => this.setState({
                  photoIndex: (photoIndex + photos.length - 1) % photos.length,
              })}
              onMoveNextRequest={() => this.setState({
                  photoIndex: (photoIndex + 1) % photos.length,
              })}
              enableZoom={false}
              animationOnKeyInput={true}
              reactModalStyle={{overlay: {left: 220}}}/>
          }
          {
            (!isErroneous && isTemporary) &&
            <img
              src="/static/images/loader.gif"
              className="loader"/>
        }
          <div className="post__top">
              <div className="post__photo">
                <a
                  href={`/profile/${post.poster.id}`}>
                  <div
                    className={
                    `post-status-sign
                     post-status-sign__${post.poster.status}`}>
                    <img
                      className="avatar"
                      src={
                        post.poster.thumbnail ||
                        (window.location.href.match(/profile/) &&
                         PROFILE_CONFIG.thumbnail) ||
                        DEFAULT_AVATAR}/>
                  </div>
                </a>
              </div>
              <div className="post__details">
                  <p>
                    <a href={`/profile/${post.poster.id}`}>
                      <span className="name">
                        {post.poster.name + ' '}
                      </span>
                    </a>
                    {this.description}
                  </p>
                  <p>{moment(post.created).fromNow()}</p>
                  {
                    post.poster.isAdmin &&
                    <p>{__('Администрация')} <i className="fa fa-check"></i></p>
                  }
              </div>
          </div>
          {
            isErroneous &&
            <p className="error">
              {__("Произшла какая-то ошибка, попробуйте ещё раз")}
            </p>
          }
          {this.renderTextBlock()}
          {this.renderPhotos(post.photos)}
      </div>
    )
  }
}
