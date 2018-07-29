import React from 'react'
import graph from '../views/graph/graph'
import Node from '../views/node/node'
import Edge from '../views/edge/edge'
import withPanAndZoom from '../hocs/with-pan-and-zoom'
import withDrag from '../hocs/with-drag'

const convertNodeMouseDownEventToDragStart = (node, evt) => {
  if (evt.button !== 0) return
  evt.stopPropagation()
  return {x: evt.clientX, y: evt.clientY, payload: node}
}

let Graph = graph(Node, Edge)
Graph = withPanAndZoom(Graph)
Graph = withDrag(Graph, 'onNodeMouseDown', convertNodeMouseDownEventToDragStart)

export default class GraphRenderArea extends React.Component {
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
    graph.node(data)
    this.setState({graph})
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

  render() {
    return <div className='graph-render-area'
      ref={this.componentRef}
      onDoubleClick={this.handleNodeCreate}
      onMouseDown={this.handleMouseDown}
      onMouseMove={this.state.connecting ? this.handleMoveConnecting : null}
      onMouseUp={this.state.connecting ? this.handleCancelConnecting : null}
    >
      <Graph
        {...this.props}
        scale={this.state.initialScale}
        onGetTransformFunctions={this.handleGetTransformFunctions}
        onDrag={this.handleNodeDrag}
        onNodeMouseDown={this.handleStartConnecting}
        onNodeMouseUp={this.state.connecting && this.handleEndConnecting}
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