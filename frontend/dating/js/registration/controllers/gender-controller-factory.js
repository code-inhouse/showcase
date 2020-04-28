export default function genderControllerFactory(
    maleCtrlSel,
    femaleCtrlSel,
    LSKey) {
    return new class {
        constructor() {
            this.state = ''
            this.LSKey = LSKey
        }

        init(onChange=() => {}) {
            this.onChange = onChange
            let maleCtrl = document.querySelector(maleCtrlSel)
            let femaleCtrl = document.querySelector(femaleCtrlSel)
            let ctrls = [maleCtrl, femaleCtrl]
            maleCtrl.addEventListener(
                'click', this.onClickFactory(maleCtrl, ctrls, 'male'))
            femaleCtrl.addEventListener(
                'click', this.onClickFactory(femaleCtrl, ctrls, 'female'))
            if (localStorage && localStorage.getItem(this.LSKey)) {
                let sex = localStorage.getItem(this.LSKey)
                if (sex == 'male') {
                    this.state = 'male'
                    maleCtrl.click()
                } else if (sex == 'female') {
                    this.state = 'female'
                    femaleCtrl.click()
                }
            }
        }

        onClickFactory(ctrl, ctrls, name) {
            return () => {
                this.state = name
                for (let ctrl of ctrls) {
                    ctrl.classList.remove('focused')
                }
                if (localStorage) {
                    localStorage.setItem(this.LSKey, this.state)
                }
                ctrl.classList.add('focused')
                this.onChange()
            }
        }

        map() {
            return this.state
        }
    }
}
