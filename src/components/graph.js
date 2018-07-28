import React from 'react'
import graph from '../views/graph/graph'
import Node from '../views/node/node'
import Edge from '../views/edge/edge'
import withPanAndZoom from '../hocs/with-pan-and-zoom'
import withDraggables from '../hocs/with-draggables'

class NodeWithDrag extends React.Component {
  handleMouseDown = event => {
    event.stopPropagation()
    this.props.onMouseDown(event)
  }

  render() {
    return <Node
      {...this.props}
      onMouseDown={this.handleMouseDown}
    />
  }
}

let Graph = graph(NodeWithDrag, Edge)
Graph = withPanAndZoom(Graph)
Graph = withDraggables(Graph, 'onNodeMouseDown')

export default class GraphComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scale: 0.5,
    }
  }

  handleDrag = event => {
    const delta = this.state.transformFns.scaleScreenToWorld([event.deltaX, event.deltaY])
    const node = event.payload
    node.data.x += delta[0]
    node.data.y += delta[1]
    this.setState()
  }

  render() {
    return <Graph
      {...this.props}
      scale={this.state.scale}
      onTransform={transformFns => this.setState({transformFns})}
      onDrag={this.handleDrag}
    />
  }
}