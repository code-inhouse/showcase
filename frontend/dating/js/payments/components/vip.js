import React from 'react'

import Feature from './feature'
import makeTab from './tab'


const features = [
  <Feature
    id='intoyou'
    title={__('Узнай, кто заходит на твою страницу')}
    description={__('В разделе Симпатии ты увидишь всех людей, которые заходили к тебе на страницу. Даже если они не поставили сердечко.')}/>,
  <Feature
    id='searchby'
    title={__('Будь первым в списке')}
    description={__('В разделе Найти пару твою фотографию увидят одной из первых. В разделе Новости твои записи и фотографии будут показываться в самом верху.')}/>,
  <Feature
    id='browse'
    title={__('Спецдоставка писем')}
    description={__('Получатель увидит твои сообщения в самом верху списка. Гарантируем, что она/он их прочитает.')}/>,
  <Feature
    id='filters'
    title={__('Все увидят твой статус')}
    description={__('На твоей аватарке будет добавлен значок “VIP”. Покажи всем, что у тебя серьёзные намерения.')}/>
]

const plans = [
  {
    popular: true,
    duration: __('6 месяцев'),
    price: 6.95,
    discount: 50
  },
  {
    duration: __('3 месяца'),
    price: 9.95,
    discount: 20
  },
  {
    duration: __('1 месяц'),
    price: 11.95
  }
]


export default makeTab({
  features,
  plans,
  tabClass: 'feature_list_vip',
  description: __('VIP-статус дает тебе все возможности Премиума и даже больше:')
})
