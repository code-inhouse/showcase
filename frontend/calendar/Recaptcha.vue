<template>
    <div :style="{display: showCaptcha ? 'flex' : 'none'}" class='recaptcha js-recaptcha' />
</template>

<script>
    export default {
        data() {
            return {
                captchaClientKey: null,
                captchaId: null,
                showCaptcha: false,
            }
        },
        mounted() {
            this.renderCaptcha()
        },
        methods: {
            renderCaptcha() {
                if (this.captchaId !== null) {
                    window.grecaptcha.reset(this.captchaId)
                }
                this.$http.get('/api/captcha/').then((res) => {
                    this.captchaClientKey = res.body.clientKey
                    if (res.body.visible) {
                        const container = document.querySelector('.js-recaptcha')
                        this.captchaId = window.grecaptcha.render(container, {
                            sitekey: this.captchaClientKey
                        })
                    }
                    this.showCaptcha = res.body.visible
                }, console.error)
            },
            getResponse() {
                if (this.captchaId === null) {
                    return ''
                }
                return window.grecaptcha.getResponse(this.captchaId)
            }
        }
    }
</script>
