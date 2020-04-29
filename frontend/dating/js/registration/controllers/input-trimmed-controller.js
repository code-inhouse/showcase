import InputController from './input-controller'

export default class InputTrimmedController extends InputController {
    map() {
        return this.state.inputVal.trim()
    }
}
