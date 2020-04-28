import InputController from './input-controller'
import * as constants from '../constants'


export default new class extends InputController {
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    map() {
        let nameParts = this.state.inputVal.trim().split()
        return nameParts.map(this._capitalize).join(' ')
    }
}('#name-input', constants.LS_NAME)
