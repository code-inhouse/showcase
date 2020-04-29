import React from 'react'


export default class extends React.Component {
    render() {
        let {chat} = this.props
        return (
            <div className='chat-message-form'>
                <div className='form-group chat-message-form--fieldset'
                     data-avatar-url={SELF_AVATAR || DEFAULT_AVATAR}>
                    <textarea className='form-control message-input'
                         placeholder={__('Введите Ваше сообщение')}
                         id='message'
                         onKeyDown={this.onKeyDown}>
                    </textarea>
                    <button
                      onClick={this.onSubmit}
                      className="btn btn-primary btn-chat">
                        {__("Отправить")}
                    </button>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.input = $('#message').emojioneArea({
            tones: false,
            autocomplete: false,
            hidePickerOnBlur: false
        })[0]
        this.input.emojioneArea.on('keydown', this.onKeyPress)
    }

    onSubmit = e => {
        let val = this.input.emojioneArea.getText().trim()
        if (val) {
            this.props.onSubmit(val, this.props.chat.id)
            this.input.emojioneArea.setText('')
        }
    }

    onKeyPress = (editor, e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
            this.onSubmit()
        }
    }

    onInput = e => {
        console.log(this.input.textContent)
    }

    onKeyDown = e => {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode == 13) {
            e.preventDefault()
            this.onSubmit()
        }
    }
}
