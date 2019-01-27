import PropTypes from 'prop-types'
import React from 'react'
import Edge from './Edge'
import withGroupedEvents from '../../hocs/withGroupedEvents'
import ArrowMarker from './ArrowMarker'
import styles from './Edges.module.scss'

function Edges(props) {
  const {edges, onEdgeDoubleClick} = props
  return (
    <svg className={styles.Edges}>
      <defs>
        <ArrowMarker />
      </defs>
      <g>
        {
          edges.map(edge => (
            <Edge
              key={edge.id}
              {...edge}
              onDoubleClick={onEdgeDoubleClick(edge)}
            />
          ))
        }
      </g>
    </svg>
  )
}

const EdgesWithGroupedHandlers = withGroupedEvents([
  'onEdgeDoubleClick',
])(Edges)

EdgesWithGroupedHandlers.propTypes = {
  onEdgeDoubleClick: PropTypes.func.isRequired,
}

export default EdgesWithGroupedHandlers