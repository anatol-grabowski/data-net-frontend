import React from 'react'
import Graph from './graph-render-area'
import Dropzone from 'react-dropzone'
import { uploadFile } from '../api/upload.api'

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

  handleEdgeDoubleClick = (edge, event) => {
    event.stopPropagation()
    this.setState({
      editing: {edge}
    })
  }

  handleInputChange = event => {
    const node = this.state.editing.node
    node.data.text = event.target.value
    this.setState({})
  }

  handleDetailsChange = event => {
    const node = this.state.editing.node
    node.data.details = event.target.value
    this.setState({})
  }

  handleTagsChange = event => {
    const node = this.state.editing.node
    node.data.tags = event.target.value.replace(/\s{2,}/g, ' ').split(' ')
    this.setState({})
  }

  handleNodeMouseDown = (node, event) => {
    console.log('nmd', node.id, event)
  }

  handleRemove = () => {
    if (this.state.editing.node) {
      this.state.editing.node.remove()
      console.log('removed node:', this.state.editing.node.id)
    }
    if (this.state.editing.edge) {
      this.state.editing.edge.remove()
      console.log('removed edge:', this.state.editing.edge.id)
    }
    this.setState({editing: null})
  }

  handleInvert = () => {
    const edge = this.state.editing.edge
    const from = edge.from
    edge.from = edge.to
    edge.to = from
    this.setState({})
  }

  handleAddAttachments = (files) => {
    console.log(files)
    this.setState({attachments: files})
  }

  handleUploadAttachments = async () => {
    console.log(this.state.attachments)
    await uploadFile(this.state.attachments[0])
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
        onEdgeDoubleClick={this.handleEdgeDoubleClick}
        onNodeMouseDown={this.handleNodeMouseDown}
      />
      <div className='graph-edit-area'>
        {this.state.editing && this.state.editing.node && <div className='node-edit'>
          <div>{`node id: ${this.state.editing.node.id}`}</div><br/>
          <div>{`node xy: ${this.state.editing.node.data.x}, ${this.state.editing.node.data.y}`}</div><br/>
          <div>Text:</div>
          <textarea
            rows={10}
            value={this.state.editing.node.data.text || ''}
            onChange={this.handleInputChange}
            onMouseDown={evt => evt.stopPropagation()}
            // onKeyDown={evt => evt.keyCode === 13 && this.setState({editing: null})}
          />
          <div>Details:</div>
          <textarea
            value={this.state.editing.node.data.details || ''}
            onChange={this.handleDetailsChange}
            onMouseDown={evt => evt.stopPropagation()}
          />
          <div>Tags (space separated):</div>
          <textarea
            value={this.state.editing.node.data.tags ? this.state.editing.node.data.tags.join(' ') : ''}
            onChange={this.handleTagsChange}
            onMouseDown={evt => evt.stopPropagation()}
          />
          <input type='button' value='Remove' onClick={this.handleRemove}></input>
          <div className="dropzone">
            <Dropzone onDrop={this.handleAddAttachments}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>
          <input type='button' value='Attach' onClick={this.handleUploadAttachments}></input>
        </div>}
        {this.state.editing && this.state.editing.edge && <div className='edge-edit'>
          <div>{`edge id: ${this.state.editing.edge.id}`}</div><br/>
          <div>{`from: ${this.state.editing.edge.from.id}`}</div><br/>
          <div>{`to:   ${this.state.editing.edge.to.id}`}</div><br/>
          <input type='button' value='Invert' onClick={this.handleInvert}></input>
          <input type='button' value='Remove' onClick={this.handleRemove}></input>
        </div>}
        {!this.state.editing && <div className='graph-edit'>
          {`nodes #: ${graph.nodes.length}`}<br/>
          {`edges #: ${graph.edges.length}`}
        </div>}
      </div>
    </div>
  }
}