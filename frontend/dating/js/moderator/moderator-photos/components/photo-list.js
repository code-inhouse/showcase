import React from 'react'

import Photo from './photo'


export default class extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      photos: []
    }
  }

  componentDidMount() {
    this.setState({
      photos: this.props.photos.map(p => Object.assign({}, p, {
        moderated: false
      }))
    })
  }

  _setModerated = id => () => {
    this.setState({
      photos: this.state.photos.map(p => {
        if (p.id != id) {
          return p
        }
        return Object.assign({}, p, {
          moderated: true
        })
      })
    })
  }

  onReject = id => {
    return this._setModerated(id)
  }

  onModerate = id => {
    return this._setModerated(id)
  }

  render() {
    let {photos} = this.state
    return (
      <div>
      {
        photos
        .filter(photo => !photo.moderated)
        .map(photo => {
          return (
            <Photo
              key={photo.id}
              photo={photo}
              onSend={this.onReject(photo.id)}
              onModerate={this.onModerate(photo.id)}/>
          )
        })
      }
      </div>
    )
  }
}
