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

export default class GraphComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scale: 0.5,
    }
  }

  setTransformFunctions = transformFunctions => {
    this.setState({transformFunctions})
  }

  handleDrag = event => {
    const delta = this.state.transformFunctions.scaleScreenToWorld([event.deltaX, event.deltaY])
    const node = event.payload
    node.data.x += delta[0]
    node.data.y += delta[1]
    this.setState()
  }

  handleDoubleClick = event => {
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

  handleNodeMouseDown = (node, event) => {
    if (event.button !== 2) return
    event.stopPropagation()
    this.setState({
      connecting: {
        from: node,
        startX: event.clientX,
        startY: event.clientY,
        endX: event.clientX,
        endY: event.clientY,
      }
    })
  }

  handleNodeMouseUp = (node) => {
    if (node === this.state.connecting.from) return
    this.props.graph.edge(this.state.connecting.from, node)
  }

  handleMouseMove = event => {
    this.setState({
      connecting: {
        ...this.state.connecting,
        endX: event.clientX,
        endY: event.clientY,
      }
    })
  }

  handleMouseUp = () => {
    this.setState({connecting: null})
  }

  render() {
    return <div className='graph-component'
      onDoubleClick={this.handleDoubleClick}
      onMouseDown={evt => evt.preventDefault()}
      onMouseMove={this.state.connecting ? this.handleMouseMove : null}
      onMouseUp={this.state.connecting ? this.handleMouseUp : null}
    >
      <Graph
        {...this.props}
        scale={this.state.scale}
        getTransformFunctions={this.setTransformFunctions}
        onDrag={this.handleDrag}
        onNodeMouseDown={this.handleNodeMouseDown}
        onNodeMouseUp={this.state.connecting && this.handleNodeMouseUp}
      />
      {
        this.state.connecting && <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
            fill: '#ffb',
            stroke: 'black',
            strokeWidth: '3px',
          }}
        >
          <line
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