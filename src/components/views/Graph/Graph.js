import React from 'react'
import PropTypes from 'prop-types'
import Nodes from './Nodes'
import Edges from './Edges'
import withPanAndZoom from '../../hocs/withPanAndZoom'
import { cutEdge } from '../../../services/cut-edge'
import styles from './Graph.module.scss'

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.nodesSizesMap = new Map()
    this.state = {
      edges: props.edges,
      recalculatedEdges: props.edges,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.edges === state.edges) return null
    return {
      edges: props.edges,
      recalculatedEdges: props.edges,
    }
  }

  recalculateEdges() {
    const recalculatedEdges = this.props.edges.map(e => {
      const fromSize = this.nodesSizesMap.get(e.from) || [0, 0]
      const toSize = this.nodesSizesMap.get(e.to) || [0, 0]
      return {
        ...e,
        points: cutEdge(e.points, fromSize, toSize)
      }
    })
    this.setState({
      recalculatedEdges,
    })
  }

  handleNodeResize = (node, contentRect) => {
    if (!contentRect.entry) return
    const w = contentRect.entry.width
    const h = contentRect.entry.height
    this.nodesSizesMap.set(node.id, [w, h])
    this.recalculateEdges()
  }

  render() {
    const {
      nodes,
      onNodeMouseDown,
      onNodeMouseUp,
      onNodeDoubleClick,
      onEdgeMouseDown,
      onEdgeDoubleClick,
    } = this.props
    const {
      recalculatedEdges,
    } = this.state
    const {
      handleNodeResize,
    } = this
    console.log('recalc', recalculatedEdges)
    return (
      <div className={styles.Graph}>
        <Edges
          edges={recalculatedEdges}
          onEdgeMouseDown={onEdgeMouseDown}
          onEdgeDoubleClick={onEdgeDoubleClick}
        />
        <Nodes
          nodes={nodes}
          onNodeMouseDown={onNodeMouseDown}
          onNodeMouseUp={onNodeMouseUp}
          onNodeDoubleClick={onNodeDoubleClick}
          onResize={handleNodeResize}
        />
      </div>
    )
  }
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
