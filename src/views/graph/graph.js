import React from 'react'
import PropTypes from 'prop-types'
import './graph.css'

export default function graph(Node, Edge) {
  function Nodes(props) {
    return (
      <div className='nodes'>
        {
          props.nodes.map(node => <Node
            key={node.id}
            node={node}
            onMouseDown={props.onNodeMouseDown && (evt => props.onNodeMouseDown(node, evt))}
            onMouseUp={props.onNodeMouseUp && (evt => props.onNodeMouseUp(node, evt))}
            onDoubleClick={props.onNodeDoubleClick && (evt => props.onNodeDoubleClick(node, evt))}
          />)
        }
      </div>
    )
  }

  function Edges(props) {
    return (
      <svg className="edges">
        <defs>
          <marker id="arrow" markerWidth="30" markerHeight="10" refX="30" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L30,3 z" fill="#000" />
          </marker>
        </defs>
        <g>
          {
            props.edges.map(edge => <Edge
              key={edge.id}
              edge={edge}
              onDoubleClick={props.onEdgeDoubleClick && (evt => props.onEdgeDoubleClick(edge, evt))}
            />)
          }
        </g>
      </svg>
    )
  }

  class Graph extends React.Component {
    componentDidUpdate() {
      console.log('graph did update')
    }

    render() {
      const graph = this.props.graph
      return (
        <div className="graph">
          <Edges
            edges={graph.edges}
            onEdgeDoubleClick={this.props.onEdgeDoubleClick}
          />
          <Nodes
            nodes={graph.nodes}
            onNodeMouseDown={this.props.onNodeMouseDown}
            onNodeMouseUp={this.props.onNodeMouseUp}
            onNodeDoubleClick={this.props.onNodeDoubleClick}
          />
        </div>
      )
    }
  }

  Graph.propTypes = {
    graph: PropTypes.object,
    onNodeMouseDown: PropTypes.func,
    onNodeMouseUp: PropTypes.func,
    onNodeDoubleClick: PropTypes.func,
    onEdgeMouseDown: PropTypes.func,
    onEdgeMouseUp: PropTypes.func,
    onEdgeDoubleClick: PropTypes.func,
  }

  return Graph
}