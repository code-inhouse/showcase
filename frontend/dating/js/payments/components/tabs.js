import React from 'react'


function Tab({title, onSelect, selected}) {
  const activeClass = 'upgrade-tabs-link--active'
  return (
    <li>
      <a
        className={`
          upgrade-tabs-link
          ${selected ? activeClass : ''}
        `}
        onClick={onSelect}>
          {title}
      </a>
    </li>
  )
}


export default function Tabs({onTabChange, selected}) {
  return (
    <ul className="upgrade-tabs">
      {
        window.USER_STATUS != 'premium' &&
        <Tab
          title={__('ПРЕМИУМ')}
          selected={selected == 'premium'}
          onSelect={() => onTabChange('premium')}/>
      }
      <Tab
        title={__('Премиум + VIP')}
        selected={selected == 'vip'}
        onSelect={() => onTabChange('vip')}/>
    </ul>
  )
}
