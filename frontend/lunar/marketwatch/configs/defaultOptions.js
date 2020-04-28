/**
 * Application options object
 */
export default {

  // cors proxy for outgoing http requests
  proxy: 'http://cors.lunarlabs.ai:8081/',

  // custom proxy list
  proxylist: [
    'https://thingproxy.freeboard.io/fetch/',
    'http://localhost:8080/',
  ],

  // notification options
  notify: {
    enabled: true,
    duration: 10,
  },

  // notification audio
  audio: {
    enabled: true,
    volume: 0.5,
    file: '/static/assets/marketwatch/audio/audio_2.mp3',
  },

  // search options
  search: {
    fullword: false,  // must type full search words
    fullcase: false,   // must type correct word upper/lower case letters
  },

  // live price options
  prices: {
    header: true,        // show top coins in header
    chart: true,         // show live price chart in list
    asset: 'BTC',        // filter by base asset (BTC, ETH, BNB, USDT)
    sort: 'change', // price data to sort by
    order: 'desc',       // price sort direction
    limit: 40,           // how many entries to show
  },

  // news related options
  news: {
    enabled: true, // enable fetching on a timer
    notify: false,  // show push notifications for news
    send: false,    // include news in outgoing notifications (email/telegram)
    interval: 5,    // how often to try fetching from each source (secs)
    delay: 180,     // how long to wait before fetching again from each source (secs)
    tweets: 5,      // how many tweets to fetch at once from each source
    total: 500,     // how many total tweets to store
    max: 60,        // max number of news entries to show
    days: 1,        // only show entries posted within this number of days
  },

  // binance api config
  binance: {
    enabled: false, // status
    apikey: '',     // api key
    apisecret: '',  // api secret
  },

  // mailgun api config
  mailgun: {
    enabled: false, // status
    domain: '',     // account domain
    apikey: '',     // api key
    email: '',      // recipient email
  },

  // telegram bot api config
  telegram: {
    enabled: true, // status
    botkey: '873284010:AAGRY8tGL6XXto7baMfn2wO5xcyre85RLsE',     // telegram bot id
    userid: '-1001413464569',     // recipient chat id
    botkey_placeholder: '873XXXXXX:XXXXXXtGL6XXto7baMfn2wO5xcyreXXXXXX'
  },
}
