/**
 * Watchform presets
 */
export default [
  {
    name: 'Top Volume',
    info: 'Coins with recent high trading volume.',
    options: {
      asset: 'BTC',
      priceType: 'change',
      priceChange: '2',
      priceCheck: 'below',
      price: '',
      volumeType: 'gain',
      volumeChange: '2',
      volumeCheck: 'above',
      volume: '1000',
      volatilityCheck: 'above',
      volatility: '0',
      dangerCheck: 'below',
      danger: '0',
      timeCheck: 'less',
      timeLimit: '60',
    }
  },
  {
    name: 'Big Change',
    info: 'Big price change within a short time period.',
    options: {
      asset: 'BTC',
      priceType: 'change',
      priceChange: '3',
      priceCheck: 'above',
      price: '0.00000100',
      volumeType: 'gain',
      volumeChange: '2',
      volumeCheck: 'above',
      volume: '',
      volatilityCheck: 'above',
      volatility: '5',
      dangerCheck: 'above',
      danger: '0',
      timeCheck: 'less',
      timeLimit: '30',
    }
  },
  {
    name: 'Sudden Volume Increase',
    info: 'Small price change with low volume.',
    options: {
      asset: 'BTC',
      priceType: 'change',
      priceChange: '1.5',
      priceCheck: 'above',
      price: '0.00000010',
      volumeType: 'gain',
      volumeChange: '25',
      volumeCheck: 'above',
      volume: '250',
      volatilityCheck: 'above',
      volatility: '0',
      dangerCheck: 'below',
      danger: '0',
      timeCheck: 'less',
      timeLimit: '15',
    }
  },
]
