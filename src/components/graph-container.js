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
    const nodeData = {
      ...pos,
      width: 125,
      height: 60,
      text: 'Text',
    }
    const graph = this.state.graph
    graph.node(nodeData)
    this.setState({})
  };

  handleMouseMove = event => {
    event.persist()
    event.preventDefault()
    if (this.state.dragging) {
      const pScreen = {
        x: event.clientX - this.state.dragging.offsetX,
        y: event.clientY - this.state.dragging.offsetY
      }
      console.log(pScreen)
      const pWorld = this.scaleScreenToWorld(pScreen)
      console.log(pWorld.x + this.state.dragging.initialX, pWorld.y + this.state.dragging.initialY)
      this.setState(prevState => {
        const node = this.state.dragging.node
        node.data.x = pWorld.x + this.state.dragging.initialX
        node.data.y = pWorld.y + this.state.dragging.initialY
        return {}
      })
    }
    if (this.state.connection) {
      const pScreen = {x: event.clientX, y: event.clientY}
      const pWorld = this.mapScreenToWorld(pScreen)
      this.setState({
        connection: {
          ...this.state.connection,
          ...pWorld,
        },
      })
    }
    if (this.state.translating) {
      const x = this.state.translating.initialX + event.clientX - this.state.translating.offsetX
      const y = this.state.translating.initialY + event.clientY - this.state.translating.offsetY
      this.setState({
        translate: {x, y}
      })
    }
  }

  handleStartConnection = node => {
    console.log('from', node.id)
    this.setState({
      connection: { from: node, x: node.data.x, y: node.data.y },
    })
  }

  handleFinishConnection = node => {
    if (this.state.connection && this.state.connection.from !== node) {
      console.log('to', node.id)
      this.setState(prevState => {
        this.state.graph.edge(this.state.connection.from, node)
        return { connection: null }
      })
    }
  }

  handleChangeNodeData = (id, dataToChange) => {
    this.setState(prevState => {
      const nodes = prevState.graph.nodes
      nodes[id].data = { ...nodes[id].data, ...dataToChange }
      return {
        graph: prevState.graph,
      }
    })
  };

  componentDidUpdate(prevProps, prevState) {
    console.log('update')
  }

  handleStartDrag = dragStartData => {
    this.setState({ dragging: dragStartData })
  };

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
    (this.state.dragging || this.state.connection || this.state.editing || this.state.translating) &&
      this.setState({ dragging: null, connection: null, editing: null, translating: null })
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

  handleKeyDown = event => {
    let charCode = String.fromCharCode(event.which).toLowerCase()
    if (event.ctrlKey && charCode === 's') {
      event.preventDefault()
      console.log('Ctrl + S pressed')
      this.setState({backgroundText: helpText + '\n\nSaving'})
      GraphApi.saveGraph(this.state.graph)
        .then(() => this.setState({backgroundText: helpText + '\n\nSaved\n' + new Date()}))
        .catch(err => this.setState({backgroundText: helpText + '\n\nError while saving\n' + err}))
    }
  };

  handleStartEditNode = node => {
    this.setState({ editing: { node } })
  };

  handleEditNode = event => {
    event.persist()
    this.setState(prevState => {
      prevState.editing.node.data.text = event.target.value
      return {}
    })
  };

  render() {
    let editBox = false
    if (this.state.editing) {
      const {x, y} = this.mapWorldToScreen(this.state.editing.node.data)
      editBox = <input
        type="text"
        value={this.state.editing.node.data.text}
        style={{
          position: 'absolute',
          left: x,
          top: y,
        }}
        onChange={this.handleEditNode}
      />
    }
    return (
      <div
        className="graph"
        ref={this.graphRef}
        onDoubleClick={this.handleDoubleClick}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleWheel}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
      >
        <svg className="edges">
          <g
            transform={`translate(${this.state.translate.x},${this.state.translate.y}) scale(${this.state.scale})`}
          >
            <foreignObject x="30" y="0" height="500" width="500">
              <p xmlns="http://www.w3.org/1999/xhtml"
                style={{whiteSpace: 'pre', fontSize: '1.5rem', color: 'gray', pointerEvents: 'none'}}
              >{this.state.backgroundText}</p>
            </foreignObject>
            {
              this.state.graph &&
              this.state.graph.edges &&
              this.state.graph.edges.map(edge => {
                return <Edge key={edge.id} edge={edge} />
              })
            }
            {
              this.state.connection && (
                <line
                  x1={this.state.connection.from.data.x}
                  y1={this.state.connection.from.data.y}
                  x2={this.state.connection.x + 20}
                  y2={this.state.connection.y + 20}
                  fill="#ffb"
                  stroke="black"
                  strokeWidth="3px"
                />
              )
            }
          </g>
        </svg>
        <div
          className='nodes'
          style={
            {
              transform: `translate(${this.state.translate.x}px,${this.state.translate.y}px) scale(${this.state.scale})`,
            }
          }
        >
          {
            this.state.graph &&
            this.state.graph.edges &&
            this.state.graph.nodes.map(node => {
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
        {
          editBox
        }
      </div>
    )
  }
}