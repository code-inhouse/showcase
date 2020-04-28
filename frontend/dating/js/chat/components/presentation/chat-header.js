import React from 'react'

import getDate from '../../../utils/relative-date'


export default ({lastMsgDatetime, isSelected}) => {
    if (isSelected) {
        var timestamp = lastMsgDatetime
    } else {
        var timestamp = lastMsgDatetime || LAST_MSG_DATETIME
    }
    return (
        <div className="ibox-title">
            {
                (timestamp) &&
                <small className="pull-right text-muted">
                    {__("Последнее сообщение")}:  {getDate(timestamp)}
                </small>
            }
        </div>
    )
}
