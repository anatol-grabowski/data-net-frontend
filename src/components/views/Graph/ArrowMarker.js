import React from 'react'

export default function ArrowMarker() {
  return (
    <marker id="arrow" markerWidth="30" markerHeight="10" refX="30" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L30,3 z" fill="#000" />
    </marker>
  )
}