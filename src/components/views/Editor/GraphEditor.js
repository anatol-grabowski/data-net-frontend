import Debug from 'debug'
import PropTypes from 'prop-types'
import React from 'react'
import GraphArea from './GraphArea'
import EditArea from './EditArea'
import styles from './GraphEditor.module.scss'

const debug = Debug('GraphEditor')

function getNodeForRender(node) {
  const {
    x,
    y,
    text,
    details,
  } = node.data
  const nodeForRender = {
    id: node.id,
    coords: [x, y],
    text,
    details: details || '',
    attachments: [],
  }
  return nodeForRender
}

function getEdgeForRender(edge) {
  const from = [edge.from.data.x, edge.from.data.y]
  const to = [edge.to.data.x, edge.to.data.y]
  const edgeForRender = {
    id: edge.id,
    points: [from, to],
  }
  return edgeForRender
}

function getGraphForRender(graph) {
  if (!graph) return { nodes: [], edges: [] }
  const nodes = graph.nodes.map(n => getNodeForRender(n))
  const edges = graph.edges.map(e => getEdgeForRender(e))
  return { nodes, edges }
}

export default class GraphEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: getGraphForRender(props.graph)
    }
  }

  handleAddNode = (pos) => {
    debug('add node', pos)
  }

  handleAddEdgeBegin = (nodeId, pos) => {
    debug('add edge begin', nodeId, pos)
  }

  handleAddEdgeMove = (nodeId, pos) => {
    debug('add edge move', nodeId, pos)
  }

  handleAddEdgeCancel = () => {
    debug('add edge cancel')
  }

  handleAddEdgeEnd = (fromId, toId) => {
    debug('add edge end', fromId, toId)
  }

  handleRemoveNode = (nodeId) => {
    debug('remove node', nodeId)
  }

  handleRemoveEdge = (edgeId) => {
    debug('remove edge', edgeId)
  }

  handleEditNodeBegin = (nodeId) => {
    debug('edit node begin', nodeId)
  }

  handleEditEdgeBegin = (edgeId) => {
    debug('edit edge begin', edgeId)
  }

  handleDragNodeBegin = (nodeId) => {
    debug('drag node begin', nodeId)
  }

  handleDragNodeMove = (nodeId, pos) => {
    debug('drag node move', nodeId, pos)
  }

  handleDragNodeEnd = (nodeId, pos) => {
    debug('drag node end', nodeId, pos)
  }

  handleEditNodeUpdate = (nodeId, text) => {
    debug('edit node update', nodeId, text)
  }

  render() {
    const {
      graph,
    } = this.state

    const {
      handleAddNode,
      handleAddEdgeBegin,
      handleAddEdgeMove,
      handleAddEdgeCancel,
      handleAddEdgeEnd,
      handleRemoveNode,
      handleRemoveEdge,
      handleEditNodeBegin,
      handleEditEdgeBegin,
      handleDragNodeBegin,
      handleDragNodeMove,
      handleDragNodeEnd,
      handleEditNodeUpdate,
    } = this
    return (
      <div className={styles.GraphEditor}>
        <div className={styles.Graph}>
          <GraphArea
            graph={graph}
            onAddNode={handleAddNode}
            onAddEdgeBegin={handleAddEdgeBegin}
            onAddEdgeMove={handleAddEdgeMove}
            onAddEdgeCancel={handleAddEdgeCancel}
            onAddEdgeEnd={handleAddEdgeEnd}
            onRemoveNode={handleRemoveNode}
            onRemoveEdge={handleRemoveEdge}
            onEditNode={handleEditNodeBegin}
            onEditEdge={handleEditEdgeBegin}
            onDragNodeBegin={handleDragNodeBegin}
            onDragNodeMove={handleDragNodeMove}
            onDragNodeEnd={handleDragNodeEnd}
          />
        </div>
        <div className={styles.Edit}>
          {graph.nodes[0] && (
            <EditArea
              {...graph.nodes[0]}
              onEditUpdate={handleEditNodeUpdate}
            />
          )}
        </div>
      </div>
    )
  }
}