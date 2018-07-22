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
        onContextMenu={e => e.preventDefault()}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onDoubleClick={this.handleDoubleClick}
        transform={`translate(${data.x},${data.y})`}
        height={data.height}
        width={data.width}
      >
        <foreignObject x="0" y="0" height="500" width="500">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style={
              {
                whiteSpace: 'pre',
                fontSize: '1.5rem',
                border: '2px solid black',
                display: 'inline-block',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
              }
            }
          >
            {data.text}
          </div>
        </foreignObject>
        {/* <rect
          className="nodeElement"
          fill="#ffb"
          stroke="black"
          strokeWidth="2px"
          rx={10}
          height={data.height}
          width={data.width}
          transform='translate(-50%,-50%)'
        /> */}
        {/* <text x={data.x} y={data.y}>
          {data.text}
        </text> */}
      </g>
    )
  }
}
