import React from 'react'

import makeComponent from './feedback-component-factory'


let component = makeComponent('feedback',
                              '/moderator/mark_feedback/',
                              'отзыв')


export default component
