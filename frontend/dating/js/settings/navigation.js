import React from 'react'


export default ({active, onActivate}) => {
  return (
    <ul className="navigation settings_menu">
      <li
        className={`${active == 'about-me' && 'active'}`}
        onClick={onActivate('about-me')}>
          Информация о вас
      </li>
      <li
        className={`${active == 'search' && 'active'}`}
        onClick={onActivate('search')}>
          Поиск
      </li>
      <li
        className={`${active == 'account' && 'active'}`}
        onClick={onActivate('account')}>
          Аккаунт
      </li>
      <li
        className={`${active == 'email-subscription' && 'active'}`}
        onClick={onActivate('email-subscription')}>
          Рассылка
      </li>
      <li
        className={`${active == 'subscription' && 'active'}`}
        onClick={onActivate('subscription')}>
          Подписки
      </li>
    </ul>
  )
}
