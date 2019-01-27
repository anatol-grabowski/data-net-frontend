import PropTypes from 'prop-types'
import React from 'react'
import Debug from 'debug'
import { Graph as GraphView } from '../../views/Graph'
import styles from './GraphArea.module.scss'

const debug = Debug('GraphArea')

const mouseButton = {
  MAIN: 0, // Main button pressed, usually the left button or the un-initialized state
  AUXILIARY: 1, // Auxiliary button pressed, usually the wheel button or the middle button (if present)
  SECONDARY: 2, // Secondary button pressed, usually the right button
  FORTH: 3, // Fourth button, typically the Browser Back button
  FIFTH: 4, // Fifth button, typically the Browser Forward button
}

const Graph = GraphView

export default class GraphArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialScale: 0.5,
    }
    this.isCreatingEdge = false
    this.isDraggingNode = false
    this.node = null
  }

  handleGetTransformFunctions = transformFunctions => {
    this.setState({transformFunctions})
  }

  createEdgeBegin(node, pos) {
    debug('create edge begin', node, pos)
    this.isCreatingEdge = true
    this.node = node
    const { onAddEdgeBegin } = this.props
    onAddEdgeBegin(node.id, pos)
  }

  createEdgeMove(pos) {
    debug('create edge move', pos)
    const { onAddEdgeMove } = this.props
    onAddEdgeMove(this.node.id, pos)
  }

  createEdgeEnd(node) {
    debug('create edge end', node.id)
    this.isCreatingEdge = false
    const { onAddEdgeEnd } = this.props
    onAddEdgeEnd(this.node.id, node.id)
  }

  createEdgeCancel() {
    debug('create edge cancel')
    this.isCreatingEdge = false
    const { onAddEdgeCancel } = this.props
    onAddEdgeCancel()
  }

  createNode(pos) {
    debug('create node', pos)
    const { onAddNode } = this.props
    onAddNode(pos)
  }

  dragNodeBegin(node, pos) {
    debug('drag node begin', node.id, pos)
    this.isDraggingNode = true
    this.node = node
    const { onDragNodeBegin } = this.props
    onDragNodeBegin(node.id, pos)
  }

  dragNodeMove(pos) {
    debug('drag node move', pos)
    const { onDragNodeMove } = this.props
    onDragNodeMove(this.node.id, pos)
  }

  dragNodeEnd(pos) {
    debug('drag node end', pos)
    this.isDraggingNode = false
    const { onDragNodeEnd } = this.props
    onDragNodeEnd(this.node.id, pos)
  }

  editNode(node) {
    debug('edit node', node.id)
    const { onEditNode } = this.props
    onEditNode(node.id)
  }

  editEdge(edge) {
    debug('edit edge', edge.id)
    const { onEditEdge } = this.props
    onEditEdge(edge.id)
  }

  removeNode(node) {
    debug('remove node', node.id)
    const { onRemoveNode } = this.props
    onRemoveNode(node.id)
  }

  removeEdge(edge) {
    debug('remove edge', edge.id)
    const { onRemoveEdge } = this.props
    onRemoveEdge(edge.id)
  }


  handleMouseMove = (event) => {
    const { transformFunctions } = this.state
    const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
    if (this.isCreatingEdge) this.createEdgeMove(pos)
    if (this.isDraggingNode) this.dragNodeMove(pos)
  }

  handleMouseUp = () => {
    const { transformFunctions } = this.state
    const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
    if (this.isCreatingEdge) this.createEdgeCancel()
    if (this.isDraggingNode) this.dragNodeEnd(pos)
  }

  handleDoubleClick = (event) => {
    const { transformFunctions } = this.state
    const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
    this.createNode(pos)
  }

  handleNodeMouseDown = (node, event) => {
    event.stopPropagation()
    if (event.button === mouseButton.SECONDARY) {
      const { transformFunctions } = this.state
      const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
      this.createEdgeBegin(node, pos)
    }
    if (event.button === mouseButton.MAIN) {
      const { transformFunctions } = this.state
      const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
      this.dragNodeBegin(node, pos)
    }
    if (event.button === mouseButton.AUXILIARY) {
      this.removeNode(node)
    }
    const { onNodeMouseDown } = this.props
    onNodeMouseDown && onNodeMouseDown(node, event)
  }

  handleNodeMouseUp = (node, event) => {
    if (this.isCreatingEdge) {
      if (this.node !== node) this.createEdgeEnd(node)
      else this.createEdgeCancel()
    }
    const { onNodeMouseUp } = this.props
    onNodeMouseUp && onNodeMouseUp(node, event)
  }

  handleEdgeMouseDown = (edge, event) => {
    event.stopPropagation()
    if (event.button === mouseButton.AUXILIARY) {
      this.removeEdge(edge)
    }
  }

  handleNodeDoubleClick = (node, event) => {
    event.stopPropagation()
    this.editNode(node)
  }

  handleEdgeDoubleClick = (edge, event) => {
    event.stopPropagation()
    this.editEdge(edge)
  }

  render() {
    const { graph } = this.props
    const { nodes, edges } = graph
    const { initialScale } = this.state
    const {
      handleMouseMove,
      handleMouseUp,
      handleDoubleClick,
      handleNodeMouseDown,
      handleNodeMouseUp,
      handleNodeDoubleClick,
      handleEdgeMouseDown,
      handleEdgeDoubleClick,
      handleGetTransformFunctions,
    } = this
    return <div className={styles.GraphArea}
      onDoubleClick={handleDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Graph
        scale={initialScale}
        onGetTransformFunctions={handleGetTransformFunctions}
        nodes={nodes}
        edges={edges}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeMouseUp={handleNodeMouseUp}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeMouseDown={handleEdgeMouseDown}
        onEdgeDoubleClick={handleEdgeDoubleClick}
      />
    </div>
  }
}

GraphArea.propTypes = {
  graph: PropTypes.object.isRequired,
  onAddNode: PropTypes.func.isRequired,
  onAddEdgeBegin: PropTypes.func.isRequired,
  onAddEdgeMove: PropTypes.func.isRequired,
  onAddEdgeCancel: PropTypes.func.isRequired,
  onAddEdgeEnd: PropTypes.func.isRequired,
  onRemoveNode: PropTypes.func.isRequired,
  onRemoveEdge: PropTypes.func.isRequired,
  onEditNode: PropTypes.func.isRequired,
  onEditEdge: PropTypes.func.isRequired,
  onDragNodeBegin: PropTypes.func.isRequired,
  onDragNodeMove: PropTypes.func.isRequired,
  onDragNodeEnd: PropTypes.func.isRequired,
}