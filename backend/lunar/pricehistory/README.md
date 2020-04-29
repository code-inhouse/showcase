## How to install


1. Install dependencies

```bash
cd api/
npm install
```

2. Run server

```bash
node index
```

## Configuration
All settings are optional and can be changed in the [server configuration file](server/config.json) 

```js
{
  // the port which the server will be served at 
  "port": 3000,
  
  // delay (in ms) between server each broadcast to avoid saturation
  "delay": 200, // (the higher the better performance wise)
  
  // pair used by the server
  "pair": "BTCUSD"

  // restrict origin (now using regex)
  origin: '.*',

  // max interval an ip can fetch in a limited amount of time (usage restriction, default 7 day)
  maxFetchUsage: 1000 * 60 * 60 * 24 * 7,

  // the limited amount of time in which the user usage will be stored
  fetchUsageResetInterval: 1000 * 60 * 10,

  // admin access type (whitelist, all, none)
  admin: 'whitelist',

  // enable websocket server on startup
  websocket: true,

  // storage solution, either 
  // "none" (no storage, everything is wiped out after broadcast)
  // "files" (periodical text files),
  // "influx" (time serie database),
  // "es" (experimental)
  storage: 'files',
  
  // store interval (in ms)
  backupInterval: 1000 * 60,

  // elasticsearch server to use when storage is set to "es"
  esUrl: 'localhost:9200',

  // influx db server to use when storage is set to "influx"
  influxUrl: 'localhost:9200',

  // create new text file every N ms when storage is set to "file"
  filesInterval: 3600000,
}
```

All options can be set using CLI
- Setting port `node index port=3001`
- Setting port & pair `node index port=3002 pair=ETHUSD`
- Setting port & pair and restrict to some exchanges `node index port=3002 pair=ETHUSD bitmex bitfinex kraken`