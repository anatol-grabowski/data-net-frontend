import Debug from 'debug'
import PropTypes from 'prop-types'
import React from 'react'
import GraphService from '../../services/graph-service'
import GraphArea from '../views/Editor/GraphArea'
import EditArea from '../views/Editor/EditArea'
import styles from './GraphEditor.module.scss'

const debug = Debug('GraphEditor')

export default class GraphEditor extends React.Component {
  constructor(props) {
    super(props)
    const { graph } = this.props
    this.graphService = new GraphService(graph)
    this.state = {
      graphForRender: this.graphService.graphForRender,
      editedNodeId: null,
    }
  }

  addingEdge(fromId, pos) {
    const { graphForRender } = this.graphService
    const from = graphForRender.nodes.find(n => n.id === fromId).coords
    const newEdge = {
      points: [from, pos],
    }
    const newGraphForRender = {
      ...graphForRender,
      edges: graphForRender.edges.concat([newEdge])
    }
    this.setState({ graphForRender: newGraphForRender })
  }

  movingNode(nodeId, pos) {
    const { graphService } = this
    const [x, y] = pos
    graphService.updateNode(nodeId, { x, y })
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleAddNode = (pos) => {
    debug('add node', pos)
    const { graphService } = this
    graphService.addNode(pos)
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleAddEdgeBegin = (nodeId, pos) => {
    debug('add edge begin', nodeId, pos)
    this.addingEdge(nodeId, pos)
  }

  handleAddEdgeMove = (nodeId, pos) => {
    debug('add edge move', nodeId, pos)
    this.addingEdge(nodeId, pos)
  }

  handleAddEdgeCancel = () => {
    debug('add edge cancel')
    const { graphService } = this
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleAddEdgeEnd = (fromId, toId) => {
    debug('add edge end', fromId, toId)
    const { graphService } = this
    graphService.addEdge(fromId, toId)
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleRemoveNode = (nodeId) => {
    debug('remove node', nodeId)
    const { graphService } = this
    graphService.removeNode(nodeId)
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleRemoveEdge = (edgeId) => {
    debug('remove edge', edgeId)
    const { graphService } = this
    graphService.removeEdge(edgeId)
    this.setState({ graphForRender: graphService.graphForRender })
  }

  handleDragNodeBegin = (nodeId) => {
    debug('drag node begin', nodeId)
  }

  handleDragNodeMove = (nodeId, pos) => {
    debug('drag node move', nodeId, pos)
    this.movingNode(nodeId, pos)
  }

  handleDragNodeEnd = (nodeId, pos) => {
    debug('drag node end', nodeId, pos)
    this.movingNode(nodeId, pos)
  }

  handleEditNodeBegin = (nodeId) => {
    debug('edit node begin', nodeId)
    this.setState({ editedNodeId: nodeId })
  }

  handleEditEdgeBegin = (edgeId) => {
    debug('edit edge begin', edgeId)
  }

  handleEditNodeUpdate = (nodeId, text) => {
    debug('edit node update', nodeId, text)
    const { graphService } = this
    graphService.updateNode(nodeId, { text })
    this.setState({ graphForRender: graphService.graphForRender })
  }

  render() {
    const {
      graphForRender,
      editedNodeId,
    } = this.state
    const editedNode = graphForRender.nodes.find(n => n.id === editedNodeId)

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
            graph={graphForRender}
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
        {editedNode && (
          <div className={styles.Edit}>
            <EditArea
              {...editedNode}
              onEditUpdate={handleEditNodeUpdate}
              onRemove={handleRemoveNode}
            />
          </div>
        )}
      </div>
    )
  }
}