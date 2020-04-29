export default class InputController {
    constructor(inputSelector, LSKey) {
        this.inputSelector = inputSelector
        this.LSKey = LSKey
        let input = this.input
        let curValue = input ? input.value : ''
        this.state = {
            isFocused: false,
            wasFocused: false,
            inputVal: curValue
        }
    }

    get input() {
        return document.querySelector(this.inputSelector)
    }

    map() {
        return this.state.inputVal
    }

    init(onChange=() => {}) {
        this.onChange = onChange
        let input = document.querySelector(this.inputSelector)
        input.addEventListener('focus', this.onFocus())
        input.addEventListener('blur', this.onBlur())
        input.addEventListener('input', this.onInput())
        input.addEventListener('change', this.onInput())
        if (localStorage && this.LSKey && localStorage.getItem(this.LSKey)) {
            input.value = localStorage.getItem(this.LSKey)
            this.state.inputVal = localStorage.getItem(this.LSKey)
        }
    }

    onBlur() {
        return e => {
            this.state.isFocused = false
            this.state.wasFocused = true
            this.onChange()
        }
    }

    onFocus() {
        return e => {
            this.state.isFocused = true
            this.onChange()
        }
    }

    onInput() {
        return e => {
            this.state.inputVal = this.input.value
            if (localStorage && this.LSKey) {
                localStorage.setItem(this.LSKey, this.input.value)
            }
            this.onChange()
        }
    }
}
