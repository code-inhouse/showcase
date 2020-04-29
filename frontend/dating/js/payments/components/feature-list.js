import React from 'react'

import Feature from './feature'


export default function FeatureList({features, className}) {
  return (
    <div className={`icons feature_list ${className}`}>
      {features}
    </div>
  )
}
