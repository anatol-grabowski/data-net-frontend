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
    this.state = {
      graphForRender: null,
      editedNodeId: null,
    }
  }

  componentDidMount() {
    const { graph } = this.props
    this.graphService = new GraphService(graph)
    this.graphService.events.on('update', this.handleGraphUpdate)
    this.setState({
      graphForRender: this.graphService.graphForRender,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.graph === this.props.graph) return
    const { graph } = this.props
    this.graphService.graph = graph
    this.graphService.graphForRender = this.graphService.getGraphForRender(graph)
    this.setState({
      graphForRender: this.graphService.graphForRender,
    })
  }

  handleGraphUpdate = () => {
    debug('graph update')
    this.props.onUpdate()
    this.setState({ graphForRender: this.graphService.graphForRender })
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
    const [x, y] = pos
    this.graphService.updateNode(nodeId, { x, y })
  }

  handleAddNode = (pos) => {
    debug('add node', pos)
    const nodeId = this.graphService.addNode(pos)
    this.setState({ editedNodeId: nodeId })
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
    this.setState({ graphForRender: this.graphService.graphForRender })
  }

  handleAddEdgeEnd = (fromId, toId) => {
    debug('add edge end', fromId, toId)
    this.graphService.addEdge(fromId, toId)
  }

  handleRemoveNode = (nodeId) => {
    debug('remove node', nodeId)
    this.graphService.removeNode(nodeId)
  }

  handleRemoveEdge = (edgeId) => {
    debug('remove edge', edgeId)
    this.graphService.removeEdge(edgeId)
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

  handleNodeTextUpdate = (nodeId, text) => {
    debug('edit node update', nodeId, text)
    this.graphService.updateNode(nodeId, { text })
  }

  handleRemoveAttachment = (nodeId, attachmentIndex) => {
    debug('remove attachment', nodeId, attachmentIndex)
    this.graphService.removeAttachment(nodeId, attachmentIndex)
  }

  handleUploadAttachments = async (nodeId, files) => {
    debug('upload attachments', nodeId, files.length)
    await this.graphService.addAttachments(nodeId, files)
  }

  render() {
    const {
      graphForRender,
      editedNodeId,
    } = this.state
    if (!graphForRender) return null
    const editedNode = graphForRender.nodes.find(n => n.id === editedNodeId)
    console.log('render graph editor')

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
      handleNodeTextUpdate,
      handleRemoveAttachment,
      handleUploadAttachments,
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
              onTextUpdate={handleNodeTextUpdate}
              onRemove={handleRemoveNode}
              onRemoveAttachment={handleRemoveAttachment}
              onUploadAttachments={handleUploadAttachments}
            />
          </div>
        )}
      </div>
    )
  }
}

GraphEditor.propTypes = {
  graph: PropTypes.object.isRequired,
}
