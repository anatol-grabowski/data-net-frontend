import React from 'react'
import './graph.css'

export default function graph(Node, Edge) {
  return class Graph extends React.Component {
    componentDidUpdate() {
      console.log('graph did update')
    }

    render() {
      const graph = this.props.graph
      return (
        <div className="graph">
          <svg className="edges">
            <g>
              {
                graph.edges.map(edge => {
                  return (
                    <Edge
                      key={edge.id}
                      edge={edge}
                    />
                  )
                })
              }
            </g>
          </svg>
          <div className='nodes'>
            {
              graph.nodes.map(node => {
                return (
                  <Node
                    key={node.id}
                    node={node}
                    onMouseDown={this.props.onNodeMouseDown && (evt => this.props.onNodeMouseDown(node, evt))}
                    onMouseUp={this.props.onNodeMouseUp && (evt => this.props.onNodeMouseUp(node, evt))}
                  />
                )
              })
            }
          </div>
        </div>
      )
    }
  }
}