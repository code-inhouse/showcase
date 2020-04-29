let manager = {
    _states: [],

    _curState: -1,

    get curState() {
        return this._states[this._curState] || null
    },

    stepForward() {
        if (this._curState < this._states.length - 1) {
            if (this.curState) {
                this.curState.onNextStep()
            }
            this._curState++
            this._render()
        } else {
            throw 'There are no more states in stack'
        }
    },

    stepBack() {
        if (this._curState > 0) {
            this._curState--
            this._render()
        } else {
            throw 'There are no more states to step back'
        }
    },

    _render() {
        for (let state of this._states) {
            let container = document.getElementById(state.elementId)
            container.setAttribute('hidden', true)
        }
        let curStateContainer = document.getElementById(this.curState.elementId)
        curStateContainer.removeAttribute('hidden')
    },

    push(...states) {
        for (let state of states) {
            this._states.push(state)
        }
    },

    pop(state) {
        this._states.length--
    }
}


export default manager
