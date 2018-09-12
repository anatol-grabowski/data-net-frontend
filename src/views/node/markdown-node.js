import React from 'react'
import ReactMarkdown from 'react-markdown'
import './markdown-node.css'

export default class Node extends React.Component {
  render() {
    const data = this.props.node.data
    return (
      <div className="node"
        style={{
          top: data.y + 'px',
          left: data.x + 'px',
        }}
        title={data.details}
        onMouseDown={this.props.onMouseDown}
        onContextMenu={evt => evt.preventDefault()}
        onMouseUp={this.props.onMouseUp}
        onDoubleClick={this.props.onDoubleClick}
      >
        <ReactMarkdown className='node-markdown-container' source={data.text}/>
        {data.tags && <NodeTags tags={data.tags}/>}
      </div>
    )
  }
}

function NodeTags({tags}) {
  return (
    <div className='node-tags'>
      {tags.map((tag, i) => <NodeTag key={i} text={tag}/>)}
    </div>
  )
}

class NodeTag extends React.Component {
  render() {
    return (
      <div className='node-tag'>{this.props.text}</div>
    )
  }
}