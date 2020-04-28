export default superclass => class extends superclass {
  constructor() {
    super(...arguments)
    this.state = {}
  }

  initState() {
    Object.assign(this.state, {
      value: '',
      wasFocused: false,
      isFocused: false,
      wasErrorShown: false
    })
  }

  getElementValue(e) {
    return e.target.value
  }

  onInput = e => {
    this.setState({value: this.getElementValue(e)}, () => {
      if (this.props.onValidate) {
        this.props.onValidate(this.isValid)
      }
      if (this.props.onInput) {
        this.props.onInput(this.state.value)
      }
    })
  }

  onFocus = e => {
    this.setState({
      wasFocused: true,
      isFocused: true
    })
  }

  onBlur = e => {
    this.setState({
      isFocused: false
    })
    if (!this.isValid) {
      this.setState({
        wasErrorShown: true
      })
    }
  }

  validate() {
    if (this.props.attempted) {
      return this.isValid
    }
    if (!this.state.wasFocused) return true
    if (!this.isValid &&
        this.state.isFocused &&
        this.state.wasErrorShown) {
      return false
    }
    return this.isValid || (
             !this.state.wasErrorShown &&
             this.state.isFocused)
  }
}
