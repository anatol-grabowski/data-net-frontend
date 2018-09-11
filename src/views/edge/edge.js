import React from 'react'

export default class Edge extends React.Component {
  render() {
    return (
      <line className='edge'
        x1={this.props.edge.from.data.x}
        y1={this.props.edge.from.data.y}
        x2={this.props.edge.to.data.x}
        y2={this.props.edge.to.data.y}
        onDoubleClick={this.props.onDoubleClick}
        markerEnd="url(#arrow)"
      />
    )
  }
}
