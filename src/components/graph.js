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
  handleDrag = event => {
    console.log('handl', [event.deltaX, event.deltaY], event.payload.id)

  }

  render() {
    return <Graph
      {...this.props}
      scale={0.5}
      onDrag={this.handleDrag}
    />
  }
}