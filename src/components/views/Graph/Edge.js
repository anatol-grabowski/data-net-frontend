import PropTypes from 'prop-types'
import React from 'react'
import styles from './Edge.module.scss'

export default function Edge(props) {
  const {
    points,
    onDoubleClick,
  } = props
  const [from, to] = points
  return (
    <line className={styles.Edge}
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      onDoubleClick={onDoubleClick}
      markerEnd="url(#arrow)"
    />
  )
}

Edge.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onDoubleClick: PropTypes.func.isRequired,
}