import React, {Compoent} from 'react'


export default ({toggled, onToggle}) => {
  return (
    <div>
      <button
        className={`
          btn
          btn-primary
          btn-outline
          show-more-questions-switch`
        }
        onClick={onToggle}>
        {
          toggled ?
          __('- Показывать меньше вопросов') :
          __('+ Показать ещё вопросы')
        }
      </button>
      <div className="clearfix"></div>
    </div>
  )
}
