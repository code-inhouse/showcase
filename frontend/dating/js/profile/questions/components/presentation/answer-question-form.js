import React, {Component} from 'react'


import getCookie from '../../../../utils/getCookie'

export default class extends Component {
    constructor(props) {
        super(props)
        let answer = props.question.answer || ''
        this.state = {
            answer,
            wasInput: false
        }
    }

    componentDidMount() {
        document.querySelector('.answer-form textarea').focus()
    }

    render() {
        let {question} = this.props
        let csrf = getCookie('csrftoken')
        let {holder} = question
        let {answer} = this.state
        let height = this.height
        return (
            <form
              className="form-group answer-form"
              method="post"
              action="">
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value={csrf}/>
                {this.renderError()}
                <textarea
                  name="text"
                  cols="30"
                  rows="10"
                  className="form-control answer-input"
                  placeholder={holder}
                  value={this.state.answer}
                  onInput={this.onInput}
                  style={{
                    'height': height
                  }}>
                </textarea>
                {this.renderSubmitBtn()}
                <a
                  className="btn btn-default cancel-editing-btn"
                  onClick={this.onCancel}>
                    {__("Отменить")}
                </a>
            </form>
        )
    }

    renderError() {
        let answer = this.state.answer.trim()
        if (answer.length > 2000) {
            return (
                <p className="answer-error-msg">
                    {__("Ответ должен содержать не более 2000 символов")}
                </p>
            )
        }
        if (!answer.length &&
            !this.props.question.answered &&
            this.state.wasInput) {
            return (
                <p className="answer-error-msg">
                    {__("Ответ не должен быть пустым")}
                </p>
            )
        }
        return null
    }

    renderSubmitBtn() {
        return (
            <a
              className="btn btn-primary answer-answered-question"
              onClick={this.onSubmit}>
                {__("Ответить")}
            </a>
        )
    }

    isDeleting() {
        let {question} = this.props
        let answer = this.state.answer.trim()
        return (question.answered && !answer.length)
    }

    get height() {
        const ONE_LINE_HEIGHT = 14,
              MIN_HEIGHT = 70
        let newLines = (this.state.answer.match(/\n/g) || []).length
        return MIN_HEIGHT + newLines * ONE_LINE_HEIGHT
    }

    onInput = e => {
        this.setState({
            answer: e.target.value,
            wasInput: true
        })
    }

    onSubmit = () => {
        let {onDelete, onAnswer} = this.props
        if (this.isDeleting()) {
            onDelete()
        } else {
            onAnswer(this.state.answer.trim())
        }
    }

    onCancel = () => {
        this.props.onCancel()
    }
}
