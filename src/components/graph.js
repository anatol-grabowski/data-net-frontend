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
      initialScale: 0.5,
    }
    this.componentRef = React.createRef()
  }

  handleGetTransformFunctions = transformFunctions => {
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

  handleNodeMouseUp = (node) => {
    if (node === this.state.connecting.from) return
    this.props.graph.edge(this.state.connecting.from, node)
  }

  handleMouseMove = event => {
    const rect = this.componentRef.current.getBoundingClientRect()
    this.setState({
      connecting: {
        ...this.state.connecting,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      }
    })
  }

  handleMouseUp = () => {
    this.setState({connecting: null})
  }

  handleNodeDoubleClick = (node, event) => {
    event.stopPropagation()
    this.setState({
      editing: {node}
    })
  }

  handleMouseDown = event => {
    event.preventDefault()
    if (!this.state.editing) return

    this.setState({editing: null})
  }

  handleEditNode = event => {
    const node = this.state.editing.node
    node.data.text = event.target.value
    this.setState({})
  }

  render() {
    let editBox
    if (this.state.editing) {
      const p = [this.state.editing.node.data.x, this.state.editing.node.data.y]
      const ps = this.state.transformFunctions.mapWorldToScreen(p)
      editBox = <input
        type="text"
        value={this.state.editing.node.data.text}
        style={{
          position: 'absolute',
          left: ps[0],
          top: ps[1],
        }}
        onChange={this.handleEditNode}
        onMouseDown={evt => evt.stopPropagation()}
        onKeyDown={evt => evt.keyCode === 13 && this.handleMouseDown(evt)}
      />
    }

    return <div className='graph-component'
      ref={this.componentRef}
      onDoubleClick={this.handleDoubleClick}
      onMouseDown={this.handleMouseDown}
      onMouseMove={this.state.connecting ? this.handleMouseMove : null}
      onMouseUp={this.state.connecting ? this.handleMouseUp : null}
    >
      <Graph
        {...this.props}
        scale={this.state.initialScale}
        onGetTransformFunctions={this.handleGetTransformFunctions}
        onDrag={this.handleDrag}
        onNodeMouseDown={this.handleNodeMouseDown}
        onNodeMouseUp={this.state.connecting && this.handleNodeMouseUp}
        onNodeDoubleClick={this.handleNodeDoubleClick}
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
      {editBox}
    </div>
  }
}