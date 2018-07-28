// Usage:
// Target component should accept 'onMouseMove', 'onMouseUp' and onStartDragPropName props
// onStartDragProp should be called with 1 or 2 arguments
// the first argument should be the event with clientX and clientY fields
// the second argument is optional payload, drag target object can be passed here
// while dragging occurs this.props.onDrag is called with one argument: {deltaX, deltaY, payload}

import React from 'react'

export default function withDraggables(Child, onStartDragPropName='onStartDown') {
  return class WithDraggables extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        dragging: null,
      }
    }

    handleStartDrag = (event, payload) => {
      this.setState({
        dragging: {
          payload,
          previous: [event.clientX, event.clientY],
        },
      })
    }

    handleEndDrag = () => {
      if (!this.state.dragging) return
      this.setState({dragging: null})
    }

    handleMouseMove = event => {
      if (!this.state.dragging) return
      const prev = this.state.dragging.previous
      const curr = [event.clientX, event.clientY]
      const delta = [curr[0] - prev[0], curr[1] - prev[1]]
      this.setState({
        dragging: {
          ...this.state.dragging,
          previous: curr,
        },
      })
      const dragEvent = {
        deltaX: delta[0],
        deltaY: delta[1],
        payload: this.state.dragging.payload,
      }
      this.props.onDrag(dragEvent)
    }

    render() {
      const dragHandlers = {
        [onStartDragPropName]: this.handleStartDrag,
      }
      return (
        <Child
          {...this.props}
          {...dragHandlers}
          onMouseMove={this.state.dragging ? this.handleMouseMove : null}
          onMouseUp={this.state.dragging ? this.handleEndDrag : null}
        />
      )
    }
  }
}