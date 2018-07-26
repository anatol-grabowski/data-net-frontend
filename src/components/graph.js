import React from 'react'
import Node from './node'
import Edge from './edge'

export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.graphRef = React.createRef()
  }

  componentDidUpdate() {
    console.log('update')
  }

  scaleScreenToWorld = ({x, y}, scale = this.props.scale) => {
    x = x / scale
    y = y / scale
    return {x, y}
  }

  mapScreenToWorld = ({x, y}, scale = this.props.scale) => {
    x = (x - this.props.translate.x) / scale
    y = (y - this.props.translate.y) / scale
    return {x, y}
  }

  mapWorldToScreen = ({x, y}, scale = this.props.scale) => {
    x = x * scale + this.props.translate.x
    y = y * scale + this.props.translate.y
    return {x, y}
  }

  handleMouseDown = evt => {
    const pScreen = {
      x: evt.pageX - this.graphRef.current.offsetLeft,
      y: evt.pageY - this.graphRef.current.offsetTop,
    }
    const pWorld = this.mapScreenToWorld(pScreen)
    console.log(pScreen, pWorld)
  }

  render() {
    const graph = this.props.graph
    const scale = this.props.scale
    const translate = this.props.translate
    return (
      <div
        className="graph"
        ref={this.graphRef}
        onDoubleClick={this.props.onDoubleClick}
        onMouseMove={this.props.onMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.props.onMouseUp}
        onWheel={this.props.onWheel}
      >
        <div
          className="graph-transformable-container"
          style={
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: `translate(${translate.x}px,${translate.y}px) scale(${scale})`,
              transformOrigin: '0px 0px 0px',
            }
          }
        >
          <svg className="edges">
            <g>
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
          >
            {
              graph.nodes.map(node => {
                return (
                  <Node
                    key={node.id}
                    node={node}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}