import React from 'react'
import Graph from './graph'

export default class DisplayGraph extends React.Component {
  constructor(props) {
    super(props)
    this.graphRef = React.createRef()
    this.state = {
      translate: {x: 0, y: 0},
      scale: 0.5,
    }
  }

  handleMouseMove = event => {
    event.persist()
    event.preventDefault()
    if (this.state.translating) {
      const x = this.state.translating.initialX + event.clientX - this.state.translating.offsetX
      const y = this.state.translating.initialY + event.clientY - this.state.translating.offsetY
      this.setState({
        translate: {x, y}
      })
    }
  }

  handleMouseDown = (event) => {
    const pScreen = {x: event.clientX, y: event.clientY}
    const pWorld = this.mapScreenToWorld(pScreen)
    console.log('translate', pScreen, pWorld)
    if (event.button !== 0) return
    this.setState({
      translating: {
        offsetX: event.clientX,
        offsetY: event.clientY,
        initialX: this.state.translate.x,
        initialY: this.state.translate.y,
      }
    })
  }

  handleMouseUp = () => {
    if (this.state.translating) this.setState({translating: null})
  }

  handleWheel = event => {
    const zoomSensitivity = 0.002
    const newScale = this.state.scale * (1 - zoomSensitivity * event.deltaY)
    const zoomPoint = {x: event.clientX, y: event.clientY}
    const zoomPointWorld = this.mapScreenToWorld(zoomPoint)
    const pAfterZoom = this.mapWorldToScreen(zoomPointWorld, newScale)

    this.setState({
      scale: newScale,
      translate: {
        x: this.state.translate.x + (zoomPoint.x - pAfterZoom.x),
        y: this.state.translate.y + (zoomPoint.y - pAfterZoom.y),
      }
    })
  }

  render() {
    return (
      <Graph
        graph={this.props.graph}
        scale={this.state.scale}
        translate={this.state.translate}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      />
    )
  }
}