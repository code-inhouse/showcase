import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueTippy from 'vue-tippy'
import Vuex from 'vuex'
import Notifications from 'vue-notification'

// app dependencies
import defOpts from './marketwatch/configs/defaultOptions';
import Options from './marketwatch/modules/options';
import Binance from './marketwatch/modules/binance';
import Alarms from './marketwatch/modules/alarms';
import History from './marketwatch/modules/history';
import Notify from './marketwatch/modules/notify';
import Router from './marketwatch/modules/router';
import News from './marketwatch/modules/news';
import Messenger from './marketwatch/modules/messenger';
import Ajax from './marketwatch/modules/ajax';
import Bus from './marketwatch/modules/bus';
import Sorter from './marketwatch/modules/sorter';
import Scroller from './marketwatch/modules/scroller';
import Tooltip from './marketwatch/modules/tooltip';
import store from './marketwatch/modules/store';
import sentiment from './marketwatch/modules/sentiment';
import utils from './marketwatch/modules/utils';
import Home from './pages/Home.vue'
import Profile from './pages/Profile/index.vue'
import MarketWatch from './pages/MarketWatch.vue'

import Candles from './candles/App.vue'
import Editable from './candles/components/ui/Editable.vue'
import Dropdown from './candles/components/ui/Dropdown.vue'
import Slider from './candles/components/ui/Slider.vue'
import candlesStore from './candles/services/store'

// window.DEBUG = false;

// setup common helper classes
const _options = new Options( defOpts );
const _binance = new Binance();
const _alarms = new Alarms();
const _history = new History();
const _notify = new Notify();
const _news = new News();
const _messenger = new Messenger();
const _ajax = new Ajax();
const _bus = new Bus();
const _sorter = new Sorter();
const _scroller = new Scroller();
const _tooltip = new Tooltip();
const _router = new Router();

// create custom global vue properties
Object.defineProperties( Vue.prototype, {
  $opts: { get() { return _options; } },
  $binance: { get() { return _binance; } },
  $alarms: { get() { return _alarms; } },
  $history: { get() { return _history; } },
  $marketwatchNotify: { get() { return _notify; } },
  $news: { get() { return _news; } },
  $messenger: { get() { return _messenger; } },
  $ajax: { get() { return _ajax; } },
  $scroller: { get() { return _scroller; } },
  $bus: { get() { return _bus; } },
  $sorter: { get() { return _sorter; } },
  $marketwatchStore: { get() { return store; } },
  $sentiment: { get() { return sentiment; } },
  $utils: { get() { return utils; } },
  $marketRouter: { get() { return _router; } },
});

Vue.use(VueTippy, {
  maxWidth: '200px',
  duration: 200,
  arrow: false,
  animation: 'scale',
  size: 'small',
  delay: 0,
  animateFill: false,
  theme: 'red',
})
Vue.use(Vuex)

Vue.component('dropdown', Dropdown)
Vue.component('editable', Editable)
Vue.component('slider', Slider)

// single tooltip instance for entire app
Vue.directive( 'tooltip', {
  bind: el => { _tooltip.select( el ); },
  unbind: el => { _tooltip.unselect( el ); },
});

// global filters used to format currency and price change values
Vue.filter( 'toLinks', ( text ) => utils.linkUrl( text ) );
Vue.filter( 'toNoun', ( num, s, p ) => utils.noun( num, s, p ) );
Vue.filter( 'toElapsed', ( time, suffix, short ) => utils.elapsed( ( Date.now() - time ) / 1000, suffix, short ) );
Vue.filter( 'toDate', ( time, full ) => utils.date( time, full ) );
Vue.filter( 'toMoney', ( num, decimals ) => utils.money( num, decimals ) );
Vue.filter( 'toFixed', ( num, asset ) => utils.fixed( num, asset ) );

// init and/or render
window.addEventListener( 'load', e => {
  if ( window.top !== window ) return;
  document.body.setAttribute( 'tabindex', '0' );
});


Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Notifications)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/marketwatch',
      name: 'Home',
      component: Home,
      children: [{
        path: 'marketwatch',
        component: MarketWatch,
      }, {
        path: 'candles',
        component: Candles,
      }, {
        path: 'profile',
        component: Profile,
      }]
    },
  ]
})

if (!window.location.href.startsWith('/marketwatch') && window.location.href.includes('#')) {
  window.location.href = window.location.href.split('#')[0]
} else {
  candlesStore.dispatch('fetchUser')
  new Vue({
    el: '#app',
    store: candlesStore,
    router
  })
}
