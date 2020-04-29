import xhr from 'xhr'

import getCookie from '../../utils/getCookie'
import photoBanner from './photo-banner'

var _cropCoords = {
    relLeft: 0,
    relTop: 0,
    relWidth: 1,
    relHeight: 1
}

export default class {
    constructor(makeAvaBtn, deleteBtn, avatar, photos) {
        this.avatar = avatar
        if (window.CAN_SEE_BIG_PHOTOS) {
            this.avatar.addEventListener('click', e => {
                let avaGallery = document.getElementById('avatar-gallery')
                avaGallery.click()
            })
        } else {
            if (this.avatar.getAttribute('src')
                    .indexOf('default_avatar') == -1) {
                this.avatar.addEventListener('click', e => {
                    photoBanner.show()
                })
            }
            $('.lightbox__small-photo').click(() => {
                $('#big-photos-modal').modal('show')
            })
        }
        this.makeAvaBtn = makeAvaBtn.cloneNode(true)
        // deleting old eventlisteners
        makeAvaBtn.parentElement.replaceChild(this.makeAvaBtn, makeAvaBtn)
        this.deleteBtn = deleteBtn.cloneNode(true)
        // deleting old eventlisteners
        deleteBtn.parentElement.replaceChild(this.deleteBtn, deleteBtn)
        this.photos = photos
        this.curPhotoIndex = 0
    }

    onCrop = e => {
        let image = new Image()
        image.addEventListener('load', () => {
            let imageSize = {
                width: image.width,
                height: image.height
            }
            let {x, y, width, height} = this.cropper.getData()
            _cropCoords = {
                relLeft: x / imageSize.width,
                relTop: y / imageSize.height,
                relWidth: width / imageSize.width,
                relHeight: height / imageSize.height
            }
        })
        image.src = this.curPhoto.url
    }


    get onModalSetAvatar() {
        return () => {
            let modal = document.getElementById('set-avatar-modal')
            let container = modal.querySelector('.new-avatar-container img')
            this.cropper = new Cropper(container, {
                aspectRatio: 1,
                viewMode: 1,
                restore: true,
                guides: false,
                center: false,
                zoomable: false,
                minCropBoxWidth: 50,
                minCropBoxHeight: 50,
                crop: this.onCrop
            })
        }
    }

    get onSetAvatar() {
        return () => {
            let url = `/profile/avatar/${this.curPhoto.id}/`
            let data = new FormData()
            data.append('rel_left', _cropCoords.relLeft)
            data.append('rel_top', _cropCoords.relTop)
            data.append('rel_width', _cropCoords.relWidth)
            data.append('rel_height', _cropCoords.relHeight)
            xhr.post(url, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: data
            }, (err, res, body) => {
                if (err) {
                    alert('wild error occured')
                    return
                }
                let avatar = JSON.parse(body)
                for (let photo of this.photos) {
                    photo.isAvatar = false
                }
                this.curPhoto.isAvatar = true
                if (this.avatar) {
                    this.avatar.setAttribute('src', avatar.thumbnailUrl)
                    let dropDownAvatar = document
                        .querySelector('.profile-element img')
                    dropDownAvatar.setAttribute('src', avatar.thumbnailUrl)
                }
                this.updateBtns()
                this.updateAvatar(this.curPhoto)
                $('#set-avatar-modal').modal('hide')
            })
        }
    }

    updateSlide(slide) {
        if (this.curPhoto.deleted) {
            slide.querySelector('img').classList.add('deleted-photo')
        }
    }

    updateBtns() {
        if (this.curPhoto.deleted) {
            this.deleteBtn.textContent = __('Восстановить')
            this.makeAvaBtn.setAttribute('style', 'display:none;')
            return
        }
        this.deleteBtn.textContent = __('Удалить')
        if (this.curPhoto.isAvatar) {
            this.makeAvaBtn.setAttribute('style', 'display:none;')
            this.deleteBtn.setAttribute('style', 'display:none;')
        } else {
            this.deleteBtn.removeAttribute('style')
            this.makeAvaBtn.removeAttribute('style')
        }
    }

    updateAvatar(photo) {
        let oldAvatar = document.getElementById('avatar-gallery')
        if (oldAvatar) {
            oldAvatar.removeAttribute('id')
        }
        let newAvatarImg = document
            .querySelector(`.lightBoxGallery img[src*="${photo.url}"]`)
        newAvatarImg.parentElement.setAttribute('id', 'avatar-gallery')
    }

    updateModal() {
        let sel = 'set-avatar-modal'
        let modal = document.getElementById(sel)
        let img = modal.querySelector('.new-avatar-container img')
        img.setAttribute('src', this.curPhoto.url)
    }

    get curPhoto() {
        return this.photos[this.curPhotoIndex]
    }

    initDeleteBtn() {
        this.deleteBtn.addEventListener('click', e => {
            let url = this.curPhoto.deleted ?
                      `/photo/${this.curPhoto.id}/restore/` :
                      `/photo/${this.curPhoto.id}/delete/`
            xhr.post(url, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            }, (err, res, body) => {
                if (body == 'ok') {
                    this.curPhoto.deleted = !this.curPhoto.deleted
                    this.updateBtns()
                    let modified = document
                        .querySelectorAll(`[src*="${this.curPhoto.url}"]`)
                    for (let img of modified) {
                        if (this.curPhoto.deleted) {
                            img.classList.add('deleted-photo')
                        } else {
                            img.classList.remove('deleted-photo')
                        }
                    }
                    this.updateBtns()
                }
            })
        })
    }

    initMakeAvaBtn() {
        this.makeAvaBtn.addEventListener('click', e => {
            this.closeGallery()
            $('#set-avatar-modal').modal('show')
        })
    }

    closeGallery() {
        document.querySelector('#blueimp-gallery .close').click()
    }

    init(gallerySelector) {
        let setAvatarBtn = document.querySelector('#set-avatar-btn')
        let newSetAvatarBtn = setAvatarBtn.cloneNode(true)
        setAvatarBtn.parentElement.replaceChild(newSetAvatarBtn, setAvatarBtn)
        newSetAvatarBtn.addEventListener('click', this.onSetAvatar)
        $(gallerySelector).off('slide')
        $(gallerySelector).on('slide', (e, index, slide) => {
            this.curPhotoIndex = index
            this.updateBtns()
            this.updateSlide(slide)
            this.updateModal()
         })
        this.initDeleteBtn()
        this.initMakeAvaBtn()
        $('#set-avatar-modal').off('shown.bs.modal')
        $('#set-avatar-modal').off('hidden.bs.modal')
        $('#set-avatar-modal')
            .on('shown.bs.modal', this.onModalSetAvatar)
            .on('hidden.bs.modal', () => {
                this.cropper.destroy()
            })
    }
}
