import React from 'react'

export default class Node extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editing: false}
  }
  handleDoubleClick = event => {
    event.stopPropagation()
    this.setState({editing: true})
  }

  handleEditNode = event => {
    const node = this.props.node
    node.data.text = event.target.value
    this.setState({})
  }

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
        onDoubleClick={this.handleDoubleClick}
      >
        {
          !this.state.editing && <div className='node-text'>
            {data.text}
          </div>
        }
        {
          this.state.editing && <input
            type="text"
            value={data.text}
            onChange={this.handleEditNode}
            onMouseDown={evt => evt.stopPropagation()}
            onKeyDown={evt => evt.keyCode === 13 && this.setState({editing: null})}
          />
        }
      </div>
    )
  }
}