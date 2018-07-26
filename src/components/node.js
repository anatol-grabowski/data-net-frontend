import React from 'react'

export default class Node extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditText: false,
    }
  }

  handleMouseDown = event => {
    event.stopPropagation()
    if (event.button === 2) {
      this.props.onStartConnection(this.props.node)
    } else {
      console.log(this.props.node.data.x, this.props.node.data.y)
      this.props.onStartDrag({
        offsetX: event.clientX,
        offsetY: event.clientY,
        initialX: this.props.node.data.x,
        initialY: this.props.node.data.y,
        node: this.props.node,
      })
    }
  };

  handleMouseUp = event => {
    if (event.button === 2) {
      this.props.onFinishConnection(this.props.node)
    }
  };

  handleDoubleClick = () => {
    console.log('edit')
    this.props.onStartEdit(this.props.node)
  };

  render() {
    const data = this.props.node.data
    return (
      <div
        className="node"
        style={{
          top: data.y + 'px',
          left: data.x + 'px',
        }}
        // onContextMenu={e => e.preventDefault()}
        // onMouseDown={this.handleMouseDown}
        // onMouseUp={this.handleMouseUp}
        // onDoubleClick={this.handleDoubleClick}
      >
        <div
          className='node-text'
        >
          {data.text}
        </div>
      </div>
    )
  }
}
