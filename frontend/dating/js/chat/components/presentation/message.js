import React from 'react'
import classNames from 'classnames'

import escapeHtml from '../../../utils/escapeHtml'
import getDate from '../../../utils/relative-date'


export default class extends React.Component {
    render() {
        let {message, chat} = this.props
        let css = classNames(
            'chat-message',
            'left',
            !message.read && 'chat-message--unread'
        )
        return (
            <div className={css}>
                <a href={`/profile/${message.own ? '' : chat.withWho.id}`}>
                    <img className='message-avatar'
                         src={this.photo}/>
                </a>
                {this.message}
            </div>
        )
    }

    get dateString() {
        let {message} = this.props
        return getDate(message.sent)
    }

    get messageHeader() {
        let {message, chat} = this.props
        let date = (
            <span className='message-date right'>
                {this.dateString}
            </span>
        )
        let author = (
            <a className='message-author'
               href={`/profile/${message.own ? '' : chat.withWho.id}`}>
                {message.own ? SELF_NAME : chat.withWho.name}
            </a>
        )
        return (
            <div>
                {author}
                {date}
            </div>
        )
    }

    get photo() {
        let {message, chat} = this.props
        if (message.own) {
            return SELF_AVATAR || DEFAULT_AVATAR
        }
        return chat.withWho.photo || DEFAULT_AVATAR
    }

    get message() {
        let {message} = this.props
        if (message.own) {
            var className = message.read ?
                            'message' :
                            'message message-unread'
        } else {
            var className = 'message'
        }
        return (
            <div className={className}>
                {this.messageHeader}
                <p className='message-content'
                   dangerouslySetInnerHTML={this.emojify(message.body)}>
                </p>
            </div>
        )
    }

    emojify(text) {
        return {
            __html: emojione.unicodeToImage(escapeHtml(text)).replace(/\n/g, '<br/>')
        }
    }
}
