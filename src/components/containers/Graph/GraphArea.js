import PropTypes from 'prop-types'
import React from 'react'
import Debug from 'debug'
import { Graph as GraphView } from '../../views/Graph'
import withDrag from '../../hocs/with-drag'
import styles from './GraphArea.module.scss'

const debug = Debug('GraphArea')

const mouseButton = {
  MAIN: 0, // Main button pressed, usually the left button or the un-initialized state
  AUXILIARY: 1, // Auxiliary button pressed, usually the wheel button or the middle button (if present)
  SECONDARY: 2, // Secondary button pressed, usually the right button
  FORTH: 3, // Fourth button, typically the Browser Back button
  FIFTH: 4, // Fifth button, typically the Browser Forward button
}

const convertNodeMouseDownEventToDragStart = (node, evt) => {
  if (evt.button !== 0) return
  evt.stopPropagation()
  return {x: evt.clientX, y: evt.clientY, payload: node}
}

const Graph = GraphView// = withDrag(GraphView, 'onNodeMouseDown', convertNodeMouseDownEventToDragStart)

export default class GraphArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialScale: 0.5,
    }
    this.componentRef = React.createRef()
  }

  handleGetTransformFunctions = transformFunctions => {
    this.setState({transformFunctions})
  }

  handleNodeDrag = event => {
    const delta = this.state.transformFunctions.scaleScreenToWorld([event.deltaX, event.deltaY])
    const node = event.payload
    node.data.x += delta[0]
    node.data.y += delta[1]
    this.setState()
  }

  handleNodeCreate = event => {
    const p = this.state.transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
    const data = {
      text: 'aaa',
      x: p[0],
      y: p[1],
    }
    const graph = this.props.graph
    const node = graph.node(data)
    this.setState({graph})
    this.props.onNodeCreate && this.props.onNodeCreate(node)
  }

  handleStartConnecting = (node, event) => {
    if (event.button !== 2) return
    event.stopPropagation()
    const rect = this.componentRef.current.getBoundingClientRect()
    this.setState({
      connecting: {
        from: node,
        startX: event.clientX - rect.left,
        startY: event.clientY - rect.top,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      }
    })
  }

  handleEndConnecting = (node) => {
    if (node === this.state.connecting.from) return
    this.props.graph.edge(this.state.connecting.from, node)
  }

  handleMoveConnecting = event => {
    const rect = this.componentRef.current.getBoundingClientRect()
    this.setState({
      connecting: {
        ...this.state.connecting,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      }
    })
  }

  handleCancelConnecting = () => {
    this.setState({connecting: null})
  }

  edgeCreateBegin(node, pos) {
    debug('start new edge', node.id)
    this.isCreatingEdge = true
    const newEdge = {
      from: node,
      points: [node.coords, pos],
      id: null,
    }
    this.setState({ newEdge })
  }

  edgeCreateMove(pos) {
    debug('move new edge', pos)
    const newEdge = {
      ...this.state.newEdge,
      points: [this.state.newEdge.points[0], pos],
    }
    this.setState({ newEdge })
  }

  edgeCreateEnd(node) {
    debug('end new edge', node.id)
    this.isCreatingEdge = false
  }

  edgeCreateCancel() {
    debug('cancel new edge')
    this.isCreatingEdge = false
  }


  handleMouseMove = (event) => {
    const { transformFunctions } = this.state
    const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
    if (this.isCreatingEdge) this.edgeCreateMove(pos)
  }

  handleMouseUp = () => {
    if (this.isCreatingEdge) this.edgeCreateCancel()
  }

  handleNodeMouseDown = (node, event) => {
    if (event.button === mouseButton.SECONDARY) {
      event.stopPropagation()
      const { transformFunctions } = this.state
      const pos = transformFunctions.mapScreenToWorld([event.clientX, event.clientY])
      this.edgeCreateBegin(node, pos)
    }
    const { onNodeMouseDown } = this.props
    onNodeMouseDown && onNodeMouseDown(node, event)
  }

  handleNodeMouseUp = (node, event) => {
    if (this.isCreatingEdge) this.edgeCreateEnd(node)
    const { onNodeMouseUp } = this.props
    onNodeMouseUp && onNodeMouseUp(node, event)
  }

  render() {
    const { graph, ...graphProps } = this.props
    const { nodes, edges: existingEdges } = graph
    const { initialScale, newEdge } = this.state
    const { isCreatingEdge } = this
    const edges = isCreatingEdge ? existingEdges.concat([newEdge]) : existingEdges
    const {
      handleMouseMove,
      handleMouseUp,
      handleNodeMouseDown,
      handleNodeMouseUp,
    } = this
    return <div className={styles.GraphArea}
      ref={this.componentRef}
      onDoubleClick={this.handleNodeCreate}
      onMouseDown={this.handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Graph
        nodes={nodes}
        edges={edges}
        {...graphProps}
        scale={initialScale}
        onGetTransformFunctions={this.handleGetTransformFunctions}
        onDrag={this.handleNodeDrag}
        onNodeMouseDown={handleNodeMouseDown}
        onNodeMouseUp={handleNodeMouseUp}
      />
      {
        this.state.connecting && <svg className='connecting-container'>
          <line className='connecting-line'
            x1={this.state.connecting.startX}
            y1={this.state.connecting.startY}
            x2={this.state.connecting.endX}
            y2={this.state.connecting.endY}
          />
        </svg>
      }
    </div>
  }
}

GraphArea.propTypes = {
  graph: PropTypes.object.isRequired,
  // onEdgeCreateBegin: PropTypes.func.isRequired,
  // onEdgeCreateMove: PropTypes.func.isRequired,
  // onEdgeCreateCancel: PropTypes.func.isRequired,
  // onEdgeCreateEnd: PropTypes.func.isRequired,
}