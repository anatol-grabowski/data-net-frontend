import PropTypes from 'prop-types'
import React from 'react'
import Node from './Node'
import withGroupedEvents from '../../hocs/withGroupedEvents'
import styles from './Nodes.module.scss'

function Nodes(props) {
  const {
    nodes,
    onNodeMouseDown,
    onNodeMouseUp,
    onNodeDoubleClick
  } = props
  return (
    <div className={styles.Nodes}>
      {
        nodes.map(node => (
          <Node
            key={node.id}
            {...node}
            onMouseDown={onNodeMouseDown(node)}
            onMouseUp={onNodeMouseUp(node)}
            onDoubleClick={onNodeDoubleClick(node)}
          />
        ))
      }
    </div>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNodeMouseDown: PropTypes.func.isRequired,
  onNodeMouseUp: PropTypes.func.isRequired,
  onNodeDoubleClick: PropTypes.func.isRequired,
}

const NodesWithGroupedHandlers = withGroupedEvents([
  'onNodeMouseDown',
  'onNodeMouseUp',
  'onNodeDoubleClick',
])(Nodes)

NodesWithGroupedHandlers.propTypes = {
  onNodeMouseDown: PropTypes.func.isRequired,
  onNodeMouseUp: PropTypes.func.isRequired,
  onNodeDoubleClick: PropTypes.func.isRequired,
}

export default NodesWithGroupedHandlers