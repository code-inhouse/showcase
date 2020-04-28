import React from 'react'


export default function Feature({id, title, description}) {
  return (
    <div className="feature lg" id={id}>
      <div className="icon"></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
