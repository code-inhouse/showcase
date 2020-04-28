import xhr from 'xhr'

import Gallery from './gallery'
import {fetchPosts} from '../../news/actions'


var addingAvatar = false
var cropCoords
var reactStore


export default function init(_reactStore) {
    reactStore = _reactStore
    document.getElementById('add-avatar-label')
        .addEventListener('click', e => {
            addingAvatar = true
        }
    )
    document.getElementById('add-photo-label')
        .addEventListener('click', e => {
            addingAvatar = false
        }
    )
    initCropper()
    initUploadPhotoBind()
    initGallery()
    initPhotoAdding()
}


function initUploadPhotoBind() {
    document.getElementById('lightbox-upload-photo')
        .addEventListener('click', e => {
            document.getElementById('add-photo-label').click()
        }
    )
}


function initGallery() {
    let gallery = new Gallery(
        document.getElementById('make-avatar-btn'),
        document.getElementById('delete-photo-btn'),
        document.getElementById('avatar'),
        PHOTOS
    )
    gallery.init('#blueimp-gallery')
}


function initPhotoAdding() {
    document.getElementById('save-avatar-btn')
        .addEventListener('click', onSaveAvatar)
    document.getElementById('add-photo')
        .addEventListener('change', e => {
            let file = e.target.files[0]
            if (!file) return
            const BYTES_IN_MEGABYTE = 1024 * 1024
            let mbSize = file.size / BYTES_IN_MEGABYTE
            let errMsg = e.target.parentElement
                .querySelector('#photo-too-large-msg')
            let successMsg = e.target.parentElement
                .querySelector('#photo-adding-msg')
            errMsg.setAttribute('hidden', true)
            successMsg.setAttribute('hidden', true)
            if (mbSize > 5) {
                errMsg.removeAttribute('hiden')
            } else {
                successMsg.removeAttribute('hidden')
                let form = document.getElementById('add-photo-form')
                if (addingAvatar) {
                    let reader = new FileReader()
                    reader.onload = e => {
                        let imageUrl = e.target.result
                        let sel = `
                            #new-avatar-modal .new-avatar-container > img`
                        let newAva = document.querySelector(sel)
                        newAva.setAttribute('src', imageUrl)
                        $('#new-avatar-modal').modal('show')
                    }
                    reader.readAsDataURL(file)
                } else {
                    uploadPhoto(file, e.target)
                }
            }
        }
    )
}


function initCropper() {
    var cropper;
    var sel = '#new-avatar-modal .new-avatar-container img'
    $('#new-avatar-modal').on('shown.bs.modal', function () {
        cropper = new Cropper(document.querySelector(sel), {
            aspectRatio: 1,
            viewMode: 1,
            restore: true,
            guides: false,
            center: false,
            zoomable: false,
            minCropBoxWidth: 50,
            minCropBoxHeight: 50,
            crop: function(e) {
                let image = new Image()
                image.addEventListener('load', () => {
                    let imageSize = {
                        width: image.width,
                        height: image.height
                    }
                    let {x, y, width, height} = cropper.getData()
                    cropCoords = {
                        relLeft: x / imageSize.width,
                        relTop: y / imageSize.height,
                        relWidth: width / imageSize.width,
                        relHeight: height / imageSize.height
                    }
                })
                image.src = document.querySelector(sel)
                    .getAttribute('src')
            }
        });
    }).on('hidden.bs.modal', function () {
      cropper.destroy();
    });
}


function uploadPhoto(file) {
    let form = document.getElementById('add-photo-form')
    let data = new FormData()
    data.append('image', file)
    data.append('csrfmiddlewaretoken',
        form.querySelector('input[name*="csrf"]').value)
    xhr({
        method: 'POST',
        url: form.getAttribute('action'),
        body: data
    }, (err, res, body) => {
        if (err) {
            alert('Произошла ошибка, обновите страницу и попробуйте позже')
            return
        }
        let photo = JSON.parse(body)
        addPhoto(photo)
    })
    document.getElementById('add-photo').setAttribute('disabled', true)
}


function onSaveAvatar() {
    let form = document.getElementById('add-photo-form')
    let photo = document.getElementById('add-photo').files[0]
    let data = new FormData()
    data.append('image', photo)
    data.append('csrfmiddlewaretoken',
        form.querySelector('input[name*="csrf"]').value)
    data.append('rel_top', cropCoords.relTop)
    data.append('rel_left', cropCoords.relLeft)
    data.append('rel_width', cropCoords.relWidth)
    data.append('rel_height', cropCoords.relHeight)
    let btn = document.getElementById('save-avatar-btn')
    btn.setAttribute('disabled', true)
    btn.textContent = 'Секундочку...'
    xhr({
        method: 'POST',
        url: '/profile/avatar/',
        body: data
    }, (err, res, body) => {
        if (err) {
            alert('Произошла ошибка, обновите страницу и попробуйте позже')
            return
        }
        reactStore.dispatch(fetchPosts(undefined, true))
        let photo = JSON.parse(body)
        addPhoto(photo)
        $('#new-avatar-modal').modal('hide')
        btn.removeAttribute('disabled')
        btn.textContent = 'Сделать фотографией профиля'
    })
}


function addPhoto(photo) {
    PHOTOS = [photo, ...PHOTOS]
    if (photo.isAvatar) {
        addAvatar(photo)
    }
    let galleryContainer = document
        .querySelector('.lightBoxGallery.lightbox')
    galleryContainer.insertAdjacentHTML('afterbegin',
        `<a class="lightbox__small-photo" data-gallery="" href="${photo.url}" title="1/${PHOTOS.length}" ${photo.isAvatar && 'id=\"avatar-gallery\"'}>
            <img src="${photo.url}" alt="">
        </a>`)
    let photos = document.querySelectorAll('.lightbox__small-photo')
    let index = 1
    for (let photo of photos) {
        photo.setAttribute('title', `${index}/${PHOTOS.length}`)
        index++
    }
    if (PHOTOS.length > 5) {
        document.querySelector('.lightbox__small-photo:nth-child(6)')
            .setAttribute('hidden', true)
    }
    initGallery()
    document.getElementById('add-photo').removeAttribute('disabled')
}


function addAvatar(avatar) {
    for (let photo of PHOTOS) {
        photo.isAvatar = false
    }
    PHOTOS[0].isAvatar = true
    document.getElementById('avatar')
        .setAttribute('src', avatar.thumbnailUrl)
    let dropDownAvatar = document
        .querySelector('.profile-element img')
    dropDownAvatar.setAttribute('src', avatar.thumbnailUrl)
    let avaGalleryBinder = document.getElementById('avatar-gallery')
    if (avaGalleryBinder) {
        avaGalleryBinder.removeAttribute('id')
    }
}
