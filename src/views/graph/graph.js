import React from 'react'
import PropTypes from 'prop-types'
import './graph.css'

export default function graph(Node, Edge) {
  const Nodes = ({nodes, onNodeMouseDown, onNodeMouseUp, onNodeDoubleClick}) => (
    <div className='nodes'>
      {
        nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            onMouseDown={onNodeMouseDown && (evt => onNodeMouseDown(node, evt))}
            onMouseUp={onNodeMouseUp && (evt => onNodeMouseUp(node, evt))}
            onDoubleClick={onNodeDoubleClick && (evt => onNodeDoubleClick(node, evt))}
          />
        ))
      }
    </div>
  )

  const Edges = ({edges, onEdgeDoubleClick}) => (
    <svg className="edges">
      <defs>
        <marker id="arrow" markerWidth="30" markerHeight="10" refX="30" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L30,3 z" fill="#000" />
        </marker>
      </defs>
      <g>
        {
          edges.map(edge => (
            <Edge
              key={edge.id}
              edge={edge}
              onDoubleClick={onEdgeDoubleClick && (evt => onEdgeDoubleClick(edge, evt))}
            />
          ))
        }
      </g>
    </svg>
  )

  class Graph extends React.Component {
    componentDidUpdate() {
      console.log('graph did update')
    }

    render() {
      const nodes = this.props.graph.nodes
      const edges = this.props.graph.edges
      return (
        <div className="graph">
          <Edges
            edges={edges}
            onEdgeDoubleClick={this.props.onEdgeDoubleClick}
          />
          <Nodes
            nodes={nodes}
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