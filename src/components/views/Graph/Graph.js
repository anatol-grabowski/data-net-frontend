import React from 'react'
import PropTypes from 'prop-types'
import Nodes from './Nodes'
import Edges from './Edges'
import withPanAndZoom from '../../hocs/withPanAndZoom'
import styles from './Graph.module.scss'

function Graph(props) {
  const {
    nodes,
    edges,
    onNodeMouseDown,
    onNodeMouseUp,
    onNodeDoubleClick,
    onEdgeMouseDown,
    onEdgeDoubleClick,
  } = props
  return (
    <div className={styles.Graph}>
      <Edges
        edges={edges}
        onEdgeMouseDown={onEdgeMouseDown}
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

Graph.defaultProps = {
  onNodeMouseUp: null,
}

Graph.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  edges: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNodeMouseDown: PropTypes.func.isRequired,
  onNodeMouseUp: PropTypes.func,
  onNodeDoubleClick: PropTypes.func.isRequired,
  onEdgeMouseDown: PropTypes.func.isRequired,
  onEdgeDoubleClick: PropTypes.func.isRequired,
}

export default withPanAndZoom(Graph)