import React, {Component} from 'react'

import uuid from 'uuid'

import Resizer from '../../utils/image-resizer'


export default class extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      photos: [],
      text: ''
    }
    this.maxPhotos = 5
    this.fileInput = null
    this.imageUploader = null
    this.textInput = null
  }

  get errorMessage() {
    if (this.tooManyPhotos) {
      return <p className="error">{__("Слишком много фото, максимум - 5")}</p>
    }
  }

  get tooManyPhotos() {
    return this.state.photos.length > this.maxPhotos
  }

  get hasWhatToSubmit() {
    return (this.state.photos.length > 0) || this.state.text
  }

  get formData() {
    let data = {
      text: this.state.text
    }
    return this.state.photos.reduce((data, photo, index) => (
      Object.assign({}, data, {
        [`photo${index+1}`]: photo.image
      })
    ), data)
  }

  render() {
    let containerClass = 'ibox-content new-post-form'
    this.state.text ? containerClass += " active" : ""

    return (
      <div className={containerClass}>
        <h1>{__("Что нового?")}</h1>
        <input
          id="add-photos-input"
          type="file"
          accept="image/*"
          style={{'display': 'block'}}
          ref={input => this.fileInput = input}
          onChange={this.onUpload}
          style={{'display': 'none'}}
          multiple/>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          className="form-control"
          placeholder={__("Поделитесь своими мыслями с другими")}
          value={this.state.text}
          onInput={() => this.setState({text: this.textInput.value})}
          onKeyUp={this.onTextareaKeyUp}
          ref={input => {
            this.textInput = input
          }}>
        </textarea>
        {this.errorMessage}
        {
          this.hasWhatToSubmit &&
          <button
            className="btn btn-primary"
            disabled={this.tooManyPhotos || !this.hasWhatToSubmit}
            onClick={this.onSubmit}>
              {__("Опубликовать")}
          </button>
        }
        <label htmlFor="add-photos-input" className="btn add-photo-btn">
          <i className="fa fa-photo"></i>
        </label>
        <div className="row">
            <div className="added-photos">
            {
              this.state.photos.map(photo =>
                 <div className="col-sm-2 added-photo">
                    <div className="photo-control">
                    <img
                      src={window.URL.createObjectURL(photo.thumbnail)}/>
                    <button
                      className="btn delete-added-photo"
                        onClick={this.onPhotoDelete(photo.id)}>
                        <i className="fa fa-remove"></i>
                    </button>
                    </div>
                  </div>)
            }
            </div>
        </div>
      </div>
    )
  }

  onUpload = () => {
    for (let image of this.fileInput.files) {
      Resizer.resize(image, {
        width: 1280,
        height: 720
      }, (blob, didItResize) => {
        this.fileInput.value = ''
        if (didItResize) {
          Resizer.resize(blob, {
            width: 320,
            height: 240
          }, (thumbnail, didItResize) => {
            if (didItResize) {
              this.setState({
                photos: [...this.state.photos, {
                  id: uuid(),
                  image: blob,
                  thumbnail
                }]
              })
            } else {
              this.setState({
                photos: [...this.state.photos, {
                  id: uuid(),
                  image: blob,
                  thumbnail: blob
                }]
              })
            }
          })
        } else {
          this.setState({
            photos: [...this.state.photos, {
              id: uuid(),
              image,
              thumbnail: image
            }]
          })
        }
      })
    }
  }

  onSubmit = () => {
    this.props.onSubmit(this.formData)
    this.setState({
      photos: []
    })
    this.setState({text: ''})
  }

  onPhotoDelete = id => () => {
    this.setState({
      photos: this.state.photos.filter(photo => photo.id != id)
    })
  }

  onTextareaKeyUp = (event) => {
    event.currentTarget.style.height = "1px";
    event.currentTarget.style.height = (4 + event.currentTarget.scrollHeight)+"px";
  }
}
