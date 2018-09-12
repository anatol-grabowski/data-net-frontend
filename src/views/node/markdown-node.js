import React from 'react'
import ReactMarkdown from 'react-markdown'

export default class Node extends React.Component {
  render() {
    const data = this.props.node.data
    return (
      <div className="node"
        style={{
          top: data.y + 'px',
          left: data.x + 'px',
        }}
        onMouseDown={this.props.onMouseDown}
        onContextMenu={evt => evt.preventDefault()}
        onMouseUp={this.props.onMouseUp}
        onDoubleClick={this.props.onDoubleClick}
      >
        <ReactMarkdown source={data.text}/>
      </div>
    )
  }
}
