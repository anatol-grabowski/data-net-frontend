import React from 'react'
import Node from './node'
import Edge from './edge'

export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.graphRef = React.createRef()
    this.state = {
      translate: {x: 0, y: 0},
      scale: 0.8,
    }
  }

  handleDoubleClick = event => {
    event.persist()
    if (event.target !== this.graphRef.current) return
    const pos = this.mapScreenToWorld({x: event.clientX, y: event.clientY})

  };

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

  componentDidUpdate() {
    console.log('update')
  }

  scaleScreenToWorld = ({x, y}, scale = this.state.scale) => {
    x = x / scale
    y = y / scale
    return {x, y}
  }

  mapScreenToWorld = ({x, y}, scale = this.state.scale) => {
    x = (x - this.state.translate.x) / scale
    y = (y - this.state.translate.y) / scale
    return {x, y}
  }

  mapWorldToScreen = ({x, y}, scale = this.state.scale) => {
    x = x * scale + this.state.translate.x
    y = y * scale + this.state.translate.y
    return {x, y}
  }

  handleMouseDown = (event) => {
    const pScreen = {x: event.clientX, y: event.clientY}
    const pWorld = this.mapScreenToWorld(pScreen)
    console.log('mouse down', pScreen, pWorld)
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
    const graph = this.props.graph
    const scale = this.state.scale
    const translate = this.state.translate
    return (
      <div
        className="graph"
        ref={this.graphRef}
        onDoubleClick={this.handleDoubleClick}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleWheel}
        tabIndex="0"
      >
        <svg className="edges">
          <g
            transform={`translate(${translate.x},${translate.y}) scale(${scale})`}
          >
            {
              graph.edges.map(edge => {
                return (
                  <Edge
                    key={edge.id}
                    edge={edge}
                  />
                )
              })
            }
          </g>
        </svg>
        <div
          className='nodes'
          style={
            {
              transform: `translate(${translate.x}px,${translate.y}px) scale(${scale})`,
            }
          }
        >
          {
            graph.nodes.map(node => {
              return (
                <Node
                  key={node.id}
                  node={node}
                  onStartConnection={this.handleStartConnection}
                  onFinishConnection={this.handleFinishConnection}
                  onChangeNodeData={this.handleChangeNodeData}
                  onStartDrag={this.handleStartDrag}
                  onStartEdit={this.handleStartEditNode}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}