import React from 'react'
import Debug from 'debug'
import logChangedProps from '../../../utils/log-changed-props'

const debug = Debug('edge')

export default class Edge extends React.Component {
  componentDidUpdate(prevProps) {
    if (debug.enabled) logChangedProps(this.props, prevProps, debug)
  }

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
