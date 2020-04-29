import InputController from './input-controller'


export default class extends InputController {
    map() {
        return +this.state.inputVal
    }
}
