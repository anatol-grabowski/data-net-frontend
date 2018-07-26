import React from 'react'
import Graph from './graph'

export default class DisplayGraph extends React.Component {
  constructor(props) {
    super(props)
    this.graphRef = React.createRef()
    this.state = {
      translate: [0, 0],
      scale: 0.5
    }
  }

  scaleScreenToWorld = ([x, y], scale = this.state.scale) => {
    x = x / scale
    y = y / scale
    return [x, y]
  }

  mapScreenToWorld = ([x, y], scale = this.state.scale) => {
    x = (x - this.state.translate[0]) / scale
    y = (y - this.state.translate[1]) / scale
    return [x, y]
  }

  mapWorldToScreen = ([x, y], scale = this.state.scale) => {
    x = x * scale + this.state.translate[0]
    y = y * scale + this.state.translate[1]
    return [x, y]
  }

  handleMouseDown = evt => {
    if (evt.button !== 0) return
    this.setState({
      translating: {
        initialCursor: [evt.pageX, evt.pageY],
        initialWorld: this.state.translate,
      }
    })
  }

  handleMouseMove = event => {
    event.persist()
    event.preventDefault()
    if (this.state.translating) {
      const x = this.state.translating.initialWorld[0] + event.pageX - this.state.translating.initialCursor[0]
      const y = this.state.translating.initialWorld[1] + event.pageY - this.state.translating.initialCursor[1]
      this.setState({
        translate: [x, y]
      })
    }
  }

  handleMouseUp = () => {
    if (this.state.translating) this.setState({translating: null})
  }

  handleWheel = evt => {
    const zoomSensitivity = 0.002
    const newScale = this.state.scale * (1 - zoomSensitivity * evt.deltaY)
    const pos = [
      evt.pageX - this.graphRef.current.offsetLeft,
      evt.pageY - this.graphRef.current.offsetTop,
    ]
    const posW = this.mapScreenToWorld(pos)
    const pAfterZoom = this.mapWorldToScreen(posW, newScale)

    this.setState({
      scale: newScale,
      translate: [
        this.state.translate[0] + (pos[0] - pAfterZoom[0]),
        this.state.translate[1] + (pos[1] - pAfterZoom[1]),
      ],
    })
  }

  render() {
    const graph = this.props.graph
    const scale = this.state.scale
    const translate = this.state.translate
    return (
      <div
        className="graph-pan-n-zoom-container"
        ref={this.graphRef}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleWheel}
      >
        <div
          className="graph-transform-container"
          style={
            {
              transform: `translate(${translate[0]}px,${translate[1]}px) scale(${scale})`,
              transformOrigin: '0px 0px',
            }
          }
        >
          <Graph
            graph={graph}
          />
        </div>
      </div>
    )
  }
}