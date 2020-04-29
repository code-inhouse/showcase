import React from 'react'

import * as config from '../../config'


export default class extends React.Component {
    render() {
        let {chat, onSelect} = this.props
        let isAdmin = chat.withWho.isAdmin
        return (
            <div className={this.style}
                 onClick={e => onSelect(chat.id)}>
                <div className="pull-right">
                    {this.renderOnline(chat.withWho.lastSeen)}
                    {this.renderStatus(chat.withWho.status)}
                </div>
                <div>
                    <img
                      className='chat-avatar'
                      src={chat.withWho.photo || window.DEFAULT_AVATAR}
                      style={{marginTop: isAdmin && 11}}/>
                </div>
                <div className='chat-user-name'>
                    <p style={{marginBottom: 0}}>
                        <a href='#'>
                            {chat.withWho.name}
                        </a>
                    </p>
                    {
                        isAdmin &&
                        <p style={{fontSize: 10}}>
                            {__("Администрация")}
                            <i className="fa fa-check"></i>
                        </p>
                    }
                </div>
            </div>
        )
    }

    get style() {
        let {chat} = this.props
        if (chat.selected) {
            return 'chat-user selected'
        }
        if (chat.unread) {
            return 'chat-user unread'
        }
        return 'chat-user'
    }

    renderOnline(lastSeen) {
        let delta = new Date() - lastSeen
        let secondsPast = delta / config.MILISECONDS_IN_SECOND
        if (secondsPast < config.ONLINE_THRESHOLD) {
            return (
                <p className="label label-primary chat-label">Онлайн</p>
            )
        }
    }

    renderStatus(status) {
        let statusText
        switch (status) {
            case 'vip': {
                statusText = 'VIP'
                break
            }

            case 'premium': {
                statusText = 'Премиум'
                break
            }
        }
        if (statusText) {
            return (
                <p
                  className={`label label-${status} chat-label`}>
                    {statusText}
                </p>
            )
        }
    }
}
