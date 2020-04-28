import React from 'react'
import ReactDOM from 'react-dom'

import Message from './message'



export default class extends React.Component {
    constructor() {
        super(...arguments)
        this._wasScrolled = false
    }


    render() {
        let {messages, chat, onScroll} = this.props
        return (
            <div className="chat-discussion" onScroll={onScroll}>
                {!chat.fetched && <p>Loading</p>}
                {
                  !!messages.length &&
                  messages.map(msg => <Message message={msg}
                                               chat={chat}
                                               wasScrolled={this.wasScrolled}
                                               onScroll={this.onScroll}
                                               key={msg.id}/>)
                }
            </div>
        )
    }

    componentWillUpdate(nextProps) {
        let node = ReactDOM.findDOMNode(this)
        this.scrollHeight = node.scrollHeight
        this.scrollTop = node.scrollTop
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight ===
                                   node.scrollHeight)
        let {messages} = this.props
        if (messages.length) {
            for (let msg of nextProps.messages) {
                if (msg.id < messages[0].id) {
                    this.shouldSaveScrollTop = true
                    return
                }
            }
        }
        this.shouldSaveScrollTop = false
    }

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this)
        if (this.shouldScrollBottom) {
            node.scrollTop = node.scrollHeight
        } else if (this.shouldSaveScrollTop) {
            node.scrollTop = this.scrollTop +
                             (node.scrollHeight - this.scrollHeight)
        } else {
            node.scrollTop = this.scrollTop
        }
    }

}
