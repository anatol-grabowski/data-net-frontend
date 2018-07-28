import React from 'react'
import graph from '../views/graph/graph'
import Node from '../views/node/node'
import Edge from '../views/edge/edge'
import withPanAndZoom from '../hocs/with-pan-and-zoom'
import withDraggables from '../hocs/with-draggables'

let Graph = graph(Node, Edge)
Graph = withPanAndZoom(Graph)
Graph = withDraggables(Graph, 'onNodeMouseDown')

export default class GraphComponent extends React.Component {
  handleDrag = event => {
    console.log('handl', event)

  }

  render() {
    return <Graph
      {...this.props}
      onDrag={this.handleDrag}
    />
  }
}