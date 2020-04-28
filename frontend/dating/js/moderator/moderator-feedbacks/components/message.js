import React from 'react'

import makeComponent from './feedback-component-factory'


let component = makeComponent('message',
                              '/moderator/mark_message/',
                              'сообщение')


export default component
