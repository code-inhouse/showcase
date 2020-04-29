import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const DEFAULTS = {
  pair: 'BTCUSD',
  preferQuoteCurrencySize: true,
  thresholds: [
    {
      amount: 50000,
      buyColor: 'rgba(76,175,80,.23)',
      sellColor: 'rgba(229,115,115,.23)',
    },
    {
      amount: 100000,
      buyColor: 'rgba(76,175,80,.33)',
      sellColor: 'rgba(229,115,115,.33)',
    },
    {
      amount: 500000,
      buyColor: 'rgb(91,130,48)',
      sellColor: 'rgb(224,91,82)',
    },
    {
      amount: 1000000,
      gif: 'cash',
      buyColor: 'rgb(156,204,101)',
      sellColor: 'rgb(244,67,54)',
    },
    {
      amount: 10000000,
      gif: 'explosion',
      buyColor: 'rgb(255,160,0)',
      sellColor: 'rgb(233,30,99)',
    },
  ],
  exchanges: {
    huobi: { disabled: false },
    okex: { disabled: false },
    liquid: { disabled: true },
    bithumb: { disabled: true },
    hitbtc: { disabled: false },
    coinex: { disabled: true },
    bybit: { disabled: true },
  },
  maxRows: 30,
  decimalPrecision: null,
  aggregationLag: null,
  showLogos: true,
  liquidationsOnlyList: false,
  showCounters: true,
  counterPrecision: 1000 * 10,
  countersSteps: [
    1000 * 60,
    1000 * 60 * 5,
    1000 * 60 * 15,
    1000 * 60 * 30,
    1000 * 60 * 60,
    1000 * 60 * 60 * 2,
    1000 * 60 * 60 * 4,
  ],
  hideIncompleteCounter: true,
  cumulativeCounters: true,
  showStats: true,
  showChart: true,
  statsPeriod: 1000 * 300,
  statsGraphs: true,
  statsGraphsTimeframe: 3000,
  statsGraphsLength: 100,
  chartPadding: 0.075,
  chartGridlines: true,
  chartGridlinesGap: 50,
  timeframe: 1000 * 10,
  autoClearTrades: true,
  debug: true,
  useShades: true,
  useAudio: false,
  audioIncludeInsignificants: true,
  audioVolume: 1.0,
  settings: [],
  chartLiquidations: true,
  chartHeight: null,
  chartRange: 0,
  chartCandleWidth: 5,
  chartCandlestick: true,
  chartVolume: true,
  chartVolumeThreshold: 0,
  chartVolumeOpacity: 0.9,
  chartVolumeAverage: true,
  chartVolumeAverageLength: 14,
  chartSma: true,
  chartSmaLength: 14,
  chartAutoScale: true,
  showExchangesBar: true,
  showThresholdsAsTable: false,

  // runtime state
  isSnaped: true,
  isLoading: true,
  isReplaying: false,
  actives: [],
  user: {
    user: null,
    loading: true,
  }
}

/**
 *  QUERY STRING PARSER
 *  every options should be settable from querystring using encoded json
 */

let QUERY_STRING

try {
  QUERY_STRING = JSON.parse(
    '{"' +
      decodeURI(location.search.substring(1))
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
} catch (error) {
  QUERY_STRING = {}
}

for (let name in QUERY_STRING) {
  try {
    QUERY_STRING[name] = JSON.parse(QUERY_STRING[name])
  } catch (error) {}
}

/**
 * ACTUAL STORED OBJECT
 */

const EXTRA = {}

const subdomain = window.location.hostname.match(/^([\d\w\-\_]+)\..*\./i)

if (subdomain && subdomain.length >= 2) {
  EXTRA.pair = subdomain[1].replace(/\_/g, '+').toUpperCase()
}

/**
 * NON PERSISTENT DATA
 * thoses properties are used in the store logic, but shouldn't be stored in the client storage
 */
const EPHEMERAL_PROPERTIES = [
  'isSnaped',
  'isLoading',
  'isReplaying',
  'actives',
]

const store = new Vuex.Store({
  defaults: DEFAULTS,
  state: Object.assign({}, DEFAULTS, EXTRA, QUERY_STRING),
  mutations: {
    setUser(state, { loading = true, user = null }) {
      state.user = {
        user,
        loading
      }
    },
    setPair(state, value) {
      state.pair = value.toString().toUpperCase()
    },
    toggleBaseCurrencySize(state, value) {
      state.preferQuoteCurrencySize = value ? true : false
    },
    setMaxRows(state, value) {
      state.maxRows = value
    },
    setDecimalPrecision(state, value) {
      state.decimalPrecision = value
    },
    setAggregationLag(state, value) {
      state.aggregationLag = value
    },
    toggleLogos(state, value) {
      state.showLogos = value ? true : false
    },
    toggleLiquidationsOnlyList(state, value) {
      state.liquidationsOnlyList = value ? true : false
    },
    setCounterPrecision(state, payload) {
      state.counterPrecision = value
    },
    toggleCounters(state, value) {
      state.showCounters = value ? true : false
    },
    toggleChart(state, value) {
      state.showChart = value ? true : false
    },
    toggleStats(state, value) {
      state.showStats = value ? true : false
    },
    setStatsPeriod(state, value) {
      let period

      if (/[\d.]+s/.test(value)) {
        period = parseFloat(value) * 1000
      } else if (/[\d.]+h/.test(value)) {
        period = parseFloat(value) * 1000 * 60 * 60
      } else {
        period = parseFloat(value) * 1000 * 60
      }

      state.statsPeriod = period
    },
    toggleStatsGraphs(state, value) {
      state.statsGraphs = value ? true : false;
    },
    setStatsGraphsTimeframe(state, value) {
      state.statsGraphsTimeframe = isNaN(+value) ? 1000 : value;
    },
    setStatsGraphsLength(state, value) {
      state.statsGraphsLength = isNaN(+value) ? 50 : value;
    },
    toggleHideIncompleteCounter(state, value) {
      state.hideIncompleteCounter = value ? true : false
    },
    toggleCumulativeCounters(state, value) {
      state.cumulativeCounters = value ? true : false
    },
    setCounterStep(state, payload) {
      const step = state.countersSteps[payload.index]

      if (payload.value) {
        Vue.set(state.countersSteps, payload.index, payload.value)
      } else {
        state.countersSteps.splice(payload.index, 1)
      }

      state.countersSteps = state.countersSteps.sort((a, b) => a - b)
    },
    replaceCounterSteps(state, counters) {
      state.countersSteps = counters.sort((a, b) => a - b)
    },
    toggleTresholdsTable(state, value) {
      state.showThresholdsAsTable = value ? true : false
    },
    setThresholdAmount(state, payload) {
      const threshold = state.thresholds[payload.index]

      if (threshold) {
        if (typeof payload.value === 'string' && /m|k$/i.test(payload.value)) {
          if (/m$/i.test(value)) {
            threshold.amount = parseFloat(payload.value) * 1000000
          } else {
            threshold.amount = parseFloat(payload.value) * 1000
          }
        }
        threshold.amount = +payload.value

        Vue.set(state.thresholds, payload.index, threshold)
      }
    },
    setThresholdGif(state, payload) {
      const threshold = state.thresholds[payload.index]

      if (threshold) {
        if (payload.value.trim().length) {
          threshold.gif = payload.value
        } else {
          payload.value = threshold.gif
          payload.isDeleted = true

          threshold.gif = null
        }

        Vue.set(state.thresholds, payload.index, threshold)
      }
    },
    setThresholdColor(state, payload) {
      const threshold = state.thresholds[payload.index]

      if (threshold) {
        threshold[payload.side] = payload.value

        Vue.set(state.thresholds, payload.index, threshold)
      }
    },
    enableExchange(state, exchange) {
      Vue.set(state.exchanges[exchange], 'disabled', false)
    },
    disableExchange(state, exchange) {
      Vue.set(state.exchanges[exchange], 'disabled', true)
    },
    showExchange(state, exchange) {
      Vue.set(state.exchanges[exchange], 'hidden', false)
    },
    hideExchange(state, exchange) {
      Vue.set(state.exchanges[exchange], 'hidden', true)
    },
    toggleExchangeVisibility(state, exchange) {
      Vue.set(
        state.exchanges[exchange],
        'hidden',
        state.exchanges[exchange].hidden === true ? false : true
      )
    },
    toggleSettingsPanel(state, value) {
      const index = state.settings.indexOf(value)

      if (index === -1) {
        state.settings.push(value)
      } else {
        state.settings.splice(index, 1)
      }
    },
    toggleAudio(state, value) {
      state.useAudio = value ? true : false
    },
    toggleAudioIncludeInsignificants(state, value) {
      state.audioIncludeInsignificants = value ? true : false
    },
    setAudioVolume(state, value) {
      state.audioVolume = value
    },
    setTimeframe(state, value) {
      state.timeframe = value
    },
    toggleLiquidations(state, value) {
      state.chartLiquidations = value ? true : false
    },
    toggleCandlestick(state, value) {
      state.chartCandlestick = value ? true : false
    },
    toggleVolume(state, value) {
      state.chartVolume = value ? true : false
    },
    setVolumeThreshold(state, value) {
      state.chartVolumeThreshold = parseFloat(value) || 0
    },
    setVolumeOpacity(state, value) {
      value = parseFloat(value)
      state.chartVolumeOpacity = isNaN(value) ? 1 : value
    },
    toggleVolumeAverage(state, value) {
      state.chartVolumeAverage = value ? true : false
    },
    setVolumeAverageLength(state, value) {
      state.chartVolumeAverageLength = parseInt(value) || 14
    },
    toggleSma(state, value) {
      state.chartSma = value ? true : false
    },
    setSmaLength(state, value) {
      state.chartSmaLength = parseInt(value) || 14
    },
    toggleAutoClearTrades(state, value) {
      state.autoClearTrades = value ? true : false
    },
    setExchangeThreshold(state, payload) {
      Vue.set(
        state.exchanges[payload.exchange],
        'threshold',
        +payload.threshold
      )
    },
    setExchangeMatch(state, payload) {
      Vue.set(state.exchanges[payload.exchange], 'match', payload.match)
    },
    toggleExchangeOHLC(state, exchange) {
      Vue.set(
        state.exchanges[exchange],
        'ohlc',
        state.exchanges[exchange].ohlc === false ? true : false
      )
    },
    setChartHeight(state, value) {
      state.chartHeight = value || null
    },
    setChartRange(state, value) {
      state.chartRange = value
    },
    setChartCandleWidth(state, value) {
      state.chartCandleWidth = value
    },
    setChartPadding(state, value) {
      state.chartPadding = value
    },
    toggleChartGridlines(state, value) {
      state.chartGridlines = value ? true : false
    },
    setChartGridlinesGap(state, value) {
      state.chartGridlinesGap = parseInt(value) || 0
    },
    toggleChartAutoScale(state, value) {
      state.chartAutoScale = value ? true : false
    },
    toggleExchangesBar(state, value) {
      state.showExchangesBar = value ? true : false
    },

    // runtime commit
    setState(state, value) {
      Object.assign(state, value)
    },
    toggleSnap(state, value) {
      state.isSnaped = value ? true : false
    },
    toggleLoading(state, value) {
      state.isLoading = value ? true : false
    },
    toggleReplaying(state, params) {
      state.isReplaying = params ? true : false
    },
    reloadExchangeState(state, exchange) {
      if (!exchange) {
        return
      }

      if (typeof exchange === 'object' && exchange.exchange) {
        exchange = exchange.exchange
      } else if (typeof exchange !== 'string') {
        return
      }

      if (!state.exchanges[exchange]) {
        Vue.set(state.exchanges, exchange, {})
      }

      const index = state.actives.indexOf(exchange)
      const active =
        state.exchanges[exchange].match &&
        !state.exchanges[exchange].disabled &&
        !state.exchanges[exchange].hidden

      if (active && index === -1) {
        state.actives.push(exchange)
      } else if (!active && index >= 0) {
        state.actives.splice(index, 1)
      }
    },
  },
  actions: {
    async fetchUser(context) {
      context.commit('setUser', { loading: true })
      try {
        const { body: { user } } = await Vue.http.get('/api/user/')
        const storedSettings = user.candle_settings || {}
        window.serverLocalStorage.setServerData(user.marketwatch_settings || {})
        if (storedSettings && storedSettings.thresholds && storedSettings.thresholds.length) {
          for (let i = 0; i < storedSettings.thresholds.length; i++) {
            if (typeof storedSettings.thresholds[i].buyColor === 'undefined') {
              storedSettings.thresholds[i].buyColor = DEFAULTS.thresholds[i].buyColor
            }

            if (typeof storedSettings.thresholds[i].sellColor === 'undefined') {
              storedSettings.thresholds[i].sellColor = DEFAULTS.thresholds[i].sellColor
            }
          }
        }
        context.commit('setState', {
          ...storedSettings,
          isLoading: false,
          user: {
            loading: false,
            user
          }
        })
      } catch (e) {
        Vue.notify({
          type: 'error',
          title: 'Server error'
        })
      }
    },
  },
  getters: {
    user(state) {
      if (state.user.loading) {
        return null
      }
      return state.user.user
    }
  }
})

const saveSettings = async (settings) => {
  await Vue.http.post('/api/set_candle_settings/', { settings }, { emulateJSON: true })
}

store.subscribe(function (mutation, state) {
  const copy = JSON.parse(JSON.stringify(state))

  for (let name of EPHEMERAL_PROPERTIES) {
    if (copy.hasOwnProperty(name)) {
      delete copy[name]
    }
  }

  if (
    [
      'reloadExchangeState',
      'setExchangeMatch',
      'toggleSnap',
      'setUser',
      // 'setChartRange', // TODO: fix
      'setState',
      'toggleLoading'
    ].indexOf(
      mutation.type
    ) === -1
  ) {
    delete copy['user']
    saveSettings(JSON.stringify(copy))
  }

  switch (mutation.type) {
    case 'showExchange':
    case 'hideExchange':
    case 'toggleExchangeVisibility':
    case 'enableExchange':
    case 'disableExchange':
    case 'toggleExchangeOHLC':
    case 'setExchangeMatch':
      store._mutations.reloadExchangeState[0](mutation.payload)

      clearTimeout(store._reloadExchangeStateTimeout)

      store._reloadExchangeStateTimeout = setTimeout(() => {
        store.commit('reloadExchangeState', null)
      }, 500)
      break
  }
})

export default store
