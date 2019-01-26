import React from 'react'
import PropTypes from 'prop-types'
import Nodes from './Nodes'
import Edges from './Edges'
import styles from './Graph.module.scss'

export default function Graph(props) {
  const {
    nodes,
    edges,
    onNodeMouseDown,
    onNodeMouseUp,
    onNodeDoubleClick,
    onEdgeDoubleClick,
  } = props
  return (
    <div className={styles.Graph}>
      <Edges
        edges={edges}
        onEdgeDoubleClick={onEdgeDoubleClick}
      />
      <Nodes
        nodes={nodes}
        onNodeMouseDown={onNodeMouseDown}
        onNodeMouseUp={onNodeMouseUp}
        onNodeDoubleClick={onNodeDoubleClick}
      />
    </div>
  )
}

Graph.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  edges: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNodeMouseDown: PropTypes.func.isRequired,
  onNodeMouseUp: PropTypes.func.isRequired,
  onNodeDoubleClick: PropTypes.func.isRequired,
  onEdgeDoubleClick: PropTypes.func.isRequired,
}
