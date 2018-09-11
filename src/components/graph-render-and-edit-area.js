import React from 'react'
import Graph from './graph-render-area'

export default class GraphAndEditArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleNodeDoubleClick = (node, event) => {
    event.stopPropagation()
    this.setState({
      editing: {node}
    })
  }

  handleInputChange = event => {
    const node = this.state.editing.node
    node.data.text = event.target.value
    this.setState({})
  }

  handleNodeMouseDown = (node, event) => {
    console.log('nmd', node.id, event)
  }

  handleRemove = () => {
    console.log('rm', this.state.editing.node)
    this.state.editing.node.remove()
    this.setState({})
  }

  render() {
    const graph = this.props.graph
    return <div className='graph-render-and-edit-area'
      ref={this.componentRef}
      onDoubleClick={this.handleDoubleClick}
      onMouseDown={this.handleMouseDown}
      onMouseMove={this.state.connecting ? this.handleMouseMove : null}
      onMouseUp={this.state.connecting ? this.handleMouseUp : null}
    >
      <Graph
        {...this.props}
        onNodeDoubleClick={this.handleNodeDoubleClick}
        onNodeMouseDown={this.handleNodeMouseDown}
      />
      <div className='graph-edit-area'>
        {this.state.editing && this.state.editing.node && <div className='node-edit'>
          <div>{`node id: ${this.state.editing.node.id}`}</div><br/>
          <div>{`node xy: ${this.state.editing.node.data.x}, ${this.state.editing.node.data.y}`}</div><br/>
          <div>node text:</div>
          <input
            type="text"
            value={this.state.editing.node.data.text}
            onChange={this.handleInputChange}
            onMouseDown={evt => evt.stopPropagation()}
            onKeyDown={evt => evt.keyCode === 13 && this.setState({editing: null})}
          />
          <input type='button' value='del' onClick={this.handleRemove}></input>
        </div>}
        {!this.state.editing && <div className='graph-edit'>
          {`nodes #: ${graph.nodes.length}`}<br/>
          {`edges #: ${graph.edges.length}`}
        </div>}
      </div>
    </div>
  }
}