const photoBanner = new class {
    constructor() {
        this.timeout = null
        $('#big-photos-modal').on('hide.bs.modal', this.onClose)
    }

    show() {
        $('#big-photos-modal').modal('show')
        this.timeout = setTimeout(() => {
            window.location.href = `/payments/click?button=premium&source=photo_banner_auto&page_url=${window.location.href}`
        }, 10 * 1000)
    }

    onClose = () => {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
    }
}


export default photoBanner
