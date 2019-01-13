import React from 'react'
import ReactMarkdown from 'react-markdown'
import Debug from 'debug'
import logChangedProps from '../../utils/log-changed-props'
import './markdown-node.css'

const debug = Debug('markdown-node')

export default class Node extends React.Component {
  componentDidUpdate(prevProps) {
    if (debug.enabled) logChangedProps(this.props, prevProps, debug)
  }

  render() {
    const data = this.props.node.data
    return (
      <div className="node-wrapper"
        style={{
          top: data.y + 'px',
          left: data.x + 'px',
        }}
      >
        <div className="node"
          title={data.details}
          onMouseDown={this.props.onMouseDown}
          onContextMenu={evt => evt.preventDefault()}
          onMouseUp={this.props.onMouseUp}
          onDoubleClick={this.props.onDoubleClick}
        >
          <ReactMarkdown className='node-markdown-container' source={data.text}/>
          <NodeTags tags={data.tags || []}/>
        </div>
        <NodeAttachments attachments={data.attachments}/>
      </div>
    )
  }
}

const NodeTags = ({tags}) => (
  <div className='node-tags'>
    {tags.map((tag, i) => <NodeTag key={i} text={tag}/>)}
  </div>
)

const NodeTag = ({text}) => (
  <div className='node-tag'>{text}</div>
)

const NodeAttachments = ({attachments = []}) => (
  attachments.length > 0 && <div className='node-attachments'>
    <div className='top'></div>
    <div className='bottom'></div>
  </div>
)