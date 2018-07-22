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
      <g
        transform={`translate(${data.x - data.width / 2},${data.y - data.height / 2})`}
      >
        <rect
          className='nodeElement'
          height={data.height}
          width={data.width}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onDoubleClick={this.handleDoubleClick}
        />
        <text
          className='node-text'
          x={data.width/2}
          y={data.height/2}
        >
          {data.text}
        </text>
      </g>
    )
  }
}
