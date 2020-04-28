import React, {Component} from 'react'

import Post from './post'


function getScrollHeight() {
  let body = document.body,
      html = document.documentElement
  return Math.max(body.scrollHeight,
                  body.offsetHeight,
                  html.clientHeight,
                  html.scrollHeight,
                  html.offsetHeight)
}


export default class extends Component {
  constructor() {
    super(...arguments)
    this.handlingScroll = false
    this.input = null
    this.state = {
      lastPostId: Infinity
    }
  }

  isTemporaryPost = post => {
    return !!(!post.id && post.tmpId)
  }

  get invisiblePosts() {
    return this.props.posts
           .filter(p => !this.isTemporaryPost(p))
           .filter(p => p.id > this.state.lastPostId)
  }

  componentDidMount() {
    this.oldScrollHandler = window.onscroll
    window.onscroll = () => {
      if (this.oldScrollHandler) {
        this.oldScrollHandler()
      }
      this.onScroll()
    }
  }

  componentWillUnmount() {
    window.onscroll = this.oldScrollHandler
  }

  _areInitialPosts(posts) {
    let propPosts = this.props.posts
    return posts.length == propPosts.length ||
           this.invisiblePosts.length > 0
  }

  _showNewPosts() {
    this.shouldScroll = true
    this.scrollHeight = getScrollHeight()
    this.scrollY = window.scrollY
  }

  _handleNewerPosts(maxNewPostId) {
    let hideNewPosts = window.scrollY > 700
    if (!hideNewPosts) {
      this.setState({
        lastPostId: maxNewPostId
      })
      this.shouldScroll = false
    } else {
      this._showNewPosts()
    }
  }

  componentWillReceiveProps(nextProps) {
    let {posts} = this.props
    this.shouldScroll = false
    if (this._areInitialPosts(nextProps.posts)) {
      // return
    }
    let maxNewPostId = Math.max(
      ...nextProps.posts
      .filter(p => !this.isTemporaryPost(p))
      .map(p => p.id)
    )
    if (!posts.length) {
      this.setState({
        lastPostId: maxNewPostId
      })
      return
    }
    let newerPosts = maxNewPostId > this.state.lastPostId
    if (newerPosts) {
      this._handleNewerPosts(maxNewPostId)
    }
  }

  componentDidUpdate() {
    if (this.shouldScroll) {
      let offset = getScrollHeight() - this.scrollHeight
      window.scrollTo(0, this.scrollY + offset)
    }
  }

  render() {
    return (
      <div
        onScroll={this.onScroll}
        ref={node => this.node = node}>
          {
            !!this.invisiblePosts.length &&
            <button
              className="row btn"
              onClick={this.onShowHiddenPosts}>
              Показать {this.invisiblePosts.length} новостей
            </button>
          }
          {
            this.props.posts
            .filter(post =>
                (post.id <= this.state.lastPostId) ||
                this.isTemporaryPost(post))
            .map(post => <Post key={post.id} post={post}/>)
          }
      </div>
    )
  }

  onScroll = () => {
    if (!this.handlingScroll) {
      let scrolledBottom = (
        (window.innerHeight + window.scrollY) >=
        document.body.scrollHeight
      )
      if (scrolledBottom) {
        this.handlingScroll = true
        this.props.onScroll(() => {this.handlingScroll = false})
      }
    }
  }

  onShowHiddenPosts = () => {
    this.shouldScroll = false
    this.setState({
      lastPostId: Math.max(
        ...this.props.posts
        .filter(p => !this.isTemporaryPost(p))
        .map(x => x.id))
    })
  }
}
