import React from 'react'
import graph from '../views/graph/graph'
import Node from '../views/node/node'
import Edge from '../views/edge/edge'
import withPanAndZoom from '../hocs/with-pan-and-zoom'
import withDrag from '../hocs/with-drag'

let Graph = graph(Node, Edge)
Graph = withPanAndZoom(Graph)
Graph = withDrag(
  Graph,
  'onNodeMouseDown',
  (node, evt) => {return {x: evt.clientX, y: evt.clientY, payload: node}}
)

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

  handleNodeMouseDown = (node, event) => {
    event.stopPropagation()
    console.log(event.button, node.id)
  }

  render() {
    return <Graph
      {...this.props}
      scale={this.state.scale}
      onTransform={transformFns => this.setState({transformFns})}
      onDrag={this.handleDrag}
      onNodeMouseDown={this.handleNodeMouseDown}
    />
  }
}