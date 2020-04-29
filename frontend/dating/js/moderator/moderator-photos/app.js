import React from 'react'

import Loader from '../common/loader'
import PhotoList from './components/photo-list'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      loaded: false,
      photos: []
    }
  }

  componentDidMount() {
    $.get('/moderator/photos_list/')
      .done(photos => {
        this.setState({
          photos,
          loaded: true
        })
      })
  }

  render() {
    if (!this.state.loaded) {
      return <Loader/>
    }
    return <PhotoList photos={this.state.photos}/>
  }
}
