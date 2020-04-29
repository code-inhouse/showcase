<template>
  <main class="page-wrap" :class="{ 'collapsed': header.collapsed, 'opaque': header.opaque }">
    <div class="container">
    <div class="row">
    <div class="col-md-6">
    <!-- fixed list search/sorting controls -->
    <section class="page-topbar">
        <div class="flex-row flex-middle flex-space">

          <!-- control search -->
          <Search class="light push-right" v-model="searchStr"></Search>

          <!-- control heading -->
          <div class="flex-1 text-clip text-big text-center push-right if-medium">24h Change</div>

          <!-- control dropdown menus -->
          <div class="text-nowrap">

            <Dropdown>
              <button slot="trigger" class="form-btn bg-info-hover icon-down-open">{{ limitCountLabel }}</button>
              <ul slot="list">
                <li class="heading">
                  <span class="form-label">List Limit Options</span>
                </li>
                <li class="clickable" @click="limitList( 10 )">
                  <i class="icon-list-add iconLeft"></i> 10 tokens
                </li>
                <li class="clickable" @click="limitList( 20 )">
                  <i class="icon-list-add iconLeft"></i> 20 tokens
                </li>
                <li class="clickable" @click="limitList( 50 )">
                  <i class="icon-list-add iconLeft"></i> 50 tokens
                </li>
                <li class="clickable" @click="limitList( 100 )">
                  <i class="icon-list-add iconLeft"></i> 100 tokens
                </li>
                <li class="clickable" @click="limitList( 0 )">
                  <i class="icon-list-add iconLeft"></i> All tokens
                </li>
              </ul>
            </Dropdown>&nbsp;

            <Dropdown>
              <button slot="trigger" class="form-btn bg-info-hover iconLeft">
                <i :class="$sorter.getStyles( 'ticker' )"></i> {{ sortByLabel }}
              </button>
              <ul slot="list">
                <li class="heading">
                  <span class="form-label">List Sorting Options</span>
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'token', 'asc' )">
                  <i class="icon-bitcoin iconLeft"></i> Token
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'percent', 'desc' )">
                  <i class="icon-percent iconLeft"></i> Percent
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'close', 'desc' )">
                  <i class="icon-chart-line iconLeft"></i> Price
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'volatility', 'desc' )">
                  <i class="icon-chart-line iconLeft"></i> Volatility
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'danger', 'desc' )">
                  <i class="icon-alert iconLeft"></i> Danger
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'change', 'desc' )">
                  <i class="icon-clock iconLeft"></i> Change
                </li>
                <li class="clickable" @click="$sorter.sortOrder( 'ticker', 'assetVolume', 'desc' )">
                  <i class="icon-chart-area iconLeft"></i> Volume
                </li>
              </ul>
            </Dropdown>&nbsp;

            <Dropdown>
              <button slot="trigger" class="form-btn bg-primary-hover icon-star iconLeft" v-text="options.prices.asset"></button>
              <ul slot="list">
                <li class="heading">
                  <span class="form-label">Filter by Market</span>
                </li>
                <li class="clickable" v-for="asset in assetsList" :key="asset" @click="toggleAsset( asset )">
                  <i class="icon-star iconLeft"></i> {{ asset }}
                </li>
              </ul>
            </Dropdown>&nbsp;

            <Dropdown>
              <button slot="trigger" class="form-btn bg-primary-hover icon-config"></button>
              <div slot="list" class="pad-h">
                <div class="form-label push-bottom push-small">Live Price Options</div>
                <Toggle :text="'Show top coins price in header'" v-model="options.prices.header" @change="saveOptions"></Toggle>
                <Toggle :text="'Show price chart for in list'" v-model="options.prices.chart" @change="saveOptions"></Toggle>
              </div>
            </Dropdown>


        </div>
      </div>
    </section>

    <!-- empty list message -->
    <section class="push-bottom" v-if="!listCount">
        <div class="card pad-all flex-row flex-middle flex-stretch">
          <div class="icon-help iconLarge push-right"></div>
          <div class="text-clip flex-1">
            <div v-if="searchStr">
              <span class="text-bright">No match for <span class="text-secondary">{{ searchStr }}</span></span> <br />
              <span class="text-info">Can't find anything matching your search input.</span>
            </div>
            <div v-else>
              <span class="text-bright">No price data available</span> <br />
              <span class="text-info">Price data from remote API has not loaded yet.</span>
            </div>
          </div>
        </div>
    </section>

    <!-- live ticker price list -->
    <section class="pagelist-wrap">

        <div class="pagelist-item flex-row flex-middle flex-stretch" v-if="tickerList.length">
          <div class="iconWidth push-right if-small"></div>
          <div class="push-right text-clip flex-1"><span class="clickable" @click="$sorter.sortOrder( 'ticker', 'token', 'asc' )">Token</span></div>
          <div class="push-right text-clip flex-1"><span class="clickable" @click="$sorter.sortOrder( 'ticker', 'close', 'desc' )">Price</span></div>
          <div class="well push-right flex-1 if-medium disabled" v-if="options.prices.chart"></div>
          <div class="push-right text-clip flex-1"><span class="clickable" @click="$sorter.sortOrder( 'ticker', 'percent', 'desc' )">Percent</span></div>
          <div class="push-right text-clip flex-1"><span class="clickable" @click="$sorter.sortOrder( 'ticker', 'assetVolume', 'desc' )">Volume</span></div>
          <div class="text-right text-clip flex-1 if-large"><span class="clickable" @click="$sorter.sortOrder( 'ticker', 'trades', 'desc' )">Book</span></div>
        </div>

        <div v-for="p in tickerList" class="pagelist-item flex-row flex-middle flex-stretch clickable" :class="p.style" @click.stop="setRoute( p.route )" :key="p.symbol">

          <div class="push-right if-small" :class="{ 'alarm-bubble': p.alarms }">
            <TokenIcon :image="p.image" :alt="p.token"></TokenIcon>
          </div>

          <div class="push-right text-clip flex-1">
            <big class="text-primary">{{ p.token }}</big> <br />
            <span class="text-secondary">{{ p.name }}</span>
          </div>

          <div class="push-right text-clip flex-1">
            <big class="text-nowrap text-bright">{{ p.close | toFixed( p.asset ) }} <span class="text-info">{{ p.asset }}</span></big> <br />
            <span class="text-nowrap color">{{ p.sign }}{{ p.change | toFixed( p.asset ) }} <span class="text-info">24H</span></span>
          </div>

          <div class="well push-right flex-1 if-medium" v-if="options.prices.chart">
            <LineChart :width="200" :height="28" :values="p.history"></LineChart>
          </div>

          <div class="push-right text-clip flex-1">
            <big class="text-nowrap color">{{ p.sign }}{{ p.percent | toMoney( 3 ) }}%</big> <br />
            <span class="icon-chart-line iconLeft" title="High/Low Volatility Score" v-tooltip>{{ p.volatility | toFixed( 3 ) }}</span>
          </div>

          <div class="push-right text-clip flex-1">
            <big class="text-nowrap text-bright">{{ p.assetVolume | toMoney }} <span class="text-nowrap text-info">{{ p.asset }}</span></big> <br />
            <span class="text-nowrap text-default">{{ p.tokenVolume | toMoney }} <span class="text-nowrap text-info">{{ p.token }}</span></span>
          </div>

          <div class="text-right text-clip flex-1 if-large">
            <big class="text-nowrap text-bright">{{ p.trades | toMoney }}</big> <br />
            <button class="text-primary-hover" @click.stop="tradeLink( p.token, p.asset )" :title="'Trade '+ p.token" v-tooltip>Trades</button>
          </div>

        </div>

        <!-- if there are more items not included in list due to limit option -->
        <div class="pagelist-item flex-row flex-middle flex-space" v-if="listCount">
          <div class="text-info icon-list iconLeft">{{ listLeftText }}</div>
          <button v-if="listLeft" class="text-bright-hover icon-list-add iconLeft" @click="limitList( 0 )">Show all</button>
        </div>

    </section>
</div>
<div class="col-md-6">
  <section class="page-topbar">
      <div class="flex-row flex-middle flex-space">

        <!-- control search -->
        <Search class="light push-right" v-model="searchStr"></Search>

        <!-- control heading -->
        <div class="flex-1 text-clip text-big text-center push-right if-medium">
          Twitter News ({{ newCount }}/{{ newsEntries.length }})
        </div>

        <!-- control dropdown menus -->
        <div class="text-nowrap">

          <Dropdown>
            <button slot="trigger" class="form-btn bg-primary-hover icon-down-open iconLeft">{{ filterLabel }}</button>
            <div slot="list">

              <div class="flex-row flex-top flex-space pad-h push-bottom">
                <div class="flex-1 push-right form-label icon-twtr iconLeft">Twitter Accounts ({{ accountsList.length }})</div>
                <button v-if="searchHandle" class="text-bright-hover icon-list iconLeft" @click="searchHandle = ''">Show all</button>
              </div>

              <div class="tablelist-wrap push-bottom">
                <div class="tablelist-content">
                  <div class="tablelist-row flex-row flex-middle flex-stretch" v-for="a in accountsList" :key="a.handle">
                    <div class="flex-1 text-bright-hover text-clip clickable push-right" @click="applyFilters( '', a.handle )">
                      <span class="text-info icon-twtr"></span>
                      <span class="text-clip" :class="{ 'text-gain': a.active, 'text-danger text-striked': a.error }" :title="a.name" v-tooltip>@{{ a.handle }}</span>
                    </div>
                    <div class="push-right">
                      <span class="clickable" title="Fetch" @click="fetchByHandle( a.handle )" v-tooltip>
                        <span v-if="a.fetching" class="text-badge text-primary">...</span>
                        <span v-else class="text-badge">{{ a.count }}</span>
                      </span>
                    </div>
                    <button class="icon-close text-danger-hover" title="Remove" v-tooltip @click="removeTwitterHandler( a.handle )"></button>
                  </div>
                </div>
              </div>

              <form class="twitter-accounts-form pad-h push-bottom" action="#" autocomplete="off" @submit.prevent="accountFormHandler">
                <div class="form-input text-nowrap">
                  <div class="icon-twtr iconLeft"></div>
                  <input class="flex-1" type="text" name="handle" placeholder="Add twitter @handle..." />
                  <button class="icon-add text-primary-hover" type="submit"></button>
                </div>
              </form>

              <div class="text-nowrap pad-h">
                <button class="icon-add iconLeft text-bright-hover" @click="importAccounts()">Import List</button>
                <span class="text-grey">&nbsp;&nbsp;</span>
                <button class="icon-save iconLeft text-bright-hover" @click="exportAccounts()">Export List</button>
              </div>

            </div>
          </Dropdown> &nbsp;

          <Dropdown>
            <button slot="trigger" class="form-btn bg-primary-hover icon-config"></button>
            <div slot="list" class="pad-h">

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">News &amp; Notifications Options</div>
                <Toggle :text="'Auto re-fetch latest news'" v-model="options.news.enabled" @change="saveOptions"></Toggle>
                <Toggle :text="'Notify when news is available'" v-model="options.news.notify" @change="saveOptions"></Toggle>
                <Toggle :text="'E-mail news notifications'" v-model="options.news.send" @change="saveOptions"></Toggle>
              </div>

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">How often to send fetch requests</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="1" max="60" step="1" v-model="options.news.interval" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.interval | toNoun( 'sec', 'secs' ) }}</span>
                </div>
              </div>

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">Delay re-fetching from same source</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="60" max="600" step="10" v-model="options.news.delay" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.delay | toNoun( 'sec', 'secs' ) }}</span>
                </div>
              </div>

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">Tweets to fetch from each source</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="1" max="10" step="1" v-model="options.news.tweets" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.tweets | toNoun( 'tweet', 'tweets' ) }}</span>
                </div>
              </div>

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">Limit tweets by days posted</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="1" max="30" step="1" v-model="options.news.days" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.days | toNoun( 'day', 'days' ) }}</span>
                </div>
              </div>

              <div class="push-bottom">
                <div class="form-label push-bottom push-small">Total number of tweets to store</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="10" max="400" step="10" v-model="options.news.total" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.total }}</span>
                </div>
              </div>

              <div>
                <div class="form-label push-bottom push-small">Limit visible tweets on page</div>
                <div class="flex-row flex-middle flex-stretch">
                  <input class="flex-1 push-right" type="range" min="10" max="100" step="10" v-model="options.news.max" @change="saveOptions" />
                  <span class="text-bright">{{ options.news.max }}</span>
                </div>
              </div>

            </div>
          </Dropdown>

        </div>

      </div>
  </section>

  <!-- chart section -->
  <section class="push-bottom">

      <div class="card tablelist-wrap">

        <!-- list headers -->
        <div class="tablelist-header">
          <div class="flex-row flex-middle flex-stretch">
            <div class="tablelist-20 text-clip push-right">
              <span class="clickable" @click="$sorter.sortOrder( 'sentiment', 'name', 'asc' )">
                Name <i class="text-primary" :class="$sorter.getStyles( 'sentiment', 'name' )"></i>
              </span>
            </div>
            <div class="tablelist-10 text-nowrap push-right if-small">
              <span class="clickable" @click="$sorter.sortOrder( 'sentiment', 'token', 'asc' )">
                Token <i class="text-primary" :class="$sorter.getStyles( 'sentiment', 'token' )"></i>
              </span>
            </div>
            <div class="tablelist-10 text-nowrap text-right push-right if-small">
              <span class="clickable" @click="$sorter.sortOrder( 'sentiment', 'count', 'desc' )">
                Tweets <i class="text-primary" :class="$sorter.getStyles( 'sentiment', 'count' )"></i>
              </span>
            </div>
            <div class="tablelist-30 text-nowrap text-grey push-right if-medium">
              <span class="clickable" @click="$sorter.sortOrder( 'sentiment', 'barPercent', 'desc' )">
                Mention % <i class="text-primary" :class="$sorter.getStyles( 'sentiment', 'barPercent' )"></i>
              </span>
            </div>
            <div class="tablelist-20 text-nowrap push-right">
              <span class="clickable" @click="$sorter.sortOrder( 'sentiment', 'sentiment', 'asc' )">
                Sentiment <i class="text-primary" :class="$sorter.getStyles( 'sentiment', 'sentiment' )"></i>
              </span>
            </div>
            <div class="tablelist-10 text-nowrap text-grey text-right">
              Details
            </div>
          </div>
        </div>

        <!-- list default greet message -->
        <div class="tablelist-content pad-v text-center text-info" v-if="!chartData.length">
          <div class="icon-chart-line iconLarge"></div>
          <div>Sentiment analysis data for each Binance token based on loaded tweets.</div>
          <div v-html="sentimentInfoText"></div>
        </div>

        <!-- list items -->
        <div class="tablelist-content" v-if="chartData.length">
          <div class="tablelist-row flex-row flex-middle flex-stretch" v-for="d in chartList" :key="d.token">
            <div class="tablelist-20 text-clip text-primary push-right">
              <button title="Search" @click="applyFilters( d.search, '' )" v-tooltip><i class="icon-search text-info"></i> {{ d.name }}</button>
            </div>
            <div class="tablelist-10 text-clip text-secondary push-right if-small">{{ d.token }}</div>
            <div class="tablelist-10 text-nowrap text-right push-right if-small">{{ d.count }}</div>
            <div class="tablelist-30 text-nowrap push-right if-medium">
              <div v-if="d.barPercent" class="percent-bar">
                <div :class="d.barColor" :style="{ 'width': d.barPercent +'%' }"></div>
              </div>
            </div>
            <div class="tablelist-20 text-nowrap push-right" :class="d.styles" v-html="d.sentiment"></div>
            <div class="tablelist-10 text-nowrap text-right">
              <button v-if="d.route" class="icon-chart-line iconLeft text-btn bg-info-hover" @click.stop="$bus.emit( 'setRoute', d.route )">Info</button>
            </div>
          </div>
        </div>

        <!-- list bottom info -->
        <div class="tablelist-header">
          <div class="newspage-chart-row flex-row flex-middle flex-stretch text-grey">
            <div class="flex-1 text-clip">Sentiment analysis for {{ chartData.length | toNoun( 'token', 'tokens' ) }} found in all available tweets.</div>
            <div class="text-right">
              <button class="icon-close iconLeft text-danger-hover" @click="flushTweets()">Flush Data</button>
            </div>
          </div>
        </div>

      </div>

  </section>

  <!-- fallback section -->
  <section class="push-bottom" v-if="!tweetsList.length">
      <div class="card pad-all flex-row flex-middle flex-stretch">
        <div class="icon-help iconLarge text-grey push-right"></div>
        <div class="flex-1">
          <div v-if="searchStr">
            <h3 class="text-bright">No Match For <span class="text-primary">{{ searchStr }}</span></h3>
            <span class="text-grey">Can't find anything matching your search input.</span>
          </div>
          <div v-else-if="searchHandle">
            <h3 class="text-bright">No News Data For <a class="text-primary-hover" :href="'https://twitter.com/'+ searchHandle" target="_blank">{{ filterLabel }}</a></h3>
            <span class="text-grey">There are no entries available for the selected news source.</span>
          </div>
          <div v-else>
            <h3 class="text-primary">No News Data Yet</h3>
            <span class="text-grey">News data from remote sources has not loaded yet.</span>
          </div>
        </div>
      </div>
  </section>

  <!-- news list -->
  <section class="pagelist-wrap" id="newspage-list">

      <div class="pagelist-item flex-row flex-top flex-stretch" v-for="t in tweetsList" :key="t.id">
        <div class="push-right" :class="{ 'alert-bubble': t.isNew }">
          <img class="img-round" :src="t.avatar" width="40" height="40" :alt="t.handle" />
        </div>
        <div class="flex-1">
          <div class="flex-row flex-space push-bottom">
            <h3 class="text-clip clickable" @click="openLink( 'https://twitter.com/'+ t.handle )">
              <span class="text-primary-hover">{{ t.name }}</span>
              <small class="text-smaller text-grey-hover">@{{ t.handle }}</small>
            </h3>
            <div class="text-clip if-small">
              <a class="text-secondary-hover" :href="t.link" target="_blank" title="View tweet" v-tooltip>{{ t.time | toElapsed( 'ago', true ) }}</a> &nbsp;
              <button type="button" class="icon-close text-danger-hover" title="Delete" @click="deleteTweet( t.id )" v-tooltip></button>
            </div>
          </div>
          <div class="text-small text-wrap" v-html="tweetHtml( t.text )"></div>
        </div>
      </div>

  </section>
</div>
</div>
</div>
    <!-- list spinner -->
    <Spinner class="fixed" ref="spinner"></Spinner>

  </main>
</template>

<script>
import Spinner from './Spinner.vue';
import Search from './Search.vue';
import TokenIcon from './TokenIcon.vue';
import Dropdown from './Dropdown.vue';
import Toggle from './Toggle.vue';
import LineChart from './LineChart.vue';
import files from '../modules/files';
import twitterAccounts from '../configs/twitterAccounts';

// component
export default {

  // component list
  components: { Spinner, Search, TokenIcon, Dropdown, Toggle, LineChart },

  // component props
  props: {
    header: { type: Object, default() { return {} } },
    options: { type: Object, default() { return {} }, required: true },
    sortData: { type: Object, default() { return {} }, required: true },
    priceData: { type: Array, default() { return [] }, required: true },
    assetsList: { type: Array, default() { return [] }, required: true },
    tickerStatus: { type: Number, default: 0 },
    newsHandlers: { type: Array, default() { return [] }, required: true },
    newsEntries: { type: Array, default() { return [] }, required: true },
  },

  // comonent data
  data() {
    return {
      searchStr: '',
      listCount: 0,
      listLeft: 0,
      searchHandle: '',
      // coins data
      totalTokens: 0,
      chartData: [],
      chartSort: 'count',
      chartOrder: 'desc',
      // count data
      newCount: 0,
      maxCount: 50,
    }
  },

  // watch methods
  watch: {

    priceData() {
      this.updateSpinner();
    },
    tickerStatus() {
      this.updateSpinner();
    },
    // update chart data when tweets change
    newsEntries() {
      this.updateChart();
    },
  options() {
    this.updateChart();
  },
  },

  // computed methods
  computed: {

    // get filtered and sorted ticker list for display
    tickerList() {
      let { asset } = this.options.prices;
      let { column, order } = this.sortData.ticker;

      let limit = parseInt( this.options.prices.limit ) | 0;
      let regex = ( this.searchStr.length > 1 ) ? new RegExp( '^('+ this.searchStr +')', 'i' ) : null;
      let count = this.priceData.length;
      let list  = [];

      // filter the list
      while ( count-- ) {
        let p = this.priceData[ count ];
        if ( asset && p.asset !== asset ) continue;
        if ( regex && !( regex.test( p.token ) || regex.test( p.name ) ) ) continue;
        list.push( p );
      }
      // sort the list
      list = this.$utils.sort( list, column, order );

      // update paging totals
      let total = list.length;
      this.listCount = total;
      this.listLeft = 0;

      // trim the list
      if ( total && limit && limit < total ) {
        list = list.slice( 0, limit );
        this.listLeft = ( total - list.length );
      }
      return list;
    },

    // sort-by label for buttons, etc
    sortByLabel() {
      let { column } = this.sortData.ticker;
      switch ( column ) {
        case 'token'       :  return 'Token';
        case 'percent'     :  return 'Percent';
        case 'close'       :  return 'Price';
        case 'volatility'  :  return 'Volatility';
        case 'danger'      :  return 'Danger';
        case 'change'      :  return 'Change';
        case 'assetVolume' :  return 'Volume';
        case 'tokenVolume' :  return 'Volume';
        case 'trades'      :  return 'Trades';
        default            :  return 'Default';
      }
    },

    // text to show in limit filter controls
    limitCountLabel() {
      let limit = parseInt( this.options.prices.limit ) | 0;
      if ( limit && limit < this.listCount ) return limit +'/'+ this.listCount;
      return 'All '+ this.listCount;
    },

    // text about hidden list pair
    listLeftText() {
      let total  = this.listCount;
      let remain = this.listLeft;
      let asset  = this.options.prices.asset;
      let limit  = this.options.prices.limit;
      let count  = this.$utils.noun( total, asset +' token pair', asset +' token pairs' );
      if ( remain ) return 'Showing '+ limit +' of '+ count;
      return 'Showing all '+ count;
    },
    // get sorted chart list
    chartList() {
      let { column, order } = this.sortData.sentiment;
      let list = this.chartData.slice(); // copy
      list = this.$utils.sort( list, column, order ); // sort
      return list;
    },

    // get filtered list
    tweetsList() {
      let { fullword, fullcase } = this.options.search;
      let list = this.newsEntries.slice(); // copy

      if ( this.searchHandle ) {
        list = list.filter( t => t.handle === this.searchHandle );
      }
      if ( this.searchStr && this.searchStr.length > 1 ) {
        list = this.$utils.search( list, 'text', this.searchStr, fullword, fullcase );
      }
      if ( this.options.news.max ) {
        list = list.slice( 0, this.options.news.max );
      }
      return list;
    },

    // build twitter accounts list from handler list with checking indicator
    accountsList() {
      let list = this.newsHandlers.map( tw => {
        let { uid, handle, name, avatar, url, last, fetching, error } = tw.getData();
        let active = ( handle === this.searchHandle );
        let count = this.newsEntries.filter( t => t.handle === handle ).length;
        return { uid, handle, name, avatar, url, last, error, active, fetching, count };
      });
      return this.$utils.sort( list, 'count', 'desc' );
    },

    // sort-by label for buttons, etc
    filterLabel() {
      let l = this.newsHandlers.length;
      let t = this.newsHandlers.filter( tw => tw.handle === this.searchHandle ).shift();
      if ( t && t.handle ) return '@'+ t.handle;
      return 'All Sources ('+ l +')';
    },




        // get news list for a token, or all items
        getNewsList() {
          let pair = this.pairData;
          let list = this.newsEntries;

          if ( pair.token ) {
            let search = pair.token +'|'+ pair.name;
            list = this.$utils.search( list, 'text', search, true );
          }
          this.$emit( 'listCount', list.length );
          return list;
        },

        // analize news data for token
        analizeNewsList() {
          let data = null;
          let list = this.getNewsList();

          if ( list.length && this.pairData.token ) {
            let text = list.reduce( ( a, t ) => a += ' '+ t.text, '' ).trim();
            data = this.$sentiment.analyze( text );
          }
          this.sentimentData = data;
        },

        // calculate default message for sentiment chart
        sentimentInfoText() {
          // no twitter handles to fetch from
          if ( !this.newsHandlers.length ) {
            return 'Not tracking any Twitter accounts, use the Sources menu above to track accounts...';
          }
          // option enabled, but no token data loaded yet
          if ( this.options.news.enabled && !this.priceData.length ) {
            return 'Currently waiting for tokens to load from the Binance socket API...';
          }
          // option enabled, but no tweets data loaded yet
          if ( this.options.news.enabled && !this.newsEntries.length ) {
            return 'Currently waiting for tweets data to load for tracked Twitter accounts...';
          }
          // option to fetch disabled and there are no tweets to scan
          if ( !this.options.news.enabled && !this.newsEntries.length ) {
            return 'No tweets loaded, use the <i class="icon-config"></i> Gear icon to enable fetching.';
          }
        },
  },

  // custom mounted
  methods: {

    // apply options
    saveOptions() {
      this.$opts.saveOptions( this.options );
    },
    // apply filters
    applyFilters( search, handle ) {
      this.searchStr = String( search || '' ).trim();
      this.searchHandle = String( handle || '' ).trim();
    },
    // reset filters
    resetFilters() {
      this.searchStr = '';
      this.searchHandle = '';
    },
    // et app url route
    setRoute( route ) {
      this.$marketRouter.setRoute( route );
    },

    // lick to binance site with ref id added
    tradeLink( token, asset ) {
      this.$bus.emit( 'handleClick', 'binance', '/en/trade/'+ token +'_'+ asset +'/', '_blank' );
    },

    // set list limit value
    limitList( num ) {
      this.options.prices.limit = parseInt( num ) | 0;
      this.saveOptions();
    },

    // filter by asset
    toggleAsset( asset ) {
      this.options.prices.asset = String( asset || 'BTC' );
      this.saveOptions();
    },

    // update page spinner
    updateSpinner() {
      if ( !this.$refs.spinner ) return;
      if ( this.tickerList.length ) return this.$refs.spinner.hide();
      if ( this.tickerStatus === 0 ) return this.$refs.spinner.error( 'Socket API not connected' );
      if ( this.tickerStatus === 1 ) return this.$refs.spinner.show( 'Waiting for price data' );
    },
    // open external link
    openLink( link ) {
      window.open( link, '_blank' );
    },



        // scan tweets against list of tokens from api and build sentiment analysis data for chart
        updateChart() {
          let { fullword, fullcase } = this.options.search;
          let tokens = [];
          let data = [];

          // build unique list of tokens from binance api
          this.priceData.forEach( p => {
            if ( tokens.filter( t => t.token === p.token ).length ) return;
            let { token, name } = p;
            let asset = ( token === 'BTC' ) ? 'USDT' : 'BTC';
            let route = '/symbol/'+ token + asset;
            tokens.push( { token, name, route } );
          });
          // add other things to the list
          if ( this.priceData.length ) {
            tokens.push( { token: 'Crypto', name: 'Cryptocurrency', route: '/symbol/BTCUSDT' } );
            tokens.push( { token: 'XBT', name: 'BTC Contract', route: '/symbol/BTCUSDT' } );
          }
          // build sentiment
          tokens.forEach( p => {
            let token  = p.token;
            let name   = p.name;
            let route  = p.route;
            let search = token +'|'+ name;
            let list   = this.$utils.search( this.newsEntries, 'text', search, fullword, fullcase );
            let count  = list.length;
            if ( !count ) return;
            let text   = list.reduce( ( a, t ) => a += ' '+ t.text, '' ).trim();
            let sdata  = this.$sentiment.analyze( text );
            let { score, positive, negative, comparative, sign, word, styles, sentiment } = sdata;
            data.push( { token, name, search, route, count, score, styles, sentiment } );
          });
          // calculate percent
          let max = data.reduce( ( m, d ) => d.count > m ? d.count : m, 0 );
          this.chartData = data.map( d => {
            let ratio = ( max > 0 ) ? ( d.count / max ) : 0.1;
            let barPercent = Math.round( ratio * 100 );
            let barColor = 'bg-grey';
            if ( barPercent > 20 ) { barColor = 'bg-bright'; }
            if ( barPercent > 40 ) { barColor = 'bg-secondary'; }
            if ( barPercent > 60 ) { barColor = 'bg-primary'; }
            return Object.assign( d, { barPercent, barColor } );
          });
        },

        // convert links inside a tweet into html
        tweetHtml( text ) {
          return this.$utils.linkUrl( text );
        },

        // when a new entry is added to news list
        onNewsEntry( tweet ) {
          let { time, handle, name, text, avatar, link } = tweet;
          let secs    = ( Date.now() - time ) / 1000;
          let mins    = Math.floor( secs / 60 );
          let elapsed = this.$utils.elapsed( secs );
          let isaway  = ( !document.hasFocus() );
          let isnew   = ( Math.floor( secs / 60 ) <= 60 ); // within 1hr

          // remove html and urls from tweet text
          text = this.$utils.stripHtml( text, true );
          if ( !text ) return;

          // show tweet notification only if enabled and away
          if ( this.options.news.notify && isnew && isaway ) {
            text = 'Tweeted '+ elapsed +' ago... \n\n' + text;
            this.$marketwatchNotify.add( '@'+ handle, text, avatar, link );
          }
          // always send notification via api if enabled
          if ( this.options.news.send ) {
            let info = `<a href="${ link }">${ text }</a>`;
            this.$messenger.add( name, info, avatar );
          }
        },

        // export list of account handles as json file
        exportAccounts() {
          let list = this.newsHandlers.map( t => t.handle );
          files.exportData( 'binance_watch_news_sources', list );
        },

        // import list of account handles from json file
        importAccounts() {
          files.importData( accounts => {
            let total = accounts.length | 0;
            let saved = this.$news.importAccounts( accounts, true, true );
            this.$bus.emit( 'showNotice', 'Imported '+ saved +'/'+ total +' twitter accounts.', 'success' );
          });
        },

        // fetch tweets for an account by handle
        fetchByHandle( handle ) {
          if ( this.$news.fetchByHandle( handle ) ) {
            this.$bus.emit( 'showNotice', 'Fetching latest tweets from @'+ handle +'...', 'success' );
          }
        },

        // remove single tweet from list by id
        deleteTweet( id ) {
          if ( !this.$news.blockTweet( id ) ) return;
          this.$bus.emit( 'showNotice', 'News entry has been removed.', 'success' );
        },

        // flush list of saved tweets from store
        flushTweets() {
          if ( !confirm( 'Remove all news entries?' ) ) return;
          this.$news.flushTweets();
          this.$bus.emit( 'showNotice', 'All news entries have been deleted.', 'success' );
        },

        // handle adding accounts from a form
        accountFormHandler( e ) {
          if ( !e || !e.target ) return;

          let handle = String( e.target.handle.value || '' ).replace( /[^\w]+/g, '' ).trim();
          if ( !handle ) return this.$bus.emit( 'showNotice', 'Please enter a valid twitter handle.', 'warning' );

          let added = this.$news.trackAccount( handle, true, true );
          if ( added ) { this.$bus.emit( 'showNotice', 'Started tracking tweets from @'+ handle +'.', 'success' ); }
          else { this.$bus.emit( 'showNotice', 'Could not add account @'+ handle +'.', 'warning' ); }

          this.resetFilters();
          e.target.reset();
        },

        // remove instance of Twitter handler from list
        removeTwitterHandler( handle ) {
          if ( !confirm( 'Stop tracking tweets from @'+ handle +'?' ) ) return;

          let removed = this.$news.untrackAccount( handle );
          if ( removed ) { this.$bus.emit( 'showNotice', 'Stopped tracking tweets from @'+ handle +'.', 'success' ); }
          else { this.$bus.emit( 'showNotice', 'Could not remove account @'+ handle +'.', 'warning' ); }

          this.resetFilters();
        },

        // mark tweets as viewed
        resetTweets() {
          if ( document.visibilityState === 'visible' ) return;
          this.$news.resetTweets(); // reset when hidden
        },

      },
      // on component beforeMount
      beforeMount() {
        this.$news.on( 'tweet', this.onNewsEntry );
        this.$news.importAccounts( twitterAccounts ); // default accounts
      },
      // on component mounted
      mounted() {

        this.$news.loadAccounts(); // load saved accounts
        this.$news.loadTweets(); // load saved tweets
        document.removeEventListener( 'visibilitychange', this.resetTweets );

      },
      destroyed() {
        document.removeEventListener( 'visibilitychange', this.resetTweets );
      },


  // on component mounted
  mounted() {
    this.updateSpinner();
  }
}
</script>

<style lang="scss">
.pagelist-item-chart {
  padding: .5em;
  background-image: radial-gradient( ellipse at top right, rgba( #000, 0.2 ) 0%, rgba( #000, 0 ) 100% );
  border-radius: $lineJoin;
}
#newspage-list h3.text-clip.clickable {
    margin-top: 6px;
    font-size: 1rem;
    margin-bottom: 0px;
}
.row{
  padding:20px;
}
</style>
