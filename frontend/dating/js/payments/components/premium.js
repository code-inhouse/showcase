import React from 'react'

import Feature from './feature'
import makeTab from './tab'

const features = [
  <Feature
    id='intoyou'
    title={__('Узнай, кому ты нравишься')}
    description={__('В разделе Симпатии ты увидишь всех людей, которым ты нравишься. А не только тех, с кем взаимная симпатия.')}/>,
  <Feature
    id='searchby'
    title={__('Поменяй своё имя')}
    description={__('Может, ты не хочешь подписываться как ') + `“${window.USER_NAME}”? ` + __('Меняй имя когда захочется, не создавая новую страницу')}/>,
  <Feature
    id='browse'
    title={__('Режим невидимки')}
    description={__('Стань невидимкой! Никто не увидит, что ты заходил на чью-то страницу, пока ты сам этого не захочешь')}/>,
  <Feature
    id='filters'
    title={__('Все увидят твой статус')}
    description={__('На твоей аватарке будет добавлен значок “Премиум”. Покажи всем, что у тебя серьёзные намерения!')}/>
]

const plans = [
  {
    popular: true,
    duration: __('6 месяцев'),
    price: 4.95,
    discount: 50
  },
  {
    duration: __('3 месяца'),
    price: 7.95,
    discount: 20
  },
  {
    duration: __('1 месяц'),
    price: 9.95
  }
]


export default makeTab({
  features,
  plans,
  tabClass: 'feature_list_prem',
  description: __('Премиум-статус дает тебе больше возможностей:')
})
