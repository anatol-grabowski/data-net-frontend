import React from 'react'
import Graph from './GraphArea'
import Dropzone from 'react-dropzone'
import { uploadFile, makeDownloadLink } from '../../../api/upload.api'
import './graph-render-and-edit-area.css'

export default class GraphAndEditArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    const node = this.state.editing.node
    const uploadResponse = await uploadFile(this.state.attachments[0])
    console.log('uploadResponse:', uploadResponse)
    const newAttachments = uploadResponse.metadatas.map(met => {
      const attachment = {
        filepath: met.path_display,
      }
      return attachment
    })
    console.log('newAtt:', newAttachments)
    if (!node.data.attachments) node.data.attachments = []
    node.data.attachments.push(...newAttachments)
    this.setState({})
  }

  handleAttachmentRemove = async (node, i) => {
    console.log(node.id, i)
    node.data.attachments.splice(i, 1)
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
        onNodeCreate={this.handleNodeCreate}
        onNodeDoubleClick={this.handleNodeDoubleClick}
        onEdgeDoubleClick={this.handleEdgeDoubleClick}
        onNodeMouseDown={this.handleNodeMouseDown}
      />

    </div>
  }
}
