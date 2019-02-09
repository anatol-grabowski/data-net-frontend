// Usage:
// Target component should accept a prop with the name set through onStartDragPropName argument (defaults to 'onMouseDown')
// The third argument is a function that extracts x, y and optional payload from the onStartDrag event arguments
// While dragging occurs this.props.onDrag is called with one argument: {deltaX, deltaY, payload, mouseMoveEvent}

import React from 'react'
import './with-drag.css'

export default function withDrag(
  Child,
  onStartDragPropName='onMouseDown',
  convertStartDragEvent = evt => {return {x: evt.clientX, y: evt.clientY, payload: undefined}}
) {
  return class WithDrag extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        dragging: null,
      }
    }

    handleStartDrag = (...args) => {
      const event = convertStartDragEvent(...args)
      if (event) {
        this.setState({
          dragging: {
            payload: event.payload,
            previous: [event.x, event.y],
          },
        })
      }
      this.props[onStartDragPropName] && this.props[onStartDragPropName](...args)
    }

    handleMouseUp = () => {
      this.setState({dragging: null})
    }

    handleMouseMove = event => {
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
        mouseMoveEvent: event,
      }
      this.props.onDrag(dragEvent)
    }

    render() {
      const dragHandlers = {
        [onStartDragPropName]: this.handleStartDrag,
      }
      return (
        <div className='with-drag'
          onMouseMove={this.state.dragging && this.handleMouseMove}
          onMouseUp={this.state.dragging && this.handleMouseUp}
        >
          <Child
            {...this.props}
            {...dragHandlers}
          />
        </div>
      )
    }
  }
}