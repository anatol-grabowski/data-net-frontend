import React from 'react'
import Node from './node'
import Edge from './edge'
import './graph.css'

export default class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.graphRef = React.createRef()
  }

  componentDidUpdate() {
    console.log('update')
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
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}