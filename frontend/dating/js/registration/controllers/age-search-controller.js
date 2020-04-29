import * as constants from '../constants'

export default new class {
    constructor(inputId, LSKey) {
       this.state = {}
       this.inputId = inputId
       this.LSKey = LSKey
    }

    init(onChange=() => {}) {
        var slider = document.getElementById('age-search-input')
        noUiSlider.create(slider, {
            start: [25, 35],
            step: 1,
            connect: true,
            tooltips: true,
            format: wNumb({
                decimals: 0
            }),
            range: {
                'min': [18],
                '80%': [60],
                'max': [100]
            }
        })
        if (localStorage) {
            this.input.noUiSlider.on('change', () => {
                let [lower, upper] =  this.input.noUiSlider.get()
                localStorage.setItem(this.LSKey, JSON.stringify({
                    lower,
                    upper
                }))
            })
            if (localStorage.getItem(this.LSKey)) {
                let {lower, upper} = JSON.parse(
                    localStorage.getItem(this.LSKey))
                this.input.noUiSlider.set([lower, upper])
            }
        }
    }

    get input() {
        return document.getElementById(this.inputId)
    }

    map() {
        let [lower, upper] =  this.input.noUiSlider.get()
        return {
            lowerAgeBound: lower,
            upperAgeBound: upper
        }
    }
}('age-search-input', constants.LS_LOOKING_FOR_AGE)
